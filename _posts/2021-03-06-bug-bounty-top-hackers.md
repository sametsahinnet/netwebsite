---
title: 'Bug Bounty: What do the top bug hunters find?'
date: 2021-03-06
permalink: /posts/bug-bounty-top-hackers/
tags:
  - bug bounty
  - How to get started in bug bounty
  - hackerone
  - bug hunter
  - top researchers
  - best bug hunters
  - top bug hunters
  - bugbounty pro
excerpt: 'Bug Bounty: What do the top bug hunters find? An analysis of public HackerOne reviews.'
---

<style type="text/css">
body {
  font-family: Arial, Helvetica, sans-serif;
}
.container {
  margin: 80px auto;
  overflow: hidden;
  width: 100%;
  text-align: center;
}
</style>


## **The reason of the analysis**  
There are many successful bug hunters on the bug bounty platforms and most beginners want to achieve that level of success however settle for low impact findings as they aim to find vulnerabilities using certain methods. For most beginners, a better approach would be to analyze what the top bug hunters find and how to build on top of the know-how and the methods used by bug hunters of more experience. This is why I decided to make a simple analysis with the public “2019 Year in Reviews” and “2020 Year in Reviews” then, I interpreted the results. The analysis is based on the top 1000 hackers who have public reviews (2019) and the top 100 hackers who have public reviews (2020). The results are not the data of all users of the bug bounty platforms.    

  
    
<br>
# Results of the analysis

<style type="text/css">
	.flex-container {
    display: flex;
}

.flex-child {
    flex: 1;
    border: 0px solid #fff;
}  

.flex-child:first-child {
    margin-right: 5px;
} 
</style>

<b>The most reported vulnerabilities:</b>
<div class="container flex-container">
  <div class="flex-child" id="chart1"></div>
  <div class="flex-child" id="chart2"></div>

</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/apexcharts/1.4.6/apexcharts.min.js"></script>
<script id="INLINE_PEN_JS_ID">
    var options = {
  series: [1105, 836, 586, 538, 521, 497,  211, 170, 136, 500],
  chart: {
    width: 400,
    type: 'pie' },
  title: {
  	text:"2019",
  	align:"center",
  	margin: 0,
    offsetX: 0,
    offsetY: 0,
    floating: false,
    style: {
      fontSize:  '24px',
      fontWeight:  'bold',
      color:  '#000'
    },
  },
  legend: {
    show: false
  },

  labels: ['Cross-Site Scripting (XSS)','Information Disclosure', 'Privilege Escalation', 'Improper Access Control', 'IDOR', 'Improper Authentication', 'Open Redirect', 'CSRF', 'SSRF', 'Others'],
  responsive: [{
    options: {
      chart: {
        width: 350 },

      legend: {
        position: 'bottom' } } }] };

var chart = new ApexCharts(document.querySelector("#chart1"), options);
chart.render();
</script>

<script id="INLINE_PEN_JS_ID">
    var options = {
  series: [1210, 823, 720, 466, 447, 412, 366, 75, 70, 70, 61, 58, 56, 51, 140],
  chart: {
    width: 400,
    type: 'pie' }, 
  title: {
  	text:"2020",
  	align:"center",
  	margin: 0,
    offsetX: 0,
    offsetY: 0,
    floating: false,
    style: {
      fontSize:  '24px',
      fontWeight:  'bold',
      color:  '#000'
    },
  },
  legend: {
    show: false
  },
  labels: ['Cross-Site Scripting (XSS)','Information Disclosure', 'Improper Authentication', 'Improper Access Control', 'IDOR', 'Privilege Escalation', 'Information Exposure Through an Error Message', 'Open Redirect', 'Path Traversal', 'Server-Side Request Forgery', 'SQL Injection', 'Cross-Site Request Forgery (CSRF)', 'Violation of Secure Design Principles', 'Improper Authorization', 'Others'],
  responsive: [{
    options: {
      chart: {
        width: 350
      } } }] };

var chart = new ApexCharts(document.querySelector("#chart2"), options);
chart.render();
  </script>




## The most reported bug: XSS
Cross-Site Scripting also known as XSS, is a vulnerability that allows an attacker to **inject HTML and JavaScript** code when the user input is not sanitized. It is the most popular and **number one most reported bug on the bug bounty platforms**. Because it is easy to find, bypass, and exploit. Most of the top bug hunters have custom scanners to find XSS vulnerabilities. If you prefer to find XSS manually, the optimal way to doing that is by looking at the **source code**.  

While everyone has their own way of bounty hunting, I have a few suggestions that I would like to share. Making a difference between other researchers and scanners is simple, work to **improve the impact of XSS**. After, write a **working exploit**. For example, if there is a CSRF-token in the response, select the tag which includes the token. Then, write an exploit that submits a password change request with the collected CSRF token. If you are good with **JavaScript**, you can increase the severity from P3 to P2 and even to P1.


## All roads lead to information disclosures and leaks! 
Information Disclosure is a collection of non-expected (in some cases, expected) behavior while **securing** sensitive data. There is a lot of types of Information Disclosure issues. Generally, if you see data that you are not supposed to be, there is an information disclosure (leakage, exposure) vulnerability. For example, while **fuzzing** the directories, you may find a file that includes confidential data. Or, while you are visiting a friend's profile, you may retrieve their **PII (Personally Identifiable Information) in the response**. You can automate all the unauthenticated services to find information disclosures. Remember, the most critical information disclosures are often discovered by understanding the **application logic**. 
  

## uid=0(root) gid=0(root) groups=0(root)
Privilege Escalation is a weakness that permits attackers to perform an action that they are not authorized to. It occurs in the applications' workflow. For example, a user may ban the admin from the project, and the system assigns the user as a new admin. In this case, the user could escalate their privileges with the **business logic error in the flow**. The scanners cannot find the issue with the default settings. Thus, the privilege escalations need a **hacker mindset** to find. Most of the top bug hunters read the *freaking* manual before testing, especially necessary for API security testing. Reading documentation is a **very effective** (and boring) way of understanding how the application works. With this method, you may able to find privilege escalation weaknesses **easily**.  


## Improper access control weaknesses
Improper Access Control weaknesses occur when the application does not **restrict or incorrectly restricts access to a resource** from an unauthorized actor. For example, a user is not able to access functionality to which they are not authorized, **with a browser**. However, the user can access to the administrative functions **with the API**, without any control or broken controls. This method is a common way to find this weakness. Modern applications prefer client-side mechanisms because it is faster than server-side but at the same time easier to bypass. I suggest you think about the **different access control methods** between the server and the client.  


## Insecure direct object reference 
Insecure Direct Object Reference (IDOR) is a type of Broken Access Control vulnerability. The problem occurs when the application does not check a user from **gaining access to another user’s data** by modifying the identity reference. For example, consider a function that accesses the customer page. When you access the page; you see an ID at the query. If a user changes the ID and could get the data of the modified ID, then there is an IDOR vulnerability that leads to horizontal privilege escalation. **There is no limit to this vulnerability**. Mostly if there is an object referenced with an ID, you may find an IDOR there. IDOR is the **favorite vulnerability** of many researchers.

## Open redirect
Open Redirect is **harmless** in most cases. But that does not mean all instances of open redirect vulnerabilities are harmless. If you have an open redirect at **SSO (Single Sign-On) or Oauth** mechanism, you can **steal the authentication code** of the victim. If you do not want to report a simple open redirect, you can **keep it for an SSRF whitelist bypass or a CSP bypass**. Open Redirect can be a good part of a **bug chain**.   


## Cross-Site request forgery
Cross-Site Request Forgery is used by attackers to send malicious requests from an authenticated user to a web application. The problem occurs when the application does not provide an anti-CSRF token or does not control the token for each request. The impact of CSRF **depends on where the vulnerability**. CSRF vulnerability can lead to a **one-click account takeover**. Such as, an attacker can change the password of your Twitter account with a one-click using this vulnerability. CSRF can be part of the turning Self-XSS into Good XSS. *Unfortunately*, CSRF **started to be killed** by browsers.


## SSRF: Knock knock who is there? -It's me, 169.254.169.254
Server Side Request Forgery (also known as SSRF) vulnerabilities allows an attacker to send malicious requests from the back-end server of a vulnerable web application. An SSRF vulnerability with the **maximum impact might allow an attacker to read the internal files**. Additionally, with an SSRF, an attacker can **scan ports (XSPA)**, **grab the banners**, execute **XSS** payloads, **bypass host-based authentication controls**. Consider that there is an image fetching function. A user gives the URL, and the server brings the file. *"This is not a bug, this is a feature"* so far. When the server tries to fetch the given unexpected URL (payload), the SSRF vulnerability occurs. There are some reasons why SSRF vulnerabilities are so popular. Such as, it is easy to exploit, easy to bypass, and easy to improve the impact with the protocols. But it is hard to find a parameter (endpoint) that is vulnerable to SSRF attacks because it needs a function that can send requests with the given input. Earning bounties with the SSRF requires **keeping an eye open** because SSRF vulnerabilities are rare. 

<br>

<b>Submission severity:</b>
<div class="container flex-container">
  <div class="flex-child" id="chart3"></div>
  <div class="flex-child" id="chart4"></div>

</div>



<script id="INLINE_PEN_JS_ID">
    var options = {
  series: [774, 1765, 3216, 2416],
  chart: {
    width: 400,
    type: 'pie' },
  title: {
  	text:"2019",
  	align:"center",
  	margin: 0,
    offsetX: 0,
    offsetY: 0,
    floating: false,
    style: {
      fontSize:  '24px',
      fontWeight:  'bold',
      color:  '#000'
    },
  },
  legend: {
    show: false
  },

  labels: ['Critical', 'High', 'Medium', 'Low'],
  responsive: [{
    options: {
      chart: {
        width: 350 },

      legend: {
        position: 'bottom' } } }] };

var chart = new ApexCharts(document.querySelector("#chart3"), options);
chart.render();
 </script>

<script id="INLINE_PEN_JS_ID">
    var options = {
  series: [738, 1817, 2757, 2009],
  chart: {
    width: 400,
    type: 'pie' },
  title: {
  	text:"2020",
  	align:"center",
  	margin: 0,
    offsetX: 0,
    offsetY: 0,
    floating: false,
    style: {
      fontSize:  '24px',
      fontWeight:  'bold',
      color:  '#000'
    },
  },
  legend: {
    show: false
  },

  labels: ['Critical', 'High', 'Medium', 'Low'],
  responsive: [{
    options: {
      chart: {
        width: 350 },

      legend: {
        position: 'bottom' } } }] };

var chart = new ApexCharts(document.querySelector("#chart4"), options);
chart.render();
  </script>





## Unfortunately, this was submitted previously by another researcher.
Duplicate reports are the bug hunters' **nightmare**. Consider that after working for hours, you finally find a vulnerability. You report it and wait for it to be triaged. Then you get an email that says: *"Unfortunately, the vulnerability was submitted previously by another researcher."*. As a consequence, **everything goes to another researcher**, **except** one thing: **The experience**. All the experiences that you have, make you a **better researcher**. Yes, it does!   

As a result of this analysis, I saw that **an important percentage of reports are duplicate** even for the top 100 researchers. The duplicate is just a warning that says you should **find unique bugs or be faster**. Learn how to live with them, because they will be always there.  


## URGENT!!! This bug is critical!
The majority of valid bugs have **Medium or Low** severity. To be honest, if you think the bug hunters **hack** all companies, you should change your understanding of the word "hacking". In my opinion, finding an Open Redirect bug, not mean hacking the company. Only a minority of valid bugs have **High or Critical** severity. Finding a critical vulnerability depends on a **comprehensive understanding** of how the application works or depends on **unusual techniques**.    

## Signal and Impact  
In my opinion, the signal and the impact stats is what separates successful hunters from the rest. Keep your signal high with **valid reports**. Then, keep your impact high with the **vulnerability chains**, and focus on **important functions** of the application.




## Collaboration  
Sometimes a bug hunter sticks with a vulnerability and usually cannot find a way to exploit or improve the impact. The best thing to do at moments like this is to collaborate. If you are looking for a hunter to collaborate, you can use <a href="https://findhunters.com/">https://findhunters.com/</a>   




<hr>

# The Recipe...
My four year experience in bounty hunting has taught me that bug bounty becomes easier with the following recipe:  <br><br>
<b style="color:red">Enumeration + Fuzzing + Collaborate + to understand the application = Bounty</b>  
- **Enumerate**, for finding unusual applications and services.  
- **Understand the application**, to find different ways to increase the impact.   
- **Collaborate**, for learning from different approaches.
- **Fuzz**, for identifying unusual behaviors of the application.  

<br>

Thanks for reading.

<hr>

**Thanks for their support on this blog post**  
Berk Cem Göksel (https://twitter.com/berkcgoksel)  
Evren Yalçın (https://twitter.com/evrnyalcin)     
Mert Taşçı (https://twitter.com/mertistaken)   
Dr. Süleyman Özarslan (https://twitter.com/su13ym4n)   



**References**  
https://blog.convisoappsec.com/en/privilege-escalation-how-it-can-affect-application-security/
https://blog.detectify.com/2019/01/10/what-is-server-side-request-forgery-ssrf/
https://capec.mitre.org/data/definitions/233.html
https://cwe.mitre.org/data/definitions/284.html
https://hackerone.com/reports/816143
https://owasp.org/www-community/attacks/csrf
https://owasp.org/www-community/attacks/Server_Side_Request_Forgery
https://portswigger.net/web-security/access-control
https://portswigger.net/web-security/access-control/idor
https://portswigger.net/web-security/csrf
https://portswigger.net/web-security/ssrf
https://www.acunetix.com/blog/articles/server-side-request-forgery-vulnerability/
https://www.bugcrowd.com/blog/how-to-find-idor-insecure-direct-object-reference-vulnerabilities-for-large-bounty-rewards/
https://www.hackerone.com/blog/hackerone-top-10-most-impactful-and-rewarded-vulnerability-types
https://www.hackerone.com/top-10-vulnerabilities
https://www.immuniweb.com/vulnerability/improper-access-control.html
https://www.netsparker.com/blog/web-security/cross-site-scripting-xss/
https://www.netsparker.com/blog/web-security/information-disclosure-issues-attacks/
https://www.netsparker.com/blog/web-security/owasp-top-10/
https://www.netsparker.com/blog/web-security/same-site-cookie-attribute-prevent-cross-site-request-forgery/
https://www.netsparker.com/blog/web-security/server-side-request-forgery-vulnerability-ssrf/



  

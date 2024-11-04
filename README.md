# Philippine Online Physics Olympiad CMS
> Version 2.1.0

The Philippine Online Physics Olympiad (stylized as (PhO)^2) is an annual contest held by the Physics Youth Honor Society of the PSHS-Main Campus devoted to promoting a shared interest in the field of physics while offering high school students the opportunity to express their skills and competence through an online collaborative battle of the smarts. This repository represents the development resources behind its content management system (CMS), which is currently in its fourth year.

The website may currently be viewed at <a href="http://pho-2-official.org/">pho-2-official.org</a>.

> Note to devs: the semantic library can be built using the command `npx gulp build` (inside the `libs/semantic/` folder), after which the resulting `libs/semantic/dist/` folder can be copied into the project as `src/public/semantic/`.

Note to devs: the semantic library can be built using the command `npx gulp build` (inside the `libs/semantic/` folder), after which the resulting `libs/semantic/dist/` folder can be copied into the project as `src/public/semantic/`.

<br>

<p align="center">
<img src="./README/images/UI/PhO2 Landing Page.png">
</p>

<br>
<br>
<div style="text-align: center; overflow-x: hidden;">
<pre style="display: block; margin-left: 0;text-align: left;">
	
	         |\      _,,,---,,_
      ZZZzz /,`.-'`'    -.  ;-;;,_
           |,4-  ) )-,_. ,\ (  `'-'
            '---''(_/--'  `-'\_)
      
      [Mo David @2022-@2024]
</pre>
</div>

---
# Table of Contents



## 1 Project File Structure

```
📦pho2-2.0-official
 ┣ 📂middleware
 ┃ ┣ 📜auth.js
 ┃ ┣ 📜check.js
 ┃ ┗ 📜identify.js
 ┣ 📂models
 ┃ ┣ 📜problem.js
 ┃ ┣ 📜score.js
 ┃ ┣ 📜submission.js
 ┃ ┗ 📜user.js
 ┣ 📂public
 ┃ ┣ 📂admin
 ┃ ┃ ┣ 📜dashboard.html
 ┃ ┃ ┣ 📜dashboard.js
 ┃ ┃ ┗ 📜navbar.js
 ┃ ┣ 📂resources
 ┃ ┃ ┣ 📂icons
 ┃ ┃ ┃ ┣ 📜search-icon.png
 ┃ ┃ ┃ ┗ 📜trash-icon.png
 ┃ ┃ ┗ 📂images
 ┃ ┃ ┃ ┗ 📜pyhs-banner.png
 ┃ ┣ 📂user
 ┃ ┃ ┣ 📜dashboard.html
 ┃ ┃ ┣ 📜dashboard.js
 ┃ ┃ ┗ 📜navbar.js
 ┃ ┣ 📂utils
 ┃ ┃ ┣ 📜answer.js
 ┃ ┃ ┣ 📜header.js
 ┃ ┃ ┣ 📜regex.js
 ┃ ┃ ┗ 📜xhr.js
 ┃ ┣ 📜fb-embed-pyhs.html
 ┃ ┣ 📜fb-embed-ymsat.html
 ┃ ┣ 📜home-redirect.html
 ┃ ┣ 📜home.html
 ┃ ┣ 📜leaderboard.html
 ┃ ┣ 📜pho-2-official-logo.png
 ┃ ┗ 📜problems.html
 ┣ 📂routes
 ┃ ┣ 📜adminroutes.js
 ┃ ┣ 📜authroutes.js
 ┃ ┗ 📜userroutes.js
 ┣ 📜README.md
 ┣ 📜package-lock.json
 ┣ 📜package.json
 ┗ 📜server.js
```

### 1.1 `server.js` File

This file represents the entry point into running the website. It is the main file of the server of the CMS.

### 1.2 `/middleware` Folder

Contains middleware (basically utility functions and services) that aids with executing some processes on the website. The three main services implemented here are for authorization, answer checking, and user identification. In hindsight, this folder would've better been named "services", as middleware is a more technical term that usually refers to processes that execute between client requests and server jobs. You can check out the [Source Code Components](#3-source-code-components) section for more detailed information on the individual files. 

### 1.3 `/models` Folder

These js files represent the structure of the information stored by the database. The four primary objects are the following: problems (the contest problems), scores (stores information on individual user scores, alongside their submission statuses), submissions (stores submissions parameters such as the final verdict and what not), and users (some simple user account data). Again, you can check out the [Source Code Components](#3-source-code-components) section for more detailed information on the individual files. 

### 1.4 `/public` Folder

The public folder represents all the files and assets visible to the clients. There are two separate implementations of the UI: one for regular user clients and another for admin clients. The differences are purely aesthetic and do not offer users the capability to elevate permissions by hijacking (or running) the admin html code (if they somehow found it).

The utils folder contained herein offers some IO handling functionalities, since we can't trust users to input the right things, although admin inputs are no longer format checked. Other utilities for things like internal HTTP requests are also implemented. The files are explained in more detail in [Source Code Components](#3-source-code-components).

---
## 2 AWS Management

<p align="center">
	<img src="./README/images/AWS/AWS Logo.jpg">
</p>

In the case of this CMS, we will be using Amazon Web Services (AWS) to host all its features.

If you are a member of the Philippine Youth Honor Society (PYHS) and wish to contribute as a developer of (PhO)^2, send an email to `modavid.1964@gmail.com` with the subject line `(PhO)^2 Developer Request`. Only users provided with access to the AWS account can contribute to the development of the (PhO)^2 CMS.

### 2.1 AWS Navigation Guide

If this is your first time using AWS to help manage (PhO)^2, it might be best to read this section thoroughly. For any questions, please do not hesitate to contact the head developer.

Developers will be given access to the (PhO)^2 website through an invitation sent to their inboxes. This invitation will prompt them to register under the (PhO)^2 organization in AWS and will give them developer permissions to manage the resources of the (PhO)^2 CMS. After following the instructions highlighted by the email, they should be greeted by the access portal (the link is also provided in the email in case this does not happen automatically). Clicking on the `AWS Account` icon will show the `(PhO)^2 Organization` account; clicking this will then enumerate the different permissions available to a user. For developers, the two default permissions available are the `DatabaseAdministrator` and `NetworkAdministrator` permissions. The `Management console` button to the right of these will open options to manage the pertinent resources.

<p align="center">
	<img src="./README/images/AWS/AWS Access Portal.jpg">
</p>

> **NOTE:** `AdministratorAccess` will be restricted to the head developer to ensure the security of the CMS.

#### 2.1.1 Connecting to the Server via SSH

The actual server is hosted by a linux instance on one of AWS's devices somewhere on the planet (a computer running linux with everything the CMS needs to function). For the case of the (PhO)^2 CMS, an Ubuntu Linux distro is used by this computer.

This part is only necessary for uploading files to the CMS server (the backend software and what not). Guides for how to do this can be found [here](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/connect-to-linux-instance.html). If ever a developer wishes to follow this guide, a private key is required; for the private key needed to access the server, it is possible to request one from the head developer.

> **WARNING:** The private key must not be shared with anyone else. It has the capacity to provide an individual with direct access to the server of the CMS (and we all know how detrimental that can be).

#### 2.1.2 Managing Server Files

hmm

#### 2.1.3 Interacting with the Server via SCP

hmmm

### 2.2 Managing the Server



### 2.3 Managing the Database


### 2.4 Running on AWS

---
## 3 Source Code Components

This section outlines the composition of the code of the CMS. You may refer to [Project File Structure](#1-project-file-structure) for a basic outline of the code.

---
## 4 Contacts and Other Info


<div style="text-align: center; overflow-x: hidden;">
<pre style="display: inline-block margin-left: -100%; margin-right: -100%; text-align: left;">




                                                        |\      _,,,---,,_
                                                 ZZZzz /,`.-'`'    -.  ;-;;,_
                                                      |,4-  ) )-,_. ,\ (  `'-'
                                                     '---''(_/--'  `-'\_)

</pre>
</div>


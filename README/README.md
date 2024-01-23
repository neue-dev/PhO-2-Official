# (PhO)^2 Official Content Management Site
> Version 2.0

<div style="text-align: center; overflow-x: hidden;">
<pre style="display: inline-block margin-left: -100%; margin-right: -100%; text-align: left;">


										    ..           ,,              ..      /\         
										  pd'`7MM"""Mq.`7MM               `bq   //\\        
										 6P    MM   `MM. MM                 YA //  \\       
										6M'    MM   ,M9  MMpMMMb.  ,pW"Wq.  `Mb     pd*"*b.
										MN     MMmmdM9   MM    MM 6W'   `Wb  8M    (O)   j8
										MN     MM        MM    MM 8M     M8  8M        ,;j9 
										YM.    MM        MM    MM YA.   ,A9 ,M9     ,-='    
										 Mb  .JMML.    .JMML  JMML.`Ybmd9'  dM     Ammmmmmm 
										  Yq.                             .pY               
											  ``                           ''                 



</pre>
</div>

The Philippine Online Physics Olympiad is an annual contest held by the Physics Youth Honor Society of the PSHS-Main Campus devoted to promoting a shared interest in the field of physics while offering high school students the opportunity to express their skills and competence through an online collaborative battle of the smarts. This repository represents the development resources behind its content management system (CMS).

<br>
<div style="text-align: center; overflow-x: hidden;">
<pre style="display: inline-block margin-left: -100%; margin-right: -100%; text-align: left;">


                                                        |\      _,,,---,,_
                                                 ZZZzz /,`.-'`'    -.  ;-;;,_
                                                      |,4-  ) )-,_. ,\ (  `'-'
                                                     '---''(_/--'  `-'\_)


																					[Mo David @2022-@2023]
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
 ┃ ┣ 📜pho-2-logo.png
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
	<img src="./images/AWS/AWS Logo.jpg">
</p>

In the case of this CMS, we will be using Amazon Web Services (AWS) to host all its features.

If you are a member of the Philippine Youth Honor Society (PYHS) and wish to contribute as a developer of (PhO)^2, send an email to `modavid.1964@gmail.com` with the subject line `(PhO)^2 Developer Request`. Only users provided with access to the AWS account can contribute to the development of the (PhO)^2 CMS.

### 2.1 AWS Navigation Guide

If this is your first time using AWS to help manage (PhO)^2, it might be best to read this section thoroughly. For any questions, please do not hesitate to contact the head developer.

Developers will be given access to the (PhO)^2 website through an invitation sent to their inboxes. This invitation will prompt them to register under the (PhO)^2 organization in AWS and will give them developer permissions to manage the resources of the (PhO)^2 CMS. After following the instructions highlighted by the email, they should be greeted by the access portal (the link is also provided in the email in case this does not happen automatically). Clicking on the `AWS Account` icon will show the `(PhO)^2 Organization` account; clicking this will then enumerate the different permissions available to a user. For developers, the two default permissions available are the `DatabaseAdministrator` and `NetworkAdministrator` permissions. The `Management console` button to the right of these will open options to manage the pertinent resources.

<p align="center">
	<img src="./images/AWS/AWS Access Portal.jpg">
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

### 2.4 The `.env` File

<!-- ! WHERE TO LOCATE THE ENV FILE -->

The `.env` file contains a number of parameters, each explained in the table below. These parameters must be configured before the website can run properly. The default values must be replaced as these are only there for development purposes.

| Environment Variable   | Purpose                                                                                                                                                                                                                                                                                | Default Value                     |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| `DATABASE_URL`         | Points to the location of the database and allows the server to access the database and make requests to it.                                                                                                                                                                           | `mongodb://localhost:27017/pho-2` |
| `ACCESS_TOKEN_SECRET`  | A secret string used to encrypt JWT access tokens given to users. You can keep the value as is, so long as it has not been made public. If the value is compromised (for some reason someone else has access to the string), replace it immediately with any sufficiently long string. | `<SECRET>`                        |
| `REFRESH_TOKEN_SECRET` | As opposed to access tokens, refresh tokens allow user sessions to occur. Nonetheless, they serve the same purpose of encrypting data and must not be made public. Again, replace this string if it becomes compromised in any way.                                                    | `<SECRET>`                        |
| `SUBMISSION_COOLDOWN`  | The minimum length of time in seconds between two valid submissions from a given user account. In other words, a user cannot submit more than once before this cooldown has expired.                                                                                                   | `300`                             |
| `CONTEST_START`        | Refers to the Unix timestamp (in milliseconds) that indicates the exact start of the contest.                                                                                                                                                                                          | `0`                               |
| `CONTEST_END`          | Refers to the Unix timestamp (in milliseconds) that indicates the exact end of the contest.                                                                                                                                                                                            | `259200000`                       |

### 2.5 

To begin the code


### 2.6 Running on AWS

```
# Windows
> main.exe full
``` 

```
# Unix
> main.exe full
``` 

---
## 3 Source Code Components

This section outlines the composition of the code of the game. All files and folders mentioned here are under the `/src` folder described in [Project File Structure](#1-project-file-structure).

### 3.1 `game.c` File

Think of `game.c` as nothing more than a main file that handles the configuration of all the other game components.

### 3.2 `/game` Folder

All the actual game components (such as game class, game state management, game data and assets, and game mode implementations) are contained in this folder. The different subfolders are also outlined below.

| File                 | Description                                                                                                                                                                                                                                        |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `game.assets.h`      | The file stores the ASCII art required by the full mode of the game. It also holds a bit of the dialogue printed out by the game, although the rest of these seem to be scattered across both the `game.manager.h` and `game.manager.min.h` files. |
| `game.catalogue.h`   | The file stores the information regarding the different crops available in the game. Initially, another crop (the apple) was available, although the course specifications seem to disallow the inclusion of additional crops.                     |
| `game.manager.h`     | This file manages the flow of the full mode of the game. Interestingly, it is not the longest file within the game.                                                                                                                                |
| `game.manager.min.h` | The file manages the flow of the default mode of the game.                                                                                                                                                                                         |

> **NOTE:** The reason `game.manager.min.h` has `.min` appended to it is because the initial version of Harvest Sun *was the full mode* of the game. Eventually, however, a reexamination of the course specifications prompted the author to reconsider what the "default" mode of the game should be.

#### 3.2.1 `/game/classes` Folder

The different instantiable classes of the game are implemented in this folder.

| File                   | Description                                                                                                                                                                                                                                                                                         |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `game.class.plot.h`    | The class refers to the individual plots stored within the grid layout of the farm. An instance of this class stores information on the state of the plot (for example, whether or not it is tilled) and holds an instance of the `game.class.product.h` class if something has been planted on it. |
| `game.class.product.h` | An instance of this class represents a "plant" of sorts. The instance keeps track of the growth state of the crop alongside its other parameters.                                                                                                                                                   |
| `game.class.stock.h`   | This class acts like a container which helps store an amount of crops. It is used by both the `game.obj.player.h` and `game.obj.shop.h` to store the amount of seeds or crops they have in their respective inventories. The prices associated with buying or selling a crop type may also be computed through the methods provided by this class. |

#### 3.2.2 `/game/enums` Folder

Enums were used primarily to store the state of different elements of the game. The actual enum items were prefaced by the type they belong to; this avoided the possibility of name clashes while the developing the game.

| File                | Description                                                                                                                                                                                                                                               |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `game.enums.farm.h` | Enums for plot states and farm actions are stored here. Farm action enums allow the use of switch statements to handle different farm actions.                                                                                                            |
| `game.enums.shop`   | Enums for shop actions are stored here. Again, this helps with implementing switch statements.                                                                                                                                                            |
| `game.enums.state`  | Enums for game states are stored here. Two different enums are implemented (`GameState` and `PlayState`), although one would've worked perfectly fine if only the author had thought about that sooner. Enums for handling dialog boxes are also present. |

#### 3.3.3 `/game/objects` Folder

A distinction between objects and classes must be made here. The author takes it that classes are meant to be instantiable. Objects, on the other hand, are often singletons within a code framework.

| File                | Description                                                                                                                                                                                                                                                  |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `game.obj.farm.h`   | This object handles the management of the farm and deals with the primary UI and IO functionalities associated with the farm. The farm is visually represented by a grid array, although under the hood it is actually stored as a single-dimensional array. |
| `game.obj.player.h` | The player object manages the state of the player and abstracts the actions the user can perform within the game.                                                                                                                                            |
| `game.obj.shop.h`   | The shop object allows the player to acquire seeds throughout the game. It also allows the player to sell their crops following a harvest. |

### 3.3 `/utils` Folder

The utils folder handles most of the low-level functionality not necessarily associated with the game. Things related to input, output, and console handling are placed here. The following are the files contained within the folder:

| File               | Description                                                                                                                                                                                                                                                                                                                                             |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `utils.io.h`       | Unifies the differences in C implementation of Windows and Unix systems by creating common functions that help handle IO functionality. Most importantly, it handles the behaviour and properties of the console itself.                                                                                                                                |
| `utils.key.h`      | Contains functions that read user input and perform actions based on those. The main implementations in here are read/write polls with callbacks; in other words, functions that repeatedly read the input buffer and execute a "before" and "after" callback for each keystroke. The function also provides utilities for evaluating character values. |
| `utils.selector.h` | A utility class (yes, it's a struct, but it behaves almost like an instantiable class) that makes it much more convenient to code a selection of items. It has methods (yes, they're not really methods but they behave pretty much like methods) that help the user to interact with the class.                                                        |
| `utils.text.h`     | Another utility class that makes it easier to create blocks of text that will be displayed later to the console. Instances of the class basically act as output buffers that store content before it is outputed to the screen.                                                                                                                         |
| `utils.ui.h`       | Handles functionality associated with printing to the console. It also contains implementations of functions that directly interact with instances of the `utils.text.h` class. These functions allow the possibility to format content (for instance, centering text or adding a constant footer).                                                     |

> **NOTE:** Prematurely exiting the program in a Unix environment may prevent the program from reverting the terminal settings to their configuration prior to the execution of the program. In other words, if it ever happens you hit `Ctrl+C` while running the program in Unix, you may have to restart the terminal.

---
## 6 Contacts and Other Info


<div style="text-align: center; overflow-x: hidden;">
<pre style="display: inline-block margin-left: -100%; margin-right: -100%; text-align: left;">




                                                        |\      _,,,---,,_
                                                 ZZZzz /,`.-'`'    -.  ;-;;,_
                                                      |,4-  ) )-,_. ,\ (  `'-'
                                                     '---''(_/--'  `-'\_)

</pre>
</div>


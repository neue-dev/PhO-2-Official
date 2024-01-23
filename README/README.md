# (PhO)^2 Official Website
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

The Philippine Online Physics Olympiad is an annual contest held by the Physics Youth Honor Society of the PSHS-Main Campus devoted to promoting a shared interest in the field of physics while offering high school students the opportunity to express their skills and competence through an online collaborative battle of the smarts.

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

This file represents the entry point into running the website. Go to [How to Run](#2-how-to-run) to see how this file can be executed.

### 1.2 `/middleware` Folder

Contains middleware (basically utility functions and services) that aids with executing some processes on the website. The three main things services implemented here are for authorization, answer checking, and user identification. In hindsight, this folder would've better been named "services", as middleware is a more technical term that usually refers to processes that execute between client requests and server jobs. You can check out the [Source Code Components](#3-source-code-components) section for more detailed information on the individual files. 

### 1.3 `/models` Folder

These js files represent the structure of the information stored by the database. The four primary objects are the following: problems (the contest problems), scores (stores information on individual user scores, alongside their submission statuses), submissions (stores submissions parameters such as the final verdict and what not), and users (some simple user account data). Again, you can check out the [Source Code Components](#3-source-code-components) section for more detailed information on the individual files. 

### 1.4 `/public` Folder

The public folder represents all the files and assets visible to the clients. There are two separate implementations of the UI: one for regular user clients and another for admin clients. The differences are purely aesthetic and do not offer users the capability to elevate permissions by hijacking (or running) the admin html code (if they somehow found it).

The utils folder contained herein offers some IO handling functionalities, since we can't trust users to input the right things, although admin inputs are no longer format checked. Other utilities for things like internal HTTP requests are also implemented. The files are explained in more detail in [Source Code Components](#3-source-code-components).

---
## 2 Deploying The Website on AWS

In the case of this website, we will be using Amazon Web Services (AWS) to host all its features.

### 2.1 Setting Up The Database

Before anything else can operate, the database must first be initialized. In the case of this website, we are using Amazon Web Services (AWS) to host all the features of this website, and we will let MongoDB (running through AWS) to manage our database and its contents.

### 2.2 Configuring The .env File

The `.env` file contains a number of parameters, each explained in the table below. These parameters must be configured before the website can run properly. The default values must be replaced as these are only there for development purposes.

| Environment Variable   | Purpose                                                                                                                                                                                                                                                                                | Default Value                     |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| `DATABASE_URL`         | Points to the location of the database and allows the server to access the database and make requests to it.                                                                                                                                                                           | `mongodb://localhost:27017/pho-2` |
| `ACCESS_TOKEN_SECRET`  | A secret string used to encrypt JWT access tokens given to users. You can keep the value as is, so long as it has not been made public. If the value is compromised (for some reason someone else has access to the string), replace it immediately with any sufficiently long string. | `<SECRET>`                        |
| `REFRESH_TOKEN_SECRET` | As opposed to access tokens, refresh tokens allow user sessions to occur. Nonetheless, they serve the same purpose of encrypting data and must not be made public. Again, replace this string if it becomes compromised in any way.                                                    | `<SECRET>`                        |
| `SUBMISSION_COOLDOWN`  | The minimum length of time in seconds between two valid submissions from a given user account. In other words, a user cannot submit more than once before this cooldown has expired.                                                                                                   | `300`                             |
| `CONTEST_START`        | Refers to the Unix timestamp (in milliseconds) that indicates the exact start of the contest.                                                                                                                                                                                          | `0`                               |
| `CONTEST_END`          | Refers to the Unix timestamp (in milliseconds) that indicates the exact end of the contest.                                                                                                                                                                                            | `259200000`                       |

### 2.2 

To begin the code


### 2.3 Running on AWS

```
# Windows
> main.exe full
``` 

```
# Unix
> main.exe full
``` 

#### 2.3.1 Full Mode

Full mode is a feature-rich version of Harvest Sun that adds additional content and functionality aside from those demanded by the course specifications.  To run full mode, simply type the following:

```
# Windows
> main.exe full
``` 

```
# Unix
> ./main full
```

The additional features implemented in full mode include:

- The ability to modify individual plots
- Independence of individual crops (different instances of the same crop may be updated differntly)
- Immersive and detailed UI (including a responsive grid layout of the farm)
- Robust keyboard navigation
- Screen size warnings

#### 2.3.2 Debug Mode

Debug mode is only available for the full mode implementation of Harvest Sun, and allows the user to skip the preliminary keystrokes necessary to configure the farm and what not. To run debug mode:

```
# Windows
> main.exe debug
``` 

```
# Unix
> ./main debug
```

A third argument may be specified to dictate where the program starts out when debugging. The following are the valid commands accepted by the program:


```
# Windows
> main.exe debug play
> main.exe debug farm
> main.exe debug shop
``` 

```
# Unix
> ./main debug play
> ./main debug farm
> ./main debug shop
``` 

> **NOTE:** specifying `debug play` produces the same result as just typing `debug` without a third argument.

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
## 4 Code Overview

### 4.1 Test Script

This section of the documentation is only here as per the requirements of the course. The author has decided to omit functions that serve no direct purpose to the behaviour of the game (functions related **solely** to input and output) given the fact that there are well over a hundred functions within the purview of this framework. Additionally, some basic getter and setter functions which do not have a diverse set of input cases have been omitted (for instance, something like `Thing_getName()` just returns a constant `char *`; you won't expect the behaviour of this function to change significantly under different circumstances); nevertheless, even those functions included by the author may at times have only two sample input sets (it was really hard trying not to exclude most of the functions, and so those included here might not even have more than two sample input sets; it wouldn't make sense to give three different test cases for something like `Thing_toggleBoolean()`; its either true or false and nothing else).

> **NOTE:** The sample inputs contained here don't only refer to function arguments or user inputs; they may refer to the internal state of the program, which may itself be the "input" of certain functions here.

> **PS:** Before anyone goes on thinking this was all typed manually: the following table of functions was systematically obtained by creating a python script that would parse all the files contained within the `/src` folder. The said python script is not included in the project folder.

<!----- game.class.plot.h ----->
<br>
<table style="font-size: 13px">
  <colgroup>
    <col span="1" style="width: 3%;">
    <col span="1" style="width: 10%;">
    <col span="1" style="width: 10%;">
    <col span="1" style="width: 22%;">
    <col span="1" style="width: 22%;">
    <col span="1" style="width: 22%;">
    <col span="1" style="width: 11%;">
  </colgroup>
	<tr>
		<th> # </th>
		<th colspan="3"> Functions in <code>game.class.plot.h</code> </th>
		<th colspan="3"> Description </th>
	</tr>
	<tr>
		<td>1</td>
		<td colspan="3"><pre style="background: 0;  white-space: pre-wrap;">int Plot_till(struct Plot *this) </pre></td>
		<td colspan="3"> Tills a plot instance.<br></td>
	</tr>
	<tr>
		<td style="background: #d0d7de;"></td>
		<td colspan="2"><i>Test Description</i></b></td>
    <td><i>Sample Input</i></td>
		<td><i>Expected Result</i></td>
		<td><i>Actual Result</i></td>
		<td><i>Pass / Fail</i></td>
	</tr>
	<tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
The plot is currently in the <code>PLOT_UNTILLED</code> state.    
    </td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->eState = PLOT_UNTILLED;<br>
<i>// The internal state of the plot instance</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->eState = PLOT_TILLED;<br>
<i>// The function should update the value of its state to PLOT_TILLED and return 1.</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->eState = PLOT_TILLED;<br>
<i>// The state of the instance becomes PLOT_TILLED and the function returns a true value.</i>
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
	<tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
The plot is currently not in the <code>PLOT_UNTILLED</code> state.  
    </td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->eState = PLOT_SOWN;<br>
<i>// The internal state of the plot instance</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->eState = PLOT_SOWN;<br>
<i>// The function should do nothing and return 0.</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->eState = PLOT_SOWN;<br>
<i>// The state of the instance does not change and the function returns a false value.</i>    
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
	<tr>
		<td>2</td>
		<td colspan="3"><pre style="background: 0;  white-space: pre-wrap;">int Plot_sow(
	struct Plot *this,
	struct Product *pProduct
) </pre></td>
		<td colspan="3"> Plants a crop on a plot if it is in the <code>PLOT_TILLED</code> state.<br></td>
	</tr>
	<tr>
		<td style="background: #d0d7de;"></td>
		<td colspan="2"><i>Test Description</i></b></td>
    <td><i>Sample Input</i></td>
		<td><i>Expected Result</i></td>
		<td><i>Actual Result</i></td>
		<td><i>Pass / Fail</i></td>
	</tr>
	<tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
The plot is in the <code>PLOT_TILLED</code> state.    
    </td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Argument Values &ast;&ast;/</b>
pProduct = Product_create( PRODUCT_CORN, (GameCatalogue *), 0);<br>
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->eState = PLOT_TILLED;<br>
<i>// The internal state of the plot instance</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->eState = PLOT_SOWN;
this->pProduct = Product_create( PRODUCT_CORN, (GameCatalogue *), 0);<br>
<i>// The function should update the state of the plot and store the product instance provided.</i><br>
<i>// The function should also return 1.</i>    
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->eState = PLOT_SOWN;
this->pProduct = Product_create( PRODUCT_CORN, (GameCatalogue *), 0);<br>
<i>// The function updates the state of the instance to PLOT_SOWN and stores the product instance passed to it.</i><br>
<i>// The function returns a true value.</i>
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
  <tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
The plot is not in the <code>PLOT_TILLED</code> state.    
    </td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->eState = PLOT_TILLED;<br>
<i>// The internal state of the plot instance</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->eState = PLOT_TILLED;<br>
<i>// The function should do nothing and return 0.</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->eState = PLOT_TILLED;<br>
<i>// The function simple returns a false value.</i>      
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
	<tr>
		<td>3</td>
		<td colspan="3"><pre style="background: 0;  white-space: pre-wrap;">int Plot_water(
	struct Plot *this,
	int dTime
) </pre></td>
		<td colspan="3"> Waters the crop on the plot. A plot in the <code>PLOT_SOWN</code> state always has a crop on it.<br></td>
	</tr>
	<tr>
		<td style="background: #d0d7de;"></td>
		<td colspan="2"><i>Test Description</i></b></td>
    <td><i>Sample Input</i></td>
		<td><i>Expected Result</i></td>
		<td><i>Actual Result</i></td>
		<td><i>Pass / Fail</i></td>
	</tr>
  <tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
The plot is in the <code>PLOT_SOWN</code> state.
    </td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->eState = PLOT_SOWN;
this->pProduct = (struct Product *);<br>
<i>// The internal state of the plot instance and its stored product.</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<i>// The function should call the Product_water() function on its product instance member.</i><br>
<i>// The function should return 1 for a successful execution.
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<i>// The function performs Product_water(this->pProduct, dTime) and returns the value returned by the process.</i>
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
  <tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
The plot is not in the <code>PLOT_SOWN</code> state.
    </td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->eState = PLOT_TILLED;
this->pProduct = NULL;<br>
<i>// The internal state of the plot instance and its stored product.</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->eState = PLOT_TILLED;
this->pProduct = NULL;<br>
<i>// The function should do nothing and return 0.</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->eState = PLOT_TILLED;
this->pProduct = NULL;<br>
<i>// The function simply returns a 0.</i> 
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
	<tr>
		<td>4</td>
		<td colspan="3"><pre style="background: 0;  white-space: pre-wrap;">int Plot_harvest(struct Plot *this) </pre></td>
		<td colspan="3"> Harvests a plot if it has a crop on it. The function does not check for the growth state of the crop, although it is a precondition.<br></td>
	</tr>
	<tr>
		<td style="background: #d0d7de;"></td>
		<td colspan="2"><i>Test Description</i></b></td>
    <td><i>Sample Input</i></td>
		<td><i>Expected Result</i></td>
		<td><i>Actual Result</i></td>
		<td><i>Pass / Fail</i></td>
	</tr>
	<tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
The plot is in the <code>PLOT_SOWN</code> state.
    </td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->eState = PLOT_SOWN;
this->pProduct = (struct Product *);<br>
<i>// The internal state of the plot instance and its stored product.</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->eState = PLOT_UNTILLED;
this->pProduct = NULL;<br>
<i>// The function should destroy the product stored by the instance and revert the plot to its default state.</i><br>
<i>// A 1 should also be returned.</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->eState = PLOT_UNTILLED;
this->pProduct = NULL;<br>
<i>// The function destroys the product stored by the instance and reverts the plot to a PLOT_UNTILLED state while returning a 1.</i> 
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
  <tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
The plot is not in the <code>PLOT_SOWN</code> state.
    </td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->eState = PLOT_TILLED;
this->pProduct = NULL;<br>
<i>// The internal state of the plot instance and its stored product.</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->eState = PLOT_TILLED;
this->pProduct = NULL;<br>
<i>// The function should do nothing and return 0.</i><br>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->eState = PLOT_TILLED;
this->pProduct = NULL;<br>
<i>// The function just returns a 0.</i> 
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
</table>
<br>

<!----- game.class.product.h ----->
<table style="font-size: 13px">
  <colgroup>
    <col span="1" style="width: 3%;">
    <col span="1" style="width: 10%;">
    <col span="1" style="width: 10%;">
    <col span="1" style="width: 22%;">
    <col span="1" style="width: 22%;">
    <col span="1" style="width: 22%;">
    <col span="1" style="width: 11%;">
  </colgroup>
	<tr>
		<th> # </th>
		<th colspan="3"> Functions in <code>game.class.product.h</code> </th>
		<th colspan="3"> Description </th>
	</tr>
	<tr>
		<td>5</td>
		<td colspan="3"><pre style="background: 0;  white-space: pre-wrap;">int Product_getState(struct Product *this) </pre></td>
		<td colspan="3"> A function that returns the growth state of the crop.
 0 means the crop is less than halfway being fully watered.
 1 means the crop is at least halfway being fully watered.
 2 means the crop has been fully watered.<br></td>
	</tr>
	<tr>
		<td style="background: #d0d7de;"></td>
		<td colspan="2"><i>Test Description</i></b></td>
    <td><i>Sample Input</i></td>
		<td><i>Expected Result</i></td>
		<td><i>Actual Result</i></td>
		<td><i>Pass / Fail</i></td>
	</tr>
	<tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
The crop has not been watered yet.
    </td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
<i>// The internal state of the product instance.</i><br>
this->dWaterAmt = 0;
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<i>// The function should return 0.</i><br>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<i>// The function just returns a 0.</i> 
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
  <tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
The crop has been fully watered.
    </td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
<i>// Its watering status is equal to this->dWaterReq.</i><br>
this->dWaterAmt = 8;
this->dWaterReq = 8;
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<i>// The function should return 2.</i><br>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<i>// The function returns a 2.</i> 
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
  <tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
The crop has been watered but is not yet ready for harvest.
    </td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
<i>// Its watering status is halfway of this->dWaterReq.</i><br>
this->dWaterAmt = 4;
this->dWaterReq = 8;
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<i>// The function should return an integer indicating the approximate watering progress of the crop.</i><br>
<i>// In this case, it should return 1.</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<i>// The function returns a 1.</i> 
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
	<tr>
		<td>6</td>
		<td colspan="3"><pre style="background: 0;  white-space: pre-wrap;">int Product_water(
	struct Product *this,
	int dTime
) </pre></td>
		<td colspan="3"> A function that waters the crop.<br></td>
	</tr>
	<tr>
		<td style="background: #d0d7de;"></td>
		<td colspan="2"><i>Test Description</i></b></td>
    <td><i>Sample Input</i></td>
		<td><i>Expected Result</i></td>
		<td><i>Actual Result</i></td>
		<td><i>Pass / Fail</i></td>
	</tr>
  <tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
The crop is not yet fully watered. The crop has not been watered for the day.
    </td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Argument Values &ast;&ast;/</b>
dTime = 5;<br>
<b>/&ast;&ast; Internals &ast;&ast;/</b>
<i>// Its watering status has not yet reached its maximum.</i><br>
this->dWaterAmt = 3;
this->dWaterReq = 5;<br>
<i>// It was last watered some days ago.</i><br>
this->dLastWatered = 3;
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dWaterAmt = 4;
this->dLastWatered = 5;<br>
<i>// The function should increment this->dWaterAmt and update this->dLastWatered</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dWaterAmt = 4;
this->dLastWatered = 5;<br>
<i>// The function does as expected.</i>
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
  <tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
The crop is not yet fully watered, but the crop was just watered for the day.
    </td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Argument Values &ast;&ast;/</b>
dTime = 6;<br>
<b>/&ast;&ast; Internals &ast;&ast;/</b>
<i>// Its watering status has not yet reached its maximum.</i><br>
this->dWaterAmt = 3;
this->dWaterReq = 5;<br>
<i>// It was last watered within the day.</i><br>
this->dLastWatered = 6;
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dWaterAmt = 3;<br>
<i>// The function should not change this->dWaterAmt.</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dWaterAmt = 3;<br>
<i>// The function does as expected.</i>
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
  <tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
The crop has already been fully watered and was last watered some days ago.
    </td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Argument Values &ast;&ast;/</b>
dTime = 5;<br>
<b>/&ast;&ast; Internals &ast;&ast;/</b>
<i>// Its watering status has not yet reached its maximum.</i><br>
this->dWaterAmt = 5;
this->dWaterReq = 5;<br>
<i>// It was last watered within the day.</i><br>
this->dLastWatered = 3;
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dWaterAmt = 5;<br>
<i>// The function should not change this->dWaterAmt.</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dWaterAmt = 5;<br>
<i>// The function does as expected.</i>
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
</table>
<br>

<!----- game.class.stock.h ----->
<table style="font-size: 13px">
  <colgroup>
    <col span="1" style="width: 3%;">
    <col span="1" style="width: 10%;">
    <col span="1" style="width: 10%;">
    <col span="1" style="width: 22%;">
    <col span="1" style="width: 22%;">
    <col span="1" style="width: 22%;">
    <col span="1" style="width: 11%;">
  </colgroup>
	<tr>
		<th> # </th>
		<th colspan="3"> Functions in <code>game.class.stock.h</code> </th>
		<th colspan="3"> Description </th>
	</tr>
	<tr>
		<td>7</td>
		<td colspan="3"><pre style="background: 0;  white-space: pre-wrap;">int Stock_updateAmount(
	struct Stock *this,
	int dAmountChange
) </pre></td>
		<td colspan="3"> Updates amount of product stored by the stock.
 Returns a boolean on whether or not the change was successful.<br></td>
	</tr>
	<tr>
		<td style="background: #d0d7de;"></td>
		<td colspan="2"><i>Test Description</i></b></td>
    <td><i>Sample Input</i></td>
		<td><i>Expected Result</i></td>
		<td><i>Actual Result</i></td>
		<td><i>Pass / Fail</i></td>
	</tr>
  <tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
The amount change is positive.
    </td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Argument Values &ast;&ast;/</b>
dAmountChange = 5;<br>
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dAmount = 8;<br>
<i>// The stock instance has a nonzero count of product.</i><br>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dAmount = 13;<br>
<i>// The function should add the input into its current count of product.</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dAmount = 13;<br>
<i>// The function modifies the value properly and returns 1.</i>
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
  <tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
The amount change is negative and the sum value is nonnegative.
    </td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Argument Values &ast;&ast;/</b>
dAmountChange = -5;<br>
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dAmount = 8;<br>
<i>// The stock instance has a nonzero count of product.</i><br>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dAmount = 3;<br>
<i>// The function should add the input into its current count of product.</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dAmount = 3;<br>
<i>// The function modifies the value properly and returns 1.</i>
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
  <tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
The amount change is negative and the sum value is negative.
    </td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Argument Values &ast;&ast;/</b>
dAmountChange = -15;<br>
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dAmount = 8;<br>
<i>// The stock instance has a nonzero count of product.</i><br>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dAmount = 8;<br>
<i>// The function should not modify its internal value and just return 0.</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dAmount = 8;<br>
<i>// The function just returns 0.</i>
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
	<tr>
		<td>8</td>
		<td colspan="3"><pre style="background: 0;  white-space: pre-wrap;">int Stock_getBuyPrice(
	struct Stock *this,
	int dAmount
) </pre></td>
		<td colspan="3"> Gets the price of a certain amount of stock for buying.
 Returns 0 if there is not enough stock to buy that amount.<br></td>
	</tr>
	<tr>
		<td style="background: #d0d7de;"></td>
		<td colspan="2"><i>Test Description</i></b></td>
    <td><i>Sample Input</i></td>
		<td><i>Expected Result</i></td>
		<td><i>Actual Result</i></td>
		<td><i>Pass / Fail</i></td>
	</tr>
  <tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
The amount specified is less than the amount of product counted by the stock instance.
    </td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Argument Values &ast;&ast;/</b>
dAmount = 9;<br>
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dAmount = 20;
this->dCostToBuy = 5;<br>
<i>// The stock instance has a nonzero count of product.</i><br>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<i>// The function should return 45.</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<i>// The function just returns 45.</i>
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
  <tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
The amount specified is greater than the amount of product counted by the stock instance.
    </td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Argument Values &ast;&ast;/</b>
dAmount = 22;<br>
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dAmount = 20;
this->dCostToBuy = 5;<br>
<i>// The stock instance has a nonzero count of product.</i><br>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<i>// The function should return a 0.</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<i>// The function just returns 0.</i>
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
  <tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
The amount specified is equal to the count of product stored by the stock.
    </td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Argument Values &ast;&ast;/</b>
dAmount = 20;<br>
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dAmount = 20;
this->dCostToBuy = 5;<br>
<i>// The stock instance has a nonzero count of product.</i><br>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<i>// The function should return 100.</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<i>// The function returns 100.</i>
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
	<tr>
		<td>9</td>
		<td colspan="3"><pre style="background: 0;  white-space: pre-wrap;">int Stock_buyAmount(
	struct Stock *this,
	int dAmountChange
) </pre></td>
		<td colspan="3"> Buys a certain amount of the stock.
 Returns the price of buying that amount of stock.<br></td>
	</tr>
	<tr>
		<td style="background: #d0d7de;"></td>
		<td colspan="2"><i>Test Description</i></b></td>
    <td><i>Sample Input</i></td>
		<td><i>Expected Result</i></td>
		<td><i>Actual Result</i></td>
		<td><i>Pass / Fail</i></td>
	</tr>
  <tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
The amount specified is less than the amount of product counted by the stock instance.
    </td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Argument Values &ast;&ast;/</b>
dAmount = 9;<br>
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dAmount = 20;
this->dCostToBuy = 5;<br>
<i>// The stock instance has a nonzero count of product.</i><br>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dAmount = 11;<br>
<i>// The function should return 45 and update its stock amount.</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dAmount = 11;<br>
<i>// The function updates its stock amount and returns 45.</i>
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
  <tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
The amount specified is greater than the amount of product counted by the stock instance.
    </td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Argument Values &ast;&ast;/</b>
dAmount = 22;<br>
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dAmount = 20;
this->dCostToBuy = 5;<br>
<i>// The stock instance has a nonzero count of product.</i><br>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dAmount = 20;<br>
<i>// The function should do nothing and return a 0.</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dAmount = 20;<br>
<i>// The function just returns 0.</i>
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
  <tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
The amount specified is equal to the count of product stored by the stock.
    </td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Argument Values &ast;&ast;/</b>
dAmount = 20;<br>
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dAmount = 20;
this->dCostToBuy = 5;<br>
<i>// The stock instance has a nonzero count of product.</i><br>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dAmount = 0;<br>
<i>// The function should modify the count of the stock instance to 0 and return 100.</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dAmount = 0;<br>
<i>// The function modifies the stock instance and returns 100.</i>
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
	<tr>
		<td>10</td>
		<td colspan="3"><pre style="background: 0;  white-space: pre-wrap;">int Stock_getSellPrice(
	struct Stock *this,
	int dAmount
) </pre></td>
		<td colspan="3"> Gets the price of a certain amount of stock for selling.
 Returns 0 if there is not enough stock to sell that amount.<br></td>
	</tr>
	<tr>
		<td style="background: #d0d7de;"></td>
		<td colspan="2"><i>Test Description</i></b></td>
    <td><i>Sample Input</i></td>
		<td><i>Expected Result</i></td>
		<td><i>Actual Result</i></td>
		<td><i>Pass / Fail</i></td>
	</tr>
  <tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
The amount specified is less than the amount of product counted by the stock instance.
    </td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Argument Values &ast;&ast;/</b>
dAmount = 9;<br>
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dAmount = 20;
this->dCostToSell = 7;<br>
<i>// The stock instance has a nonzero count of product.</i><br>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<i>// The function should return 63.</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<i>// The function just returns 63.</i>
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
  <tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
The amount specified is greater than the amount of product counted by the stock instance.
    </td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Argument Values &ast;&ast;/</b>
dAmount = 22;<br>
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dAmount = 20;
this->dCostToSell = 7;<br>
<i>// The stock instance has a nonzero count of product.</i><br>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<i>// The function should do nothing and return a 0.</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<i>// The function just returns 0.</i>
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
  <tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
The amount specified is equal to the count of product stored by the stock.
    </td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Argument Values &ast;&ast;/</b>
dAmount = 20;<br>
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dAmount = 20;
this->dCostToSell = 7;<br>
<i>// The stock instance has a nonzero count of product.</i><br>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<i>// The function should return 140.</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<i>// The function returns 140.</i>
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
	<tr>
		<td>11</td>
		<td colspan="3"><pre style="background: 0;  white-space: pre-wrap;">int Stock_sellAmount(
	struct Stock *this,
	int dAmountChange
) </pre></td>
		<td colspan="3"> Sells a certain amount of the stock.
 Returns the cost of selling that amount of stock.<br></td>
	</tr>
	<tr>
		<td style="background: #d0d7de;"></td>
		<td colspan="2"><i>Test Description</i></b></td>
    <td><i>Sample Input</i></td>
		<td><i>Expected Result</i></td>
		<td><i>Actual Result</i></td>
		<td><i>Pass / Fail</i></td>
	</tr>
  <tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
The amount specified is less than the amount of product counted by the stock instance.
    </td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Argument Values &ast;&ast;/</b>
dAmount = 9;<br>
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dAmount = 20;
this->dCostToSell = 7;<br>
<i>// The stock instance has a nonzero count of product.</i><br>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dAmount = 11;<br>
<i>// The function should return 63 and edit the internal count of the instance.</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dAmount = 11;<br>
<i>// The function returns 63 and modifies this->dAmount appropriately.</i>
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
  <tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
The amount specified is greater than the amount of product counted by the stock instance.
    </td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Argument Values &ast;&ast;/</b>
dAmount = 22;<br>
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dAmount = 20;
this->dCostToSell = 7;<br>
<i>// The stock instance has a nonzero count of product.</i><br>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dAmount = 20;<br>
<i>// The function should do nothing and return a 0.</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dAmount = 20;<br>
<i>// The function just returns 0.</i>
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
  <tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
The amount specified is equal to the count of product stored by the stock.
    </td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Argument Values &ast;&ast;/</b>
dAmount = 20;<br>
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dAmount = 20;
this->dCostToSell = 7;<br>
<i>// The stock instance has a nonzero count of product.</i><br>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dAmount = 0;<br>
<i>// The function should return 140 and have the instance store 0 in this->dAmount.</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dAmount = 0;<br>
<i>// The function returns 140 and modifies this->dAmount appropriately.</i>
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
</table>
<br>

<!----- game.obj.farm.h ----->
<table style="font-size: 13px">
  <colgroup>
    <col span="1" style="width: 3%;">
    <col span="1" style="width: 10%;">
    <col span="1" style="width: 10%;">
    <col span="1" style="width: 22%;">
    <col span="1" style="width: 22%;">
    <col span="1" style="width: 22%;">
    <col span="1" style="width: 11%;">
  </colgroup>
	<tr>
		<th> # </th>
		<th colspan="3"> Functions in <code>game.obj.farm.h</code> </th>
		<th colspan="3"> Description </th>
	</tr>
	<tr>
		<td>12</td>
		<td colspan="3"><pre style="background: 0;  white-space: pre-wrap;">void Farm_till(
	struct Farm *this,
	int dPlots
) </pre></td>
		<td colspan="3"> Tills the specified number of plots on the farm.
 The function does nothing if the specified number of plots cannot be tilled.<br></td>
	</tr>
	<tr>
		<td style="background: #d0d7de;"></td>
		<td colspan="2"><i>Test Description</i></b></td>
    <td><i>Sample Input</i></td>
		<td><i>Expected Result</i></td>
		<td><i>Actual Result</i></td>
		<td><i>Pass / Fail</i></td>
	</tr>
	<tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
The amount specified is a negative value.
    </td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Argument Values &ast;&ast;/</b>
dPlots = -5;<br>
<b>/&ast;&ast; Internals &ast;&ast;/</b>
int dTillable = Farm_canTill(this); // (15)
int dCanBeSown = Farm_canSow(this); // (0)
<i>// The farm has 15 plots in the PLOT_UNTILLED state.</i><br>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
int dTillable = Farm_canTill(this); // (15)
int dCanBeSown = Farm_canSow(this); // (0)<br>
<i>// The function should do nothing.</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
int dTillable = Farm_canTill(this); // (15)
int dCanBeSown = Farm_canSow(this); // (0)<br>
<i>// The function tills none of the plots on the farm.</i>
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
  <tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
The amount specified is a nonnegative value less than or equal to the amount of tillable plots on the farm.
    </td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Argument Values &ast;&ast;/</b>
dPlots = 10;<br>
<b>/&ast;&ast; Internals &ast;&ast;/</b>
int dTillable = Farm_canTill(this); // (15)
int dCanBeSown = Farm_canSow(this); // (0)<br>
<i>// The farm has 15 plots in the PLOT_UNTILLED state.</i><br>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
int dTillable = Farm_canTill(this); // (5)
int dCanBeSown = Farm_canSow(this); // (10)<br>
<i>// The function should modify the first 10 tillable plots in the array.</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
int dTillable = Farm_canTill(this); // (5)
int dCanBeSown = Farm_canSow(this); // (10)<br>
<i>// The function tills 10 of the plots on the farm.</i>
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
  <tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
The amount specified is greater than the amount of tillable plots on the farm.
    </td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Argument Values &ast;&ast;/</b>
dPlots = 20;<br>
<b>/&ast;&ast; Internals &ast;&ast;/</b>
int dTillable = Farm_canTill(this); // (15)
int dCanBeSown = Farm_canSow(this); // (0)<br>
<i>// The farm has 15 plots in the PLOT_UNTILLED state.</i><br>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
int dTillable = Farm_canTill(this); // (15)
int dCanBeSown = Farm_canSow(this); // (0)<br>
<i>// The function should do nothing.</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
int dTillable = Farm_canTill(this); // (15)
int dCanBeSown = Farm_canSow(this); // (0)<br>
<i>// The function tills no plots.</i>
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
	<tr>
		<td>13</td>
		<td colspan="3"><pre style="background: 0;  white-space: pre-wrap;">void Farm_sow(
	struct Farm *this,
	int dPlots,
	struct GameCatalogue *pCatalogue,
	int dTime
) </pre></td>
		<td colspan="3"> Sows the specified number of plots on the farm.
 The function does nothing if there are too many plots to sow.<br></td>
	</tr>
	<tr>
		<td style="background: #d0d7de;"></td>
		<td colspan="2"><i>Test Description</i></b></td>
    <td><i>Sample Input</i></td>
		<td><i>Expected Result</i></td>
		<td><i>Actual Result</i></td>
		<td><i>Pass / Fail</i></td>
	</tr>
  <tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
The amount specified is a negative value.
    </td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Argument Values &ast;&ast;/</b>
dPlots = -5;<br>
<b>/&ast;&ast; Internals &ast;&ast;/</b>
int dCanBeSown = Farm_canSow(this); // (15)
int dWaterable = Farm_canWaterCrop(this, 1); // (0)<br>
this->eCurrentCrop = PRODUCT_CORN;<br>
<i>// The farm has 15 plots in the PLOT_TILLED state.</i><br>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
int dCanBeSown = Farm_canSow(this); // (15)
int dWaterable = Farm_canWaterCrop(this, 1); // (0)<br>
<i>// The function should do nothing.</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
int dCanBeSown = Farm_canSow(this); // (15)
int dWaterable = Farm_canWaterCrop(this, 1); // (0)<br>
<i>// The function sows none of the plots on the farm.</i>
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
  <tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
The amount specified is a nonnegative value less than or equal to the amount of tilled plots on the farm.
    </td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Argument Values &ast;&ast;/</b>
dPlots = 10;<br>
<b>/&ast;&ast; Internals &ast;&ast;/</b>
int dCanBeSown = Farm_canSow(this); // (15)
int dWaterable = Farm_canWaterCrop(this, 1); // (0)<br>
this->eCurrentCrop = PRODUCT_CORN;<br>
<i>// The farm has 15 plots in the PLOT_TILLED state.</i><br>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
int dCanBeSown = Farm_canSow(this); // (5)
int dWaterable = Farm_canWaterCrop(this, 1); // (10)<br>
<i>// The function should modify the first 10 tilled plots in the array.</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
int dCanBeSown = Farm_canSow(this); // (5)
int dWaterable = Farm_canWaterCrop(this, 1); // (10)<br>
<i>// The function sows 10 of the plots on the farm with crops of type PRODUCT_CORN.</i>
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
  <tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
The amount specified is greater than the amount of tillable plots on the farm.
    </td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Argument Values &ast;&ast;/</b>
dPlots = 20;<br>
<b>/&ast;&ast; Internals &ast;&ast;/</b>
int dCanBeSown = Farm_canSow(this); // (15)
int dWaterable = Farm_canWaterCrop(this, 1); // (0)<br>
this->eCurrentCrop = PRODUCT_CORN;<br>
<i>// The farm has 15 plots in the PLOT_TILLED state.</i><br>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
int dCanBeSown = Farm_canSow(this); // (15)
int dWaterable = Farm_canWaterCrop(this, 1); // (0)<br>
<i>// The function should do nothing.</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
int dCanBeSown = Farm_canSow(this); // (15)
int dWaterable = Farm_canWaterCrop(this, 1); // (0)<br>
<i>// The function sows no plots.</i>
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
	<tr>
		<td>14</td>
		<td colspan="3"><pre style="background: 0;  white-space: pre-wrap;">void Farm_water(
	struct Farm *this,
	int dTime
) </pre></td>
		<td colspan="3"> Waters the current crop on the farm.<br></td>
	</tr>
	<tr>
		<td style="background: #d0d7de;"></td>
		<td colspan="2"><i>Test Description</i></b></td>
    <td><i>Sample Input</i></td>
		<td><i>Expected Result</i></td>
		<td><i>Actual Result</i></td>
		<td><i>Pass / Fail</i></td>
	</tr>
  <tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
The current farm crop was just watered during the current day.
    </td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Argument Values &ast;&ast;/</b>
dTime = 1;<br>
<b>/&ast;&ast; Internals &ast;&ast;/</b>
int dWaterable = Farm_canWaterCrop(this, dTime); // (0)<br>
this->eCurrentCrop = PRODUCT_CORN;<br>
<i>// The farm has 10 plots with PRODUCT_CORN which were just watered.</i><br>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
int dWaterable = Farm_canWaterCrop(this, dTime); // (0)<br>
<i>// The function should do nothing.</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
int dWaterable = Farm_canWaterCrop(this, dTime); // (0)<br>
<i>// The function does not modify any of the plots.</i>
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
  <tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
The current farm crop may be watered during the current day and is yet to become harvestable.
    </td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Argument Values &ast;&ast;/</b>
dTime = 2;<br>
<b>/&ast;&ast; Internals &ast;&ast;/</b>
int dWaterable = Farm_canWaterCrop(this, dTime); // (10)
int dHarvestable = Farm_canHarvestCrop(this); // (0) <br>
this->eCurrentCrop = PRODUCT_CORN;<br>
<i>// The farm has 10 plots with PRODUCT_CORN which are ready to be watered.</i><br>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
int dWaterable = Farm_canWaterCrop(this, dTime); // (0)
int dHarvestable = Farm_canHarvestCrop(this); // (0) <br>
<i>// The function should call Plot_water() on the waterable plots.</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
int dWaterable = Farm_canWaterCrop(this, dTime); // (0)
int dHarvestable = Farm_canHarvestCrop(this); // (0) <br>
<i>// The function waters the plots but doesn't make them harvestable yet.</i>
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
  <tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
The current farm crop may be watered during the current day and will then be harvestable.
    </td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Argument Values &ast;&ast;/</b>
dTime = 2;<br>
<b>/&ast;&ast; Internals &ast;&ast;/</b>
int dWaterable = Farm_canWaterCrop(this, dTime); // (10)
int dHarvestable = Farm_canHarvestCrop(this); // (0) <br>
this->eCurrentCrop = PRODUCT_CORN;<br>
<i>// The farm has 10 plots with PRODUCT_CORN which are ready to be watered.</i><br>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
int dWaterable = Farm_canWaterCrop(this, dTime); // (0)
int dHarvestable = Farm_canHarvestCrop(this); // (10) <br>
<i>// The function should call Plot_water() on the waterable plots and make them harvestable.</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
int dWaterable = Farm_canWaterCrop(this, dTime); // (0)
int dHarvestable = Farm_canHarvestCrop(this); // (10) <br>
<i>// The function waters the plots and makes them harvestable.</i>
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
	<tr>
		<td>15</td>
		<td colspan="3"><pre style="background: 0;  white-space: pre-wrap;">void Farm_harvest(struct Farm *this) </pre></td>
		<td colspan="3"> Harvests the specified crop on the farm.<br></td>
	</tr>
	<tr>
		<td style="background: #d0d7de;"></td>
		<td colspan="2"><i>Test Description</i></b></td>
    <td><i>Sample Input</i></td>
		<td><i>Expected Result</i></td>
		<td><i>Actual Result</i></td>
		<td><i>Pass / Fail</i></td>
	</tr>
	  <tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
The current farm crop is fully watered and ready for harvest.
    </td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
int dTillable = Farm_canTill(this); // (5)
int dHarvestable = Farm_canHarvestCrop(this); // (10)<br>
this->eCurrentCrop = PRODUCT_CORN;<br>
<i>// The farm has 10 plots with PRODUCT_CORN which are ready for harvest.</i><br>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
int dTillable = Farm_canTill(this); // (15)
int dHarvestable = Farm_canHarvestCrop(this); // (0)<br>
<i>// The function should revert the harvested plots to PLOT_UNTILLED.</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
int dTillable = Farm_canTill(this); // (15)
int dHarvestable = Farm_canHarvestCrop(this); // (0)<br>
<i>// The function reverts the harvested plots to PLOT_UNTILLED.</i>
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
  </tr>
	  <tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
The current farm crop is not yet fully watered.
    </td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
int dHarvestable = Farm_canHarvestCrop(this); // (0)<br>
this->eCurrentCrop = PRODUCT_CORN;<br>
<i>// The farm has 10 plots with PRODUCT_CORN which are not ready for harvest.</i><br>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
int dHarvestable = Farm_canHarvestCrop(this); // (0)<br>
<i>// The function should do nothing.</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
int dHarvestable = Farm_canHarvestCrop(this); // (0)<br>
<i>// The function does nothing.</i>
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
  </tr>
	  <tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
The current farm crop is not yet planted on the farm.
    </td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
int dHarvestable = Farm_canHarvestCrop(this); // (0)<br>
this->eCurrentCrop = PRODUCT_CORN;<br>
<i>// There are no plots with PRODUCT_CORN.</i><br>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
int dHarvestable = Farm_canHarvestCrop(this); // (0)<br>
<i>// The function should do nothing.</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
int dHarvestable = Farm_canHarvestCrop(this); // (0)<br>
<i>// The function does nothing.</i>
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
	<tr>
		<td>16</td>
		<td colspan="3"><pre style="background: 0;  white-space: pre-wrap;">void Farm_queueSelected(
	struct Farm *this,
	int dTime
) </pre></td>
		<td colspan="3"> Adds the currently selected plot to the queue.<br></td>
	</tr>
	<tr>
		<td style="background: #d0d7de;"></td>
		<td colspan="2"><i>Test Description</i></b></td>
    <td><i>Sample Input</i></td>
		<td><i>Expected Result</i></td>
		<td><i>Actual Result</i></td>
		<td><i>Pass / Fail</i></td>
	</tr>
	<tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
The currently selected plot is available for the current action.
    </td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->eCurrentAction = FARM_TILL;
this->bSelectionQueue[dIndex] = 0;<br>
struct Plot *pPlot = this->pPlotArray[dIndex];
Plot_getState(pPlot); // PLOT_UNTILLED<br>
<i>// The current plot is untilled and is being queued for tilling.</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->bSelectionQueue[dIndex] = 1;<br>
<i>// The plot should be queued for processing.</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->bSelectionQueue[dIndex] = 1;<br>
<i>// The function queues the plot for processing.</i>
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
  <tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
The currently selected plot is not available for the current action.
    </td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->eCurrentAction = FARM_TILL;
this->bSelectionQueue[dIndex] = 0;<br>
struct Plot *pPlot = this->pPlotArray[dIndex];
Plot_getState(pPlot); // PLOT_SOWN <br>
<i>// The current plot has been sown and is being queued for tilling.</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->bSelectionQueue[dIndex] = 0;<br>
<i>// The plot should not be queued for processing.</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->bSelectionQueue[dIndex] = 1;<br>
<i>// The function does not queue the plot for processing.</i>
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
</table>
<br>

<!----- game.obj.player.h ----->
<table style="font-size: 13px">
  <colgroup>
    <col span="1" style="width: 3%;">
    <col span="1" style="width: 10%;">
    <col span="1" style="width: 10%;">
    <col span="1" style="width: 22%;">
    <col span="1" style="width: 22%;">
    <col span="1" style="width: 22%;">
    <col span="1" style="width: 11%;">
  </colgroup>
	<tr>
		<th> # </th>
		<th colspan="3"> Functions in <code>game.obj.player.h</code> </th>
		<th colspan="3"> Description </th>
	</tr>
  <tr>
		<td>17</td>
		<td colspan="3"><pre style="background: 0;  white-space: pre-wrap;">void Player_updateSeedStock(
	struct Player *this,
	enum ProductType eProductType,
	int dChangeAmount
) </pre></td>
		<td colspan="3"> Sets how much seed bags were used or purchased by the player.<br></td>
	</tr>
	<tr>
		<td style="background: #d0d7de;"></td>
		<td colspan="2"><i>Test Description</i></b></td>
    <td><i>Sample Input</i></td>
		<td><i>Expected Result</i></td>
		<td><i>Actual Result</i></td>
		<td><i>Pass / Fail</i></td>
	</tr>
  <tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
The amount change is positive.
    </td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Argument Values &ast;&ast;/</b>
dAmountChange = 6;
eProductType = PRODUCT_CORN;<br>
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->pSeedStockArray [PRODUCT_CORN]->dAmount = 9;<br>
<i>// The stock instance has a nonzero count of product.</i><br>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->pSeedStockArray [PRODUCT_CORN]->dAmount = 15;<br>
<i>// The function should add the input into the seed stock's current count of product.</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->pSeedStockArray [PRODUCT_CORN]->dAmount = 15;<br>
<i>// The function modifies the value properly.</i>
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
  <tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
The amount change is negative and the sum value is nonnegative.
    </td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Argument Values &ast;&ast;/</b>
dAmountChange = -6;<br>
eProductType = PRODUCT_CORN;
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->pSeedStockArray [PRODUCT_CORN]->dAmount = 9;<br>
<i>// The stock instance has a nonzero count of product.</i><br>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->pSeedStockArray [PRODUCT_CORN]->dAmount = 3;<br>
<i>// The function should add the input into the stock's current count of product.</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->pSeedStockArray [PRODUCT_CORN]->dAmount = 3;<br>
<i>// The function modifies the value properly.</i>
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
    <tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
The amount change is negative and the sum value is negative.
    </td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Argument Values &ast;&ast;/</b>
dAmountChange = -15;<br>
eProductType = PRODUCT_CORN;
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->pSeedStockArray [PRODUCT_CORN]->dAmount = 9;<br>
<i>// The stock instance has a nonzero count of product.</i><br>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->pSeedStockArray [PRODUCT_CORN]->dAmount = 9;<br>
<i>// The function should do nothing.</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->pSeedStockArray [PRODUCT_CORN]->dAmount = 9;<br>
<i>// The function leaves the value as is.</i>
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
	<tr>
		<td>18</td>
		<td colspan="3"><pre style="background: 0;  white-space: pre-wrap;">void Player_updateCropStock(
	struct Player *this,
	enum ProductType eProductType,
	int dChangeAmount
) </pre></td>
		<td colspan="3"> Sets how much crops were sold or harvested by the player.<br></td>
	</tr>
	<tr>
		<td style="background: #d0d7de;"></td>
		<td colspan="2"><i>Test Description</i></b></td>
    <td><i>Sample Input</i></td>
		<td><i>Expected Result</i></td>
		<td><i>Actual Result</i></td>
		<td><i>Pass / Fail</i></td>
	</tr>
	<tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
The amount change is positive.
    </td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Argument Values &ast;&ast;/</b>
dAmountChange = 100;
eProductType = PRODUCT_CORN;<br>
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->pCropStockArray [PRODUCT_CORN]->dAmount = 4;<br>
<i>// The stock instance has a nonzero count of product.</i><br>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->pCropStockArray [PRODUCT_CORN]->dAmount = 104;<br>
<i>// The function should add the input into the seed stock's current count of product.</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->pCropStockArray [PRODUCT_CORN]->dAmount = 104;<br>
<i>// The function modifies the value properly.</i>
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
  <tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
The amount change is negative and the sum value is nonnegative.
    </td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Argument Values &ast;&ast;/</b>
dAmountChange = -2;<br>
eProductType = PRODUCT_CORN;
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->pCropStockArray [PRODUCT_CORN]->dAmount = 4;<br>
<i>// The stock instance has a nonzero count of product.</i><br>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->pCropStockArray [PRODUCT_CORN]->dAmount = 2;<br>
<i>// The function should add the input into the stock's current count of product.</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->pCropStockArray [PRODUCT_CORN]->dAmount = 2;<br>
<i>// The function modifies the value properly.</i>
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
    <tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
The amount change is negative and the sum value is negative.
    </td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Argument Values &ast;&ast;/</b>
dAmountChange = -5;<br>
eProductType = PRODUCT_CORN;
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->pCropStockArray [PRODUCT_CORN]->dAmount = 4;<br>
<i>// The stock instance has a nonzero count of product.</i><br>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->pCropStockArray [PRODUCT_CORN]->dAmount = 4;<br>
<i>// The function should do nothing.</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->pCropStockArray [PRODUCT_CORN]->dAmount = 4;<br>
<i>// The function leaves the value as is.</i>
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
	<tr>
		<td>18</td>
		<td colspan="3"><pre style="background: 0;  white-space: pre-wrap;">int Player_updateGold(
	struct Player *this,
	int dGoldChange
) </pre></td>
		<td colspan="3"> Updates the player's amount of gold.
 Returns 0 if the change was not successful.<br></td>
	</tr>
	<tr>
		<td style="background: #d0d7de;"></td>
		<td colspan="2"><i>Test Description</i></b></td>
    <td><i>Sample Input</i></td>
		<td><i>Expected Result</i></td>
		<td><i>Actual Result</i></td>
		<td><i>Pass / Fail</i></td>
	</tr>
	<tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
The amount change is positive.
    </td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Argument Values &ast;&ast;/</b>
dGoldChange = 10;<br>
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dGold = 0;<br>
<i>// The player currently has no more gold.</i><br>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dGold = 10;<br>
<i>// The function should add the input into the gold's current value.</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dGold = 10;<br>
<i>// The function modifies the value properly.</i>
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
  <tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
The amount change is negative and the sum value is nonnegative.
    </td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Argument Values &ast;&ast;/</b>
dGoldChange = -10;<br>
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dGold = 10;<br>
<i>// The player currently has 10 gold.</i><br>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dGold = 0;<br>
<i>// The function should add the input into the gold's current value.</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dGold = 0;<br>
<i>// The function modifies the value properly.</i>
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
    <tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
The amount change is negative and the sum value is negative.
    </td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Argument Values &ast;&ast;/</b>
dGoldChange = -10;<br>
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dGold = 0;<br>
<i>// The player has no gold.</i><br>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dGold = 0;<br>
<i>// The function should do nothing and return 0.</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dGold = 0;<br>
<i>// The function leaves the value as is and returns 0.</i>
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
	<tr>
		<td>19</td>
		<td colspan="3"><pre style="background: 0;  white-space: pre-wrap;">int Player_updateEnergy(
	struct Player *this,
	int dEnergyChange
) </pre></td>
		<td colspan="3"> Updates the player's amount of energy.
 Returns 0 if the change was not successful.<br></td>
	</tr>
	<tr>
		<td style="background: #d0d7de;"></td>
		<td colspan="2"><i>Test Description</i></b></td>
    <td><i>Sample Input</i></td>
		<td><i>Expected Result</i></td>
		<td><i>Actual Result</i></td>
		<td><i>Pass / Fail</i></td>
	</tr>
	<tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
The amount change is positive.
    </td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Argument Values &ast;&ast;/</b>
dEnergyChange = 10;<br>
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dEnergy = 0;<br>
<i>// The player currently has no more energy.</i><br>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dEnergy = 10;<br>
<i>// The function should add the input into the energy's current value.</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dEnergy = 10;<br>
<i>// The function modifies the value properly.</i>
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
  <tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
The amount change is negative and the sum value is nonnegative.
    </td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Argument Values &ast;&ast;/</b>
dEnergyChange = -10;<br>
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dEnergy = 10;<br>
<i>// The player currently has 10 energy.</i><br>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dEnergy = 0;<br>
<i>// The function should add the input into the energy's current value.</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dEnergy = 0;<br>
<i>// The function modifies the value properly.</i>
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
    <tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
The amount change is negative and the sum value is negative.
    </td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Argument Values &ast;&ast;/</b>
dEnergyChange = -10;<br>
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dEnergy = 0;<br>
<i>// The player has no energy.</i><br>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dEnergy = 0;<br>
<i>// The function should do nothing and return 0.</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dEnergy = 0;<br>
<i>// The function leaves the value as is and returns 0.</i>
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
	<tr>
		<td>20</td>
		<td colspan="3"><pre style="background: 0;  white-space: pre-wrap;">void Player_goHome(struct Player *this) </pre></td>
		<td colspan="3"> Makes the player go home.
 They sleep then eat breakfast when they wake up, assuming they can buy it.<br></td>
	</tr>
	<tr>
		<td style="background: #d0d7de;"></td>
		<td colspan="2"><i>Test Description</i></b></td>
    <td><i>Sample Input</i></td>
		<td><i>Expected Result</i></td>
		<td><i>Actual Result</i></td>
		<td><i>Pass / Fail</i></td>
	</tr>
	<tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
<code>PLAYER_STRICT_DEATH_MODE</code> is enabled and the player has not starved.            
    </td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Constants &ast;&ast;/</b>
#define PLAYER_STRICT_DEATH_MODE 1;<br>
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dTime = 5;
this->dEnergy = 10;
this->dGold = 5;
this->dDaysStarved = 0;<br> 
<i>// The player does not have enough gold to buy breakfast.</i><br>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dTime = 6;
this->dEnergy = 30;
this->dGold = 5;
this->dDaysStarved = 1;<br>    
<i>// The function should update the day counter and starved counter while resetting the energy.</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dTime = 5;
this->dEnergy = 10;
this->dGold = 0;
this->dDaysStarved = 0;<br>   
<i>// The function does as is expected.</i>
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
	<tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
<code>PLAYER_STRICT_DEATH_MODE</code> is enabled and the player is on the third day of starving.        
    </td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Constants &ast;&ast;/</b>
#define PLAYER_STRICT_DEATH_MODE 1;<br>
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dTime = 5;
this->dEnergy = 10;
this->dGold = 10;
this->dDaysStarved = 3;<br> 
int bIsDead = Player_isDead(this);  // (0)
<i>// The player has enough gold to buy breakfast.</i><br>        
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dTime = 6;
this->dEnergy = 30;
this->dGold = 0;
this->dDaysStarved = 4;<br>
int bIsDead = Player_isDead(this);  // (1) <br>
<i>// The function should still update the player but render them dead afterwards.</i> 
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dTime = 6;
this->dEnergy = 30;
this->dGold = 0;
this->dDaysStarved = 4;<br>
int bIsDead = Player_isDead(this);  // (1) <br>
<i>// The function updates the player and makes them dead after.</i>
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
  <tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
<code>PLAYER_STRICT_DEATH_MODE</code> is disabled and the player is on the third day of starving.        
    </td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Constants &ast;&ast;/</b>
#define PLAYER_STRICT_DEATH_MODE 0;<br>
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dTime = 5;
this->dEnergy = 10;
this->dGold = 10;
this->dDaysStarved = 3;<br> 
int bIsDead = Player_isDead(this);  // (0)
<i>// The player has enough gold to eat breakfast.</i><br>        
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dTime = 6;
this->dEnergy = 30;
this->dGold = 0;
this->dDaysStarved = 0;<br>
int bIsDead = Player_isDead(this);  // (0) <br>
<i>// The function update the player and reset their starved days counter.</i> 
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dTime = 6;
this->dEnergy = 30;
this->dGold = 0;
this->dDaysStarved = 0;<br>
int bIsDead = Player_isDead(this);  // (0) <br>
<i>// The function updates the player and keeps them alive.</i>
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
</table>
<br>

<!----- game.manager.h ----->
<table style="font-size: 13px">
  <colgroup>
    <col span="1" style="width: 3%;">
    <col span="1" style="width: 10%;">
    <col span="1" style="width: 10%;">
    <col span="1" style="width: 22%;">
    <col span="1" style="width: 22%;">
    <col span="1" style="width: 22%;">
    <col span="1" style="width: 11%;">
  </colgroup>
	<tr>
		<th> # </th>
		<th colspan="3"> Functions in <code>game.manager.h</code> </th>
		<th colspan="4" width="200px"> Description </th>
	</tr>
	<tr>
		<td>21</td>
		<td colspan="3"><pre style="background: 0;  white-space: pre-wrap;">void Game_conf(
	struct Game *this,
	char *sMode,
	char *sScene
) </pre></td>
		<td colspan="3"> Configures the running mode of the game.<br></td>
	</tr>
	<tr>
		<td style="background: #d0d7de;"></td>
		<td colspan="2"><i>Test Description</i></b></td>
    <td><i>Sample Input</i></td>
		<td><i>Expected Result</i></td>
		<td><i>Actual Result</i></td>
		<td><i>Pass / Fail</i></td>
	</tr>
	<tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
The user inputs a single valid argument when running the program.</td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Console Inputs &ast;&ast;/</b>
&gt; ./main full<br>
<b>/&ast;&ast; Argument Values &ast;&ast;/</b>
sMode = "full";<br>
<i>// sScene is automatically set to "na" by the caller function</i><br>
sScene = "na";      
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dMode = 1;<br>
<i>// The game should configure its variables for the mode specified by the user.</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dMode = 1;<br>
<i>// The game configures under the mode specified by the user.</i>
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
	<tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
The user inputs a valid second argument when running the program in <code>debug</code> mode.
    </td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Console Inputs &ast;&ast;/</b>
&gt; ./main debug farm<br>
<b>/&ast;&ast; Argument Values &ast;&ast;/</b>
sMode = "debug";
sScene = "farm";    
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dMode = 1;<br>
this->eGameState = GAME_PLAY;
this->ePlayState = PLAY_FARM;<br>
this->pPlayer->sName = "DEBUG MODE";<br>
<i>// The game should configure debug mode and should set the first scene to the one specified by the user.</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dMode = 1;<br>
this->eGameState = GAME_PLAY;
this->ePlayState = PLAY_FARM;<br>
this->pPlayer->sName = "DEBUG MODE";<br>
<i>// The game configures itself for debugging and sets the first scene to the one specified by the user.</i>
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
	<tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
The user inputs an invalid combination of arguments to the program.    
    </td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Console Inputs &ast;&ast;/</b>
&gt; ./main hmm <br>

<b>/&ast;&ast; Argument Values &ast;&ast;/</b>
<i>// For invalid values, the caller should automatically prefer the default mode for execution.</i><br>
sMode = "default";

<i>// If an invalid second argument was also passed, it should also be ignored.</i><br>
sScene = "na";
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dMode = 0;<br>
<i>// The game should just ignore the values specified by the user and configure under the default mode.</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
this->dMode = 0;<br>
<i>// The program ignores invalid values.</i>
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
	<tr>
		<td>22</td>
		<td colspan="3"><pre style="background: 0;  white-space: pre-wrap;">void Game_exec(struct Game *this) </pre></td>
		<td colspan="3"> The function that manages the execution of the game in the mode currently specified by the user.<br></td>
	</tr>
	<tr>
		<td style="background: #d0d7de;"></td>
		<td colspan="2"><i>Test Description</i></b></td>
    <td><i>Sample Input</i></td>
		<td><i>Expected Result</i></td>
		<td><i>Actual Result</i></td>
		<td><i>Pass / Fail</i></td>
	</tr>
	<tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
The game was just configured to run in <code>default</code> mode.   
    </td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
<i>// The internal mode state of the Game object, which is set by Game_conf()</i><br>
this->dMode = 0;    
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<i>// The game should run with minimal UI and the game manager script should lend focus to the minified manager script.</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<i>// The game executes in the default minified mode.</i>    
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
	<tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
The game was just configured to run in <code>full</code> mode. 
    </td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
<i>// The internal mode state of the Game object, which is set by Game_conf()</i><br>
this->dMode = 1;    
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<i>// The game should run in full mode.</i><br>
<i>// To indicate the difference in configuration, the terminal should change its color scheme.</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<i>// The game executes in the feature-rich full mode.</i><br>
<i>// The terminal switches its display to black text on a white background.</i>
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
	<tr>
		<td style="background: #d0d7de;"></td>
		<td style="vertical-align: top; padding-top: 15px;" colspan="2">
The game was just configured to run in <code>debug</code> mode.   
    </td>
    <td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<b>/&ast;&ast; Internals &ast;&ast;/</b>
<i>// The internal mode state and scene state of the Game object, which is set by Game_conf()</i><br>
this->dMode = 2;        
this->eGameState = GAME_PLAY;
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<i>// The game should run in debug mode and open on the specified scene.</i><br>
<i>// To indicate the difference in configuration, the terminal should change its color scheme.</i>
    </pre></td>
		<td style="padding: 0; vertical-align: top;"><pre style="background: 0;  white-space: pre-wrap;">
<i>// The game opens on the specified scene in debug mode.</i><br>    
<i>// The terminal switches its display to black text on a yellow background.</i>    
    </pre></td>
		<td><p style="color: green"><b>Pass</b></p></td>
	</tr>
</table>
<br>


### 4.2 Complete Function List

The other functions not included in the test script above are listed here. It might be best to try to describe them regardless, even without providing sample inputs.

> **NOTE:** The function descriptions here are exactly the same as those contained in the function comments of the source code itself. The function comments follow the JS Doc spec on describing subroutines.

<br>
<table style="font-size: 13px">
  <colgroup>
    <col span="1" style="width: 3%;">
    <col span="1" style="width: 10%;">
    <col span="1" style="width: 10%;">
    <col span="1" style="width: 22%;">
    <col span="1" style="width: 22%;">
    <col span="1" style="width: 22%;">
    <col span="1" style="width: 11%;">
  </colgroup>
	<tr>
		<th> # </th>
		<th colspan="3"> Functions in <code>game.assets.h</code> </th>
		<th colspan="3"> Description </th>
	</tr>
	<tr>
		<td>1</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void GameAssets_init(struct GameAssets *this) </pre></td>
		<td colspan="3"> Defines all the sprites and images in the game.
 
<br></td>
	</tr>
</table>
<br>

<table style="font-size: 13px">
  <colgroup>
    <col span="1" style="width: 3%;">
    <col span="1" style="width: 10%;">
    <col span="1" style="width: 10%;">
    <col span="1" style="width: 22%;">
    <col span="1" style="width: 22%;">
    <col span="1" style="width: 22%;">
    <col span="1" style="width: 11%;">
  </colgroup>
	<tr>
		<th> # </th>
		<th colspan="3"> Functions in <code>game.catalogue.h</code> </th>
		<th colspan="3"> Description </th>
	</tr>
	<tr>
		<td>2</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void GameCatalogue_init(struct GameCatalogue *this) </pre></td>
		<td colspan="3"> A function that initializes the information in the catalogue.
 
<br></td>
	</tr>
</table>
<br>

<table style="font-size: 13px">
  <colgroup>
    <col span="1" style="width: 3%;">
    <col span="1" style="width: 10%;">
    <col span="1" style="width: 10%;">
    <col span="1" style="width: 22%;">
    <col span="1" style="width: 22%;">
    <col span="1" style="width: 22%;">
    <col span="1" style="width: 11%;">
  </colgroup>
	<tr>
		<th> # </th>
		<th colspan="3"> Functions in <code>game.manager.h</code> </th>
		<th colspan="3"> Description </th>
	</tr>
	<tr>
		<td>3</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Game_init(
	struct Game *this,
	struct GameAssets *pAssets,
	struct GameCatalogue *pCatalogue
) </pre></td>
		<td colspan="3"> Initializes the game and everything in it.
 
<br></td>
	</tr>
	<tr>
		<td>4</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int Game_isDialogueDone(struct Game *this) </pre></td>
		<td colspan="3"> Returns whether or not the game dialogue is done.
 
<br></td>
	</tr>
	<tr>
		<td>5</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Game_makeHeader(struct Game *this) </pre></td>
		<td colspan="3"> Creates the header for the in-game UI.
 
<br></td>
	</tr>
	<tr>
		<td>6</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Game_killHeader(struct Game *this) </pre></td>
		<td colspan="3"> Frees the header memory block.
 
<br></td>
	</tr>
	<tr>
		<td>7</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Game_makeFooter(struct Game *this) </pre></td>
		<td colspan="3"> Creates the footer for the in-game UI.
 
<br></td>
	</tr>
	<tr>
		<td>8</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Game_killFooter(struct Game *this) </pre></td>
		<td colspan="3"> Frees the header memory block.
 
<br></td>
	</tr>
	<tr>
		<td>9</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Game_menuUI(
	char cInput,
	struct Game *this
) </pre></td>
		<td colspan="3"> Displays the visual component of the menu.
 This is used as a callback function.
 
<br></td>
	</tr>
	<tr>
		<td>10</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Game_playStartUI(
	char *sInput,
	struct Game *this
) </pre></td>
		<td colspan="3"> In the default game mode, this function requests for the user's name.
 
<br></td>
	</tr>
	<tr>
		<td>11</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Game_playUI(
	char cInput,
	struct Game *this
) </pre></td>
		<td colspan="3"> The actual UI of the gameplay.
 
<br></td>
	</tr>
	<tr>
		<td>12</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Game_guideUI(
	char cInput,
	struct Game *this
) </pre></td>
		<td colspan="3"> UI for the guide page.
 
<br></td>
	</tr>
	<tr>
		<td>13</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Game_controlsUI(
	char cInput,
	struct Game *this
) </pre></td>
		<td colspan="3"> UI for the about the controls page.
 
<br></td>
	</tr>
	<tr>
		<td>14</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Game_authorUI(
	char cInput,
	struct Game *this
) </pre></td>
		<td colspan="3"> UI for the about the author page.
 
<br></td>
	</tr>
	<tr>
		<td>15</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Game_dialogUI(
	char cInput,
	struct Game *this
) </pre></td>
		<td colspan="3"> Displays the dialog box.
 This is used as a callback function.
 
<br></td>
	</tr>
	<tr>
		<td>16</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Game_menuIO(
	char cInput,
	struct Game *this
) </pre></td>
		<td colspan="3"> Handles IO interaction with the menu.
 It is also used as a callback function.
 
<br></td>
	</tr>
	<tr>
		<td>17</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Game_playStartIO(
	char *sInput,
	struct Game *this
) </pre></td>
		<td colspan="3"> In the default game mode, this function sets the user's name.
 
<br></td>
	</tr>
	<tr>
		<td>18</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Game_playIO(
	char cInput,
	struct Game *this
) </pre></td>
		<td colspan="3"> Handles the IO of the gameplay section.
 
<br></td>
	</tr>
	<tr>
		<td>19</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Game_guideIO(
	char cInput,
	struct Game *this
) </pre></td>
		<td colspan="3"> Handles the IO of the guide section.
 I know this is empty but keeping it here makes everything cleaner.
 
<br></td>
	</tr>
	<tr>
		<td>20</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Game_controlsIO(
	char cInput,
	struct Game *this
) </pre></td>
		<td colspan="3"> Handles the IO of the controls section.
 I know this is empty but keeping it here makes everything cleaner.
 
<br></td>
	</tr>
	<tr>
		<td>21</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Game_authorIO(
	char cInput,
	struct Game *this
) </pre></td>
		<td colspan="3"> Handles the IO of the author section.
 I know this is empty but keeping it here makes everything cleaner.
 
<br></td>
	</tr>
	<tr>
		<td>22</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Game_dialogIO(
	char cInput,
	struct Game *this
) </pre></td>
		<td colspan="3"> Handles dialog box interaction.
 
<br></td>
	</tr>
	<tr>
		<td>23</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Game_playHome(struct Game *this) </pre></td>
		<td colspan="3"> Sets up all the processes associated with going home.
 
<br></td>
	</tr>
	<tr>
		<td>24</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Game_playFarm(struct Game *this) </pre></td>
		<td colspan="3"> Sets up all the processes associated with going to the farm.
 
<br></td>
	</tr>
	<tr>
		<td>25</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Game_playShop(struct Game *this) </pre></td>
		<td colspan="3"> Sets up all the processes associated with visiting the shop.
 
<br></td>
	</tr>
	<tr>
		<td>26</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Game_menu(struct Game *this) </pre></td>
		<td colspan="3"> Handles and puts together all the menu components.
 
<br></td>
	</tr>
	<tr>
		<td>27</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Game_play(struct Game *this) </pre></td>
		<td colspan="3"> Unifies all the gameplay components.
 
<br></td>
	</tr>
	<tr>
		<td>28</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Game_guide(struct Game *this) </pre></td>
		<td colspan="3"> Handles all the game guide components.
 
<br></td>
	</tr>
	<tr>
		<td>29</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Game_controls(struct Game *this) </pre></td>
		<td colspan="3"> Handles all the game guide components.
 
<br></td>
	</tr>
	<tr>
		<td>30</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Game_author(struct Game *this) </pre></td>
		<td colspan="3"> A little something about the author and the game.
 
<br></td>
	</tr>
	<tr>
		<td>31</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Game_consoleWarning(struct Game *this) </pre></td>
		<td colspan="3"> Displays a warning that the console size is too small (if it is).
 
<br></td>
	</tr>
	<tr>
		<td>32</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Game_conf(
	struct Game *this,
	char *sMode,
	char *sScene
) </pre></td>
		<td colspan="3"> Configures the running mode of the game.
 
<br></td>
	</tr>
	<tr>
		<td>33</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Game_execFull(struct Game *this) </pre></td>
		<td colspan="3"> Executes the full version of the game.
 Switches between scenes and what not.
 
<br></td>
	</tr>
	<tr>
		<td>34</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Game_execMini(struct Game *this) </pre></td>
		<td colspan="3"> Executes the minified version of the game.
 
<br></td>
	</tr>
	<tr>
		<td>35</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Game_exec(struct Game *this) </pre></td>
		<td colspan="3"> Executes the full version of the game.
 
<br></td>
	</tr>
</table>
<br>

<table style="font-size: 13px">
  <colgroup>
    <col span="1" style="width: 3%;">
    <col span="1" style="width: 10%;">
    <col span="1" style="width: 10%;">
    <col span="1" style="width: 22%;">
    <col span="1" style="width: 22%;">
    <col span="1" style="width: 22%;">
    <col span="1" style="width: 11%;">
  </colgroup>
	<tr>
		<th> # </th>
		<th colspan="3"> Functions in <code>game.manager.min.h</code> </th>
		<th colspan="3"> Description </th>
	</tr>
	<tr>
		<td>36</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void GameMini_init(
	struct GameMini *this,
	struct GameCatalogue *pCatalogue
) </pre></td>
		<td colspan="3"> Initializes the minified version of the game.
 
<br></td>
	</tr>
	<tr>
		<td>37</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void GameMini_makeFooter(struct GameMini *this) </pre></td>
		<td colspan="3"> Creates the footer for the entire game.
 
<br></td>
	</tr>
	<tr>
		<td>38</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void GameMini_cropSelection(struct GameMini *this) </pre></td>
		<td colspan="3"> Lists down the crops for selecting.
 
<br></td>
	</tr>
	<tr>
		<td>39</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void GameMini_UI(
	char cInput,
	struct GameMini *this
) </pre></td>
		<td colspan="3"> Handles the UI of the minified version of the game.
 
<br></td>
	</tr>
	<tr>
		<td>40</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void GameMini_IO(
	char cInput,
	struct GameMini *this
) </pre></td>
		<td colspan="3"> Handles the IO of the minified version of the game.
 
<br></td>
	</tr>
	<tr>
		<td>41</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void GameMini_maintainConsoleSize() </pre></td>
		<td colspan="3"> Just makes sure the console doesn't shrink too much when the user resizes.
</td>
	</tr>
	<tr>
		<td>42</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void GameMini_exec(struct GameMini *this) </pre></td>
		<td colspan="3"> Executes the actual flow of the mini game.
 
<br></td>
	</tr>
</table>
<br>

<table style="font-size: 13px">
  <colgroup>
    <col span="1" style="width: 3%;">
    <col span="1" style="width: 10%;">
    <col span="1" style="width: 10%;">
    <col span="1" style="width: 22%;">
    <col span="1" style="width: 22%;">
    <col span="1" style="width: 22%;">
    <col span="1" style="width: 11%;">
  </colgroup>
	<tr>
		<th> # </th>
		<th colspan="3"> Functions in <code>game.class.plot.h</code> </th>
		<th colspan="3"> Description </th>
	</tr>
	<tr>
		<td>43</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">struct Plot *Plot_new() </pre></td>
		<td colspan="3"> Allocates memory for an instance of plot.
 
<br></td>
	</tr>
	<tr>
		<td>44</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Plot_kill(struct Plot *this) </pre></td>
		<td colspan="3"> Frees memory from a destroyed instance.
 
<br></td>
	</tr>
	<tr>
		<td>45</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Plot_init(struct Plot *this) </pre></td>
		<td colspan="3"> Initializes a plot with a certain state.
 All plots are initially untilled.
 
<br></td>
	</tr>
	<tr>
		<td>46</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">struct Plot *Plot_create() </pre></td>
		<td colspan="3"> Creates a new plot and initializes it.
 
<br></td>
	</tr>
	<tr>
		<td>47</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">enum PlotState Plot_getState(struct Plot *this) </pre></td>
		<td colspan="3"> Returns the current state of the plot.
 
<br></td>
	</tr>
	<tr>
		<td>48</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">char *Plot_getProductName(struct Plot *this) </pre></td>
		<td colspan="3"> Returns the name of the product stored by the plot.
 Returns an empty string if there is currently no product stored by the plot.
 
<br></td>
	</tr>
	<tr>
		<td>49</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">char *Plot_getProductCode(struct Plot *this) </pre></td>
		<td colspan="3"> Returns the code of the product stored by the plot.
 Returns an empty string if there is no product.
 
<br></td>
	</tr>
	<tr>
		<td>50</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">enum ProductType Plot_getProductType(struct Plot *this) </pre></td>
		<td colspan="3"> Returns the type of the product.
 Returns PRODUCT_NULL if there is no product.
 
<br></td>
	</tr>
	<tr>
		<td>51</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int Plot_getProductState(struct Plot *this) </pre></td>
		<td colspan="3"> Returns the watering state of the product on the plot.
 Returns -1 if there is no product on the plot.
 
<br></td>
	</tr>
	<tr>
		<td>52</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int Plot_getProductWaterAmt(struct Plot *this) </pre></td>
		<td colspan="3"> Returns the how much water the plant has gotten.
 Returns -1 if there is no product on the plot.
 
<br></td>
	</tr>
	<tr>
		<td>53</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int Plot_getProductWaterReq(struct Plot *this) </pre></td>
		<td colspan="3"> Returns the how much water the plant needs.
 Returns -1 if there is no product on the plot.
 
<br></td>
	</tr>
	<tr>
		<td>54</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int Plot_getProductLastWatered(struct Plot *this) </pre></td>
		<td colspan="3"> Returns the last time the crop was watered.
 Return -2 if the plot has no product.
 
<br></td>
	</tr>
	<tr>
		<td>55</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int Plot_till(struct Plot *this) </pre></td>
		<td colspan="3"> Tills a plot IF it is in the PLOT_UNTILLED state.
 
<br></td>
	</tr>
	<tr>
		<td>56</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int Plot_sow(
	struct Plot *this,
	struct Product *pProduct
) </pre></td>
		<td colspan="3"> Plants a product on a plot IF it is in the PLOT_TILLED state.
 Precondition: pProduct is initialized.
 
<br></td>
	</tr>
	<tr>
		<td>57</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int Plot_water(
	struct Plot *this,
	int dTime
) </pre></td>
		<td colspan="3"> Waters the crop on the plot.
 Precondition: dTime is nonnegative
 
<br></td>
	</tr>
	<tr>
		<td>58</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int Plot_harvest(struct Plot *this) </pre></td>
		<td colspan="3"> Harvests a plot IF it has a crop on it.
 Precondition: the product has already fully grown.
 
<br></td>
	</tr>
</table>
<br>

<table style="font-size: 13px">
  <colgroup>
    <col span="1" style="width: 3%;">
    <col span="1" style="width: 10%;">
    <col span="1" style="width: 10%;">
    <col span="1" style="width: 22%;">
    <col span="1" style="width: 22%;">
    <col span="1" style="width: 22%;">
    <col span="1" style="width: 11%;">
  </colgroup>
	<tr>
		<th> # </th>
		<th colspan="3"> Functions in <code>game.class.product.h</code> </th>
		<th colspan="3"> Description </th>
	</tr>
	<tr>
		<td>59</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">struct Product *Product_new() </pre></td>
		<td colspan="3"> Allocates memory for an instance of Product.
 
<br></td>
	</tr>
	<tr>
		<td>60</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Product_kill(struct Product *this) </pre></td>
		<td colspan="3"> Frees memory for a destroyed instance of Product.
 
<br></td>
	</tr>
	<tr>
		<td>61</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Product_init(
	struct Product *this,
	enum ProductType eType,
	char cProductCode,
	char *sProductName,
	int dCostToBuy,
	int dCostToSell,
	int dWaterReq,
	int dWaterAmt,
	int dTimePlanted
) </pre></td>
		<td colspan="3"> Initializes the properties of the product.
 
<br></td>
	</tr>
	<tr>
		<td>62</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">struct Product *Product_create(
	enum ProductType eType,
	struct GameCatalogue* pCatalogue,
	int dTimePlanted
) </pre></td>
		<td colspan="3"> A helper function that creates a product of a certain type with default values
 
<br></td>
	</tr>
	<tr>
		<td>63</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int Product_getState(struct Product *this) </pre></td>
		<td colspan="3"> A function that returns the growth state of the crop.
 0 means the crop is less than halfway being fully watered.
 1 means the crop is at least halfway being fully watered.
 2 means the crop has been fully watered.
 
<br></td>
	</tr>
	<tr>
		<td>64</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">enum ProductType Product_getType(struct Product *this) </pre></td>
		<td colspan="3"> A function that type of the crop.
 
<br></td>
	</tr>
	<tr>
		<td>65</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int Product_getWaterAmt(struct Product *this) </pre></td>
		<td colspan="3"> A function that returns how much water the crop has received.
 
<br></td>
	</tr>
	<tr>
		<td>66</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int Product_getWaterReq(struct Product *this) </pre></td>
		<td colspan="3"> A function that returns how much water the crop needs.
 
<br></td>
	</tr>
	<tr>
		<td>67</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">char *Product_getCode(struct Product *this) </pre></td>
		<td colspan="3"> A function that returns the product code of the crop as a string.
 
<br></td>
	</tr>
	<tr>
		<td>68</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">char *Product_getName(struct Product *this) </pre></td>
		<td colspan="3"> A function that returns the product name of the crop as a string.
 
<br></td>
	</tr>
	<tr>
		<td>69</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int Product_getLastWatered(struct Product *this) </pre></td>
		<td colspan="3"> A function that returns when the product was last given water.
 
<br></td>
	</tr>
	<tr>
		<td>70</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int Product_water(
	struct Product *this,
	int dTime
) </pre></td>
		<td colspan="3"> A function that waters the crop.
 
<br></td>
	</tr>
</table>
<br>

<table style="font-size: 13px">
  <colgroup>
    <col span="1" style="width: 3%;">
    <col span="1" style="width: 10%;">
    <col span="1" style="width: 10%;">
    <col span="1" style="width: 22%;">
    <col span="1" style="width: 22%;">
    <col span="1" style="width: 22%;">
    <col span="1" style="width: 11%;">
  </colgroup>
	<tr>
		<th> # </th>
		<th colspan="3"> Functions in <code>game.class.stock.h</code> </th>
		<th colspan="3"> Description </th>
	</tr>
	<tr>
		<td>71</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">struct Stock *Stock_new() </pre></td>
		<td colspan="3"> Allocates memory for an instance of Stock.
 
<br></td>
	</tr>
	<tr>
		<td>72</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Stock_kill(struct Stock *this) </pre></td>
		<td colspan="3"> Frees memory for a destroyed instance of Stock.
 
<br></td>
	</tr>
	<tr>
		<td>73</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Stock_init(
	struct Stock *this,
	enum ProductType eProductType,
	int dCostToBuy,
	int dCostToSell,
	int dAmount
) </pre></td>
		<td colspan="3"> Initializes the properties of the stock.
 
<br></td>
	</tr>
	<tr>
		<td>74</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">struct Stock *Stock_create(
	enum ProductType eProductType,
	struct GameCatalogue *pCatalogue,
	int dAmount
) </pre></td>
		<td colspan="3"> A helper function that creates a stock of a certain amount and a certain type.
 
<br></td>
	</tr>
	<tr>
		<td>75</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int Stock_getAmount(struct Stock *this) </pre></td>
		<td colspan="3"> Gets the current amount of product stored by the stock.
 
<br></td>
	</tr>
	<tr>
		<td>76</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int Stock_updateAmount(
	struct Stock *this,
	int dAmountChange
) </pre></td>
		<td colspan="3"> Updates amount of product stored by the stock.
 Returns a boolean on whether or not the change was successful.
 
<br></td>
	</tr>
	<tr>
		<td>77</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int Stock_getBuyPrice(
	struct Stock *this,
	int dAmount
) </pre></td>
		<td colspan="3"> Gets the price of a certain amount of stock for buying.
 Returns 0 if there is not enough stock to buy that amount.
 
<br></td>
	</tr>
	<tr>
		<td>78</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int Stock_buyAmount(
	struct Stock *this,
	int dAmountChange
) </pre></td>
		<td colspan="3"> Buys a certain amount of the stock.
 Returns the price of buying that amount of stock.
 
<br></td>
	</tr>
	<tr>
		<td>79</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int Stock_getSellPrice(
	struct Stock *this,
	int dAmount
) </pre></td>
		<td colspan="3"> Gets the price of a certain amount of stock for selling.
 Returns 0 if there is not enough stock to sell that amount.
 
<br></td>
	</tr>
	<tr>
		<td>80</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int Stock_sellAmount(
	struct Stock *this,
	int dAmountChange
) </pre></td>
		<td colspan="3"> Sells a certain amount of the stock.
 Returns the cost of selling that amount of stock.
 
<br></td>
	</tr>
</table>
<br>

<table style="font-size: 13px">
  <colgroup>
    <col span="1" style="width: 3%;">
    <col span="1" style="width: 10%;">
    <col span="1" style="width: 10%;">
    <col span="1" style="width: 22%;">
    <col span="1" style="width: 22%;">
    <col span="1" style="width: 22%;">
    <col span="1" style="width: 11%;">
  </colgroup>
	<tr>
		<th> # </th>
		<th colspan="3"> Functions in <code>game.obj.farm.h</code> </th>
		<th colspan="3"> Description </th>
	</tr>
	<tr>
		<td>81</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">struct Farm *Farm_new() </pre></td>
		<td colspan="3"> Creates a new farm object.
 
<br></td>
	</tr>
	<tr>
		<td>82</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Farm_init(
	struct Farm *this,
	int dWidth,
	int dHeight,
	struct GameCatalogue *pCatalogue
) </pre></td>
		<td colspan="3"> Initializes a farm object.
 
<br></td>
	</tr>
	<tr>
		<td>83</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">struct Farm *Farm_create(
	int dWidth,
	int dHeight,
	struct GameCatalogue *pCatalogue
) </pre></td>
		<td colspan="3"> Creates an initialized farm object.
 
<br></td>
	</tr>
	<tr>
		<td>84</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Farm_kill(struct Farm *this) </pre></td>
		<td colspan="3"> Destroys a farm object.
 
<br></td>
	</tr>
	<tr>
		<td>85</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int Farm_getSelectorX(struct Farm *this) </pre></td>
		<td colspan="3"> Returns the x coordinate of the selector.
 
<br></td>
	</tr>
	<tr>
		<td>86</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int Farm_getSelectorY(struct Farm *this) </pre></td>
		<td colspan="3"> Returns the y coordinate of the selector.
 
<br></td>
	</tr>
	<tr>
		<td>87</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">struct Plot *Farm_getCurrentPlot(struct Farm *this) </pre></td>
		<td colspan="3"> Returns the information of the currently selected plot.
 
<br></td>
	</tr>
	<tr>
		<td>88</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int Farm_getCurrentQueueStatus(struct Farm *this) </pre></td>
		<td colspan="3"> Returns whether or not the currently selected plot has been queued for modification.
 
<br></td>
	</tr>
	<tr>
		<td>89</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">enum FarmAction Farm_getCurrentAction(struct Farm *this) </pre></td>
		<td colspan="3"> Returns the current action to be done on the farm.
 
<br></td>
	</tr>
	<tr>
		<td>90</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Farm_setCurrentAction(
	struct Farm *this,
	enum FarmAction eFarmAction
) </pre></td>
		<td colspan="3"> Sets the current action on the farm.
 
<br></td>
	</tr>
	<tr>
		<td>91</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">enum ProductType Farm_getCurrentCrop(struct Farm *this) </pre></td>
		<td colspan="3"> Returns the current crop to be used on the farm.
 
<br></td>
	</tr>
	<tr>
		<td>92</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Farm_setCurrentCrop(
	struct Farm *this,
	enum ProductType eProductType
) </pre></td>
		<td colspan="3"> Sets the current crop on the farm.
 
<br></td>
	</tr>
	<tr>
		<td>93</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int Farm_canTill(struct Farm *this) </pre></td>
		<td colspan="3"> Returns whether or not there exist plots that can be tilled.
 
<br></td>
	</tr>
	<tr>
		<td>94</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int Farm_canSow(struct Farm *this) </pre></td>
		<td colspan="3"> Returns whether or not there exist plots that can be sown.
 
<br></td>
	</tr>
	<tr>
		<td>95</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int Farm_canWater(
	struct Farm *this,
	int dTime
) </pre></td>
		<td colspan="3"> Returns whether or not there exist crops that can be watered.
 
<br></td>
	</tr>
	<tr>
		<td>96</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int Farm_canWaterCrop(
	struct Farm *this,
	int dTime
) </pre></td>
		<td colspan="3"> Returns whether or not there exist crops of the current type that can be watered.
 
<br></td>
	</tr>
	<tr>
		<td>97</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int Farm_canHarvest(struct Farm *this) </pre></td>
		<td colspan="3"> Returns whether or not there exist plots that can be harvested.
 
<br></td>
	</tr>
	<tr>
		<td>98</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int Farm_canHarvestCrop(struct Farm *this) </pre></td>
		<td colspan="3"> Returns whether or not there exist plots with crops of the current type that can be harvested.
 
<br></td>
	</tr>
	<tr>
		<td>99</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Farm_till(
	struct Farm *this,
	int dPlots
) </pre></td>
		<td colspan="3"> Tills the specified number of plots on the farm.
 The function does nothing if the specified number of plots cannot be tilled.
 
<br></td>
	</tr>
	<tr>
		<td>100</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Farm_sow(
	struct Farm *this,
	int dPlots,
	struct GameCatalogue *pCatalogue,
	int dTime
) </pre></td>
		<td colspan="3"> Sows the specified number of plots on the farm.
 The function does nothing if there are too many plots to sow.
 
<br></td>
	</tr>
	<tr>
		<td>101</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Farm_water(
	struct Farm *this,
	int dTime
) </pre></td>
		<td colspan="3"> Waters the currently selected crop on the farm.
 
<br></td>
	</tr>
	<tr>
		<td>102</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Farm_harvest(struct Farm *this) </pre></td>
		<td colspan="3"> Harvests the currently selected crop on the farm.
 
<br></td>
	</tr>
	<tr>
		<td>103</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Farm_startSelecting(struct Farm *this) </pre></td>
		<td colspan="3"> Enables selecting plots.
 
<br></td>
	</tr>
	<tr>
		<td>104</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Farm_stopSelecting(struct Farm *this) </pre></td>
		<td colspan="3"> Disables selecting plots.
 
<br></td>
	</tr>
	<tr>
		<td>105</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Farm_incrementX(struct Farm *this) </pre></td>
		<td colspan="3"> Moves the selector to the right.
 
<br></td>
	</tr>
	<tr>
		<td>106</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Farm_decrementX(struct Farm *this) </pre></td>
		<td colspan="3"> Moves the selector to the left.
 
<br></td>
	</tr>
	<tr>
		<td>107</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Farm_incrementY(struct Farm *this) </pre></td>
		<td colspan="3"> Moves the selector a line down.
 
<br></td>
	</tr>
	<tr>
		<td>108</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Farm_decrementY(struct Farm *this) </pre></td>
		<td colspan="3"> Moves the selector a line up.
 
<br></td>
	</tr>
	<tr>
		<td>109</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int Farm_getQueueLength(struct Farm* this) </pre></td>
		<td colspan="3"> Returns the length of the queue.
 
<br></td>
	</tr>
	<tr>
		<td>110</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Farm_queueSelected(
	struct Farm *this,
	int dTime
) </pre></td>
		<td colspan="3"> Adds the currently selected plot to the queue.
 
<br></td>
	</tr>
	<tr>
		<td>111</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Farm_unqueueSelected(struct Farm *this) </pre></td>
		<td colspan="3"> Removes the currently selected plot from the queue.
 
<br></td>
	</tr>
	<tr>
		<td>112</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Farm_toggleSelected(
	struct Farm *this,
	int dTime
) </pre></td>
		<td colspan="3"> Toggles the truth value of the currently selected plot in the selection array.
 
<br></td>
	</tr>
	<tr>
		<td>113</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Farm_clearQueue(struct Farm *this) </pre></td>
		<td colspan="3"> Empties the selection queue of the farm object.
 
<br></td>
	</tr>
	<tr>
		<td>114</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int Farm_processQueue(
	struct Farm *this,
	struct Player *pPlayer,
	struct GameCatalogue *pCatalogue,
	int dTime
) </pre></td>
		<td colspan="3"> Performs the current action on the queued plots.
 
<br></td>
	</tr>
	<tr>
		<td>115</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">struct UtilsText *Farm_displayGrid(
	struct Farm *this,
	int dTime
) </pre></td>
		<td colspan="3"> A helper function that creates a text array that represents the farm grid.
 
<br></td>
	</tr>
	<tr>
		<td>116</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Farm_UI(
  struct Farm *this,
  struct Player *pPlayer,
  struct UtilsText *pScreenText,
  struct UtilsSelector *pCatalogueSelector,
  struct GameCatalogue *pCatalogue,
  char **sFarmSprite, 
  int dFarmSriteSize, 
  char *sCurrentIntInput, 
  char *sInputWarning
)</pre></td>
		<td colspan="3"> Displays the UI of the farm.
 
<br></td>
	</tr>
	<tr>
		<td>117</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Farm_IO(
  struct Farm *this, 
  struct Player *pPlayer,
  struct UtilsSelector *pCatalogueSelector,
  struct GameCatalogue *pCatalogue,
  char cInput, 
  char *sCurrentIntInput, 
  char *sInputWarning, 
  enum PlayState *pPlayState,
  enum GameState *pGameState
)</pre></td>
		<td colspan="3"> Handles the interaction with the farm object.
 
<br></td>
	</tr>
	<tr>
		<td>118</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Farm_footer(
  struct Farm *this,
  struct Player *pPlayer,
  struct UtilsText *pFooterText,
  struct UtilsSelector *pCatalogueSelector,
  struct GameCatalogue *pCatalogue,
  char **sFarmSelectText,
  char *sFooterFrontTemplate,
  char *sFooterBlankFrontTemplate
)</pre></td>
		<td colspan="3"> Creates the footer while in the farm.
 
<br></td>
	</tr>
</table>
<br>

<table style="font-size: 13px">
  <colgroup>
    <col span="1" style="width: 3%;">
    <col span="1" style="width: 10%;">
    <col span="1" style="width: 10%;">
    <col span="1" style="width: 22%;">
    <col span="1" style="width: 22%;">
    <col span="1" style="width: 22%;">
    <col span="1" style="width: 11%;">
  </colgroup>
	<tr>
		<th> # </th>
		<th colspan="3"> Functions in <code>game.obj.player.h</code> </th>
		<th colspan="3"> Description </th>
	</tr>
	<tr>
		<td>119</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">struct Player *Player_new() </pre></td>
		<td colspan="3"> A constructor for the player object.
 
<br></td>
	</tr>
	<tr>
		<td>120</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Player_init(
	struct Player *this,
	int dGold,
	int dEnergy,
	int dDefaultEnergy,
	struct GameCatalogue *pCatalogue
) </pre></td>
		<td colspan="3"> This function initializes the properties of the object.
 
<br></td>
	</tr>
	<tr>
		<td>121</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">struct Player *Player_create(
	int dGold,
	int dEnergy,
	int dDefaultEnergy,
	struct GameCatalogue *pCatalogue
) </pre></td>
		<td colspan="3"> Creates an initialized player object.
  
<br></td>
	</tr>
	<tr>
		<td>122</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Player_kill(struct Player *this) </pre></td>
		<td colspan="3"> Destroys a player object.
  
<br></td>
	</tr>
	<tr>
		<td>123</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Player_setName(
	struct Player *this,
	char *sName
) </pre></td>
		<td colspan="3"> Sets the name of the player object.
 If the provided name is too long, then nothing happens.
 
<br></td>
	</tr>
	<tr>
		<td>124</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">char *Player_getName(struct Player *this) </pre></td>
		<td colspan="3"> Gets the name of the player object.
 
<br></td>
	</tr>
	<tr>
		<td>125</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int Player_getTime(struct Player *this) </pre></td>
		<td colspan="3"> Gets the current time stored in the player.
 
<br></td>
	</tr>
	<tr>
		<td>126</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int Player_getGold(struct Player *this) </pre></td>
		<td colspan="3"> Returns the amount of gold the player has.
 
<br></td>
	</tr>
	<tr>
		<td>127</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int Player_getEnergy(struct Player *this) </pre></td>
		<td colspan="3"> Returns the amount of energy the player has.
 
<br></td>
	</tr>
	<tr>
		<td>128</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">struct Stock *Player_getSeedStock(
	struct Player *this,
	enum ProductType eProductType
) </pre></td>
		<td colspan="3"> Gets a piece of the inventory of the player.
 
<br></td>
	</tr>
	<tr>
		<td>129</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Player_updateSeedStock(
	struct Player *this,
	enum ProductType eProductType,
	int dChangeAmount
) </pre></td>
		<td colspan="3"> Sets how much seed bags were used or purchased by the player.
 
<br></td>
	</tr>
	<tr>
		<td>130</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">struct Stock *Player_getCropStock(
	struct Player *this,
	enum ProductType eProductType
) </pre></td>
		<td colspan="3"> Gets a piece of the inventory of the player.
 
<br></td>
	</tr>
	<tr>
		<td>131</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Player_updateCropStock(
	struct Player *this,
	enum ProductType eProductType,
	int dChangeAmount
) </pre></td>
		<td colspan="3"> Sets how much crops were sold or harvested by the player.
 
<br></td>
	</tr>
	<tr>
		<td>132</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int Player_updateGold(
	struct Player *this,
	int dGoldChange
) </pre></td>
		<td colspan="3"> Updates the player's amount of gold.
 Returns 0 if the change was not successful.
 
<br></td>
	</tr>
	<tr>
		<td>133</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int Player_updateEnergy(
	struct Player *this,
	int dEnergyChange
) </pre></td>
		<td colspan="3"> Updates the player's amount of energy.
 Returns 0 if the change was not successful.
 
<br></td>
	</tr>
	<tr>
		<td>134</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int Player_isDead(struct Player *this) </pre></td>
		<td colspan="3"> Checks if player has died of starvation.
 
<br></td>
	</tr>
	<tr>
		<td>135</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int Player_isStarving(struct Player *this) </pre></td>
		<td colspan="3"> Checks if player is starving for the current day.
 
<br></td>
	</tr>
	<tr>
		<td>136</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Player_goHome(struct Player *this) </pre></td>
		<td colspan="3"> Makes the player go home.
 They sleep then eat breakfast when they wake up, ASSUMING they can buy it.
 
<br></td>
	</tr>
	<tr>
		<td>137</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int Player_tillPlots(
	struct Player *this,
	int dPlots
) </pre></td>
		<td colspan="3"> Updates the player state after tilling the given number of plots.
 
<br></td>
	</tr>
	<tr>
		<td>138</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int Player_sowSeeds(
	struct Player *this,
	enum ProductType eProductType,
	int dSeeds
) </pre></td>
		<td colspan="3"> Updates the players state after sowing the provided amount of seeds.
 
<br></td>
	</tr>
	<tr>
		<td>139</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int Player_waterCrops(
	struct Player *this,
	int dCrops
) </pre></td>
		<td colspan="3"> Updates the player's state after watering crops.
 
<br></td>
	</tr>
	<tr>
		<td>140</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int Player_harvestCrops(
	struct Player *this,
	int dCrops
) </pre></td>
		<td colspan="3"> Updates the state of the player after harvesting a number of various crops.
 
<br></td>
	</tr>
	<tr>
		<td>141</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Player_harvestACrop(
	struct Player *this,
	enum ProductType eProductType
) </pre></td>
		<td colspan="3"> Harvests a single crop of the specified type.
 
<br></td>
	</tr>
	<tr>
		<td>142</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int Player_buyCrop(
	struct Player *this,
	enum ProductType eProductType,
	int dAmount,
	int dCost
) </pre></td>
		<td colspan="3"> Updates the state of the player after buying a certain amount of seeds.
 
<br></td>
	</tr>
	<tr>
		<td>143</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int Player_sellCrop(
	struct Player *this,
	enum ProductType eProductType,
	int dAmount,
	int dCost
) </pre></td>
		<td colspan="3"> Updates the state of the player after selling a certain amount of crops.
 
<br></td>
	</tr>
</table>
<br>

<table style="font-size: 13px">
  <colgroup>
    <col span="1" style="width: 3%;">
    <col span="1" style="width: 10%;">
    <col span="1" style="width: 10%;">
    <col span="1" style="width: 22%;">
    <col span="1" style="width: 22%;">
    <col span="1" style="width: 22%;">
    <col span="1" style="width: 11%;">
  </colgroup>
	<tr>
		<th> # </th>
		<th colspan="3"> Functions in <code>game.obj.shop.h</code> </th>
		<th colspan="3"> Description </th>
	</tr>
	<tr>
		<td>144</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">struct Shop *Shop_new() </pre></td>
		<td colspan="3"> Creates a new shop object.
 
<br></td>
	</tr>
	<tr>
		<td>145</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Shop_init(
	struct Shop *this,
	struct GameCatalogue *pCatalogue
) </pre></td>
		<td colspan="3"> Initializes the shop object.
 
<br></td>
	</tr>
	<tr>
		<td>146</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">struct Shop *Shop_create(struct GameCatalogue *pCatalogue) </pre></td>
		<td colspan="3"> Creates an initialized shop object.
 
<br></td>
	</tr>
	<tr>
		<td>147</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Shop_kill(struct Shop *this) </pre></td>
		<td colspan="3"> Destroys a shop object.
 
<br></td>
	</tr>
	<tr>
		<td>148</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">enum ShopAction Shop_getCurrentAction(struct Shop *this) </pre></td>
		<td colspan="3"> Returns the current action selected for the shop.
 
<br></td>
	</tr>
	<tr>
		<td>149</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Shop_setCurrentAction(
	struct Shop *this,
	enum ShopAction eShopAction
) </pre></td>
		<td colspan="3"> Sets the current action selected for the shop.
 
<br></td>
	</tr>
	<tr>
		<td>150</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">enum ProductType Shop_getCurrentCrop(struct Shop *this) </pre></td>
		<td colspan="3"> Returns the current crop selected for the shop.
 
<br></td>
	</tr>
	<tr>
		<td>151</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Shop_setCurrentCrop(
	struct Shop *this,
	enum ProductType eProductType
) </pre></td>
		<td colspan="3"> Sets the current crop selected for the shop.
 
<br></td>
	</tr>
	<tr>
		<td>152</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int Shop_getCurrentBuyCost(
	struct Shop *this,
	int dAmount
) </pre></td>
		<td colspan="3"> A function that returns how much a certain number of items costs.
 
<br></td>
	</tr>
	<tr>
		<td>153</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int Shop_buyCurrentProduct(
	struct Shop *this,
	int dAmount
) </pre></td>
		<td colspan="3"> A function that allows you to buy a certain amount of product from the shop.
 Returns 0 if the purchase was not successful.
 
<br></td>
	</tr>
	<tr>
		<td>154</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int Shop_getCurrentSellCost(
	struct Shop *this,
	int dAmount
)</pre></td>
		<td colspan="3"> A function that returns how much a certain number of items will give.
 
<br></td>
	</tr>
	<tr>
		<td>155</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Shop_sellCurrentProduct(
	struct Shop *this,
	int dAmount
)</pre></td>
		<td colspan="3"> A function that allows you to sell a certain amount of product to the shop.
 
<br></td>
	</tr>
	<tr>
		<td>156</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Shop_UI(
  struct Shop *this, 
  struct Player *pPlayer,
  struct UtilsText *pScreenText,
  struct UtilsSelector *pCatalogueSelector,
  struct GameCatalogue *pCatalogue,
  char **sShopSprite, 
  int dShopSriteSize, 
  char *sCurrentIntInput, 
  char *sInputWarning
)</pre></td>
		<td colspan="3"> Displays the shop UI.
 
<br></td>
	</tr>
	<tr>
		<td>157</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Shop_IO(
  struct Shop *this, 
  struct Player *pPlayer,
  struct UtilsSelector *pCatalogueSelector,
  struct GameCatalogue *pCatalogue,
  char cInput, 
  char *sCurrentIntInput, 
  char *sInputWarning, 
  enum PlayState *pPlayState,
  enum GameState *pGameState
)</pre></td>
		<td colspan="3"> Handles the interaction with the shop object.
 
<br></td>
	</tr>
	<tr>
		<td>158</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void Shop_footer(
  struct Shop *this,
  struct Player *pPlayer,
  struct UtilsText *pFooterText,
  struct UtilsSelector *pCatalogueSelector,
  struct GameCatalogue *pCatalogue,
  char **sShopSelectText,
  char *sFooterFrontTemplate,
  char *sFooterBlankFrontTemplate
)</pre></td>
		<td colspan="3"> Creates the footer while in the shop.
 
<br></td>
	</tr>
</table>
<br>

<table style="font-size: 13px">
  <colgroup>
    <col span="1" style="width: 3%;">
    <col span="1" style="width: 10%;">
    <col span="1" style="width: 10%;">
    <col span="1" style="width: 22%;">
    <col span="1" style="width: 22%;">
    <col span="1" style="width: 22%;">
    <col span="1" style="width: 11%;">
  </colgroup>
	<tr>
		<th> # </th>
		<th colspan="3"> Functions in <code>utils.io.h</code> </th>
		<th colspan="3"> Description </th>
	</tr>
	<tr>
		<td>159</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void UtilsIO_init(struct UtilsIO *this) </pre></td>
		<td colspan="3"> This only exists here because I need to set some stuff up for Unix-based OS's.
 
<br></td>
	</tr>
	<tr>
		<td>160</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int UtilsIO_getWidth() </pre></td>
		<td colspan="3"> Helper function that returns the width of the console.
 Note that this function is responsive to resizing.
 
<br></td>
	</tr>
	<tr>
		<td>161</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int UtilsIO_getHeight() </pre></td>
		<td colspan="3"> Helper function that returns the height of the console.
 Note that this function is responsive to resizing.
 
<br></td>
	</tr>
	<tr>
		<td>162</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int UtilsIO_setSize(
	int dWidth,
	int dHeight
) </pre></td>
		<td colspan="3"> A helper function that resizes the console window.
 This function only works on Windows (I could not find an implementation for Unix users).
 
<br> Note that the function is implemented this way BECAUSE: 
    (1) the buffer size apparently cannot be smaller than the console size AND
    (2) the console size cannot be bigger than the screen buffer.
 
<br> By shrinking the window size to the absolute minimum, we spare ourselves from "crushing" the buffer size into the window size when shrinking.
 It also prevents the window size from "crashing" into the buffer when making it bigger.
 When I tried using a rudimentary implementation that did without the minWIndowSize step, some nasty scrollbars appeared on the side.
 
<br></td>
	</tr>
	<tr>
		<td>163</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void UtilsIO_clear() </pre></td>
		<td colspan="3"> Helper function that clears the console.
</td>
	</tr>
	<tr>
		<td>164</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">char UtilsIO_readChar() </pre></td>
		<td colspan="3"> Helper function that gets a single character without return key.
 
<br></td>
	</tr>
	<tr>
		<td>165</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void UtilsIO_exit(struct UtilsIO *this) </pre></td>
		<td colspan="3"> This only exists mainly because I need to do some housekeeping for Unix-based OS's.
 
<br></td>
	</tr>
	<tr>
		<td>166</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void UtilsIO_init(struct UtilsIO *this) </pre></td>
		<td colspan="3"> Sets up some stuff for IO handling.
 Overrides default terminal settings so I can replicate getch behaviour on Unix-based OS's.
 
<br></td>
	</tr>
	<tr>
		<td>167</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int UtilsIO_getWidth() </pre></td>
		<td colspan="3"> Helper function that returns the width of the console.
 Note that this function is responsive to resizing.
 
<br></td>
	</tr>
	<tr>
		<td>168</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int UtilsIO_getHeight() </pre></td>
		<td colspan="3"> Helper function that returns the height of the console.
 Note that this function is responsive to resizing.
 
<br></td>
	</tr>
	<tr>
		<td>169</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int UtilsIO_setSize(
	int dWidth,
	int dHeight
) </pre></td>
		<td colspan="3"> A helper function that resizes the console window.
 Unfortunately, I could not find a POSIX-compliant implementation.
 This is just here as a dummy function.
 
<br></td>
	</tr>
	<tr>
		<td>170</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void UtilsIO_clear() </pre></td>
		<td colspan="3"> Helper function that clears the console.
</td>
	</tr>
	<tr>
		<td>171</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">char UtilsIO_readChar() </pre></td>
		<td colspan="3"> Helper function that gets a single character without return key.
 
<br></td>
	</tr>
	<tr>
		<td>172</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void UtilsIO_exit(struct UtilsIO *this) </pre></td>
		<td colspan="3"> Clean up the stuff I used.
 
<br></td>
	</tr>
	<tr>
		<td>173</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int UtilsIO_isReturn(char cChar) </pre></td>
		<td colspan="3"> Returns whether or not the character is a LF (line feed) or CR (carriage return) character.
 
<br></td>
	</tr>
	<tr>
		<td>174</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int UtilsIO_isBackspace(char cChar) </pre></td>
		<td colspan="3"> Returns whether or not the character is a backspace character.
 
<br></td>
	</tr>
	<tr>
		<td>175</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">char *UtilsIO_newInputStr() </pre></td>
		<td colspan="3"> A helper function that creates a string that can hold input values.
 
<br></td>
	</tr>
	<tr>
		<td>176</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void UtilsIO_killInputStr(char *sOutput) </pre></td>
		<td colspan="3"> A helper function that kills a string.
 
<br></td>
	</tr>
	<tr>
		<td>177</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">char UtilsIO_inputChar() </pre></td>
		<td colspan="3"> Helper function that handles character inputs.
 Prints the input as it is inputted.
 
<br></td>
	</tr>
	<tr>
		<td>178</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">char *UtilsIO_inputStr() </pre></td>
		<td colspan="3"> Helper function that handles string inputs.
 
<br></td>
	</tr>
	<tr>
		<td>179</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int UtilsIO_inputStrOut(char *sOutput) </pre></td>
		<td colspan="3"> Helper function that handles string inputs.
 This version of the function modifies a string instead of returning one.
 Note that sOutput should have enough space to receive a maximum of UTILS_IO_MAX_INPUT characters.
 
<br></td>
	</tr>
</table>
<br>

<table style="font-size: 13px">
  <colgroup>
    <col span="1" style="width: 3%;">
    <col span="1" style="width: 10%;">
    <col span="1" style="width: 10%;">
    <col span="1" style="width: 22%;">
    <col span="1" style="width: 22%;">
    <col span="1" style="width: 22%;">
    <col span="1" style="width: 11%;">
  </colgroup>
	<tr>
		<th> # </th>
		<th colspan="3"> Functions in <code>utils.key.h</code> </th>
		<th colspan="3"> Description </th>
	</tr>
	<tr>
		<td>180</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">char UtilsKey_uppercaseChar() </pre></td>
		<td colspan="3"> Enables some basic interaction with the game by returning the uppercase version of a character.
 I don't know why I didn't realize until after the entire ordeal of coding this project that toupper() exists.
 
<br></td>
	</tr>
	<tr>
		<td>181</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void UtilsKey_inputPoll(
  int (*fCondition)(char cInput, char *sReference),
  void (*fPreProcess)(char cInput, void *pData),
  void (*fPostProcess)(char cInput, void *pData), 
  void *pData, char *sReference
)</pre></td>
		<td colspan="3"> Enables input to be polled from the user.
 Input will constantly be asked from the user until enter is pressed.
 Uses uppercase version of alpha characters.
 
<br></td>
	</tr>
	<tr>
		<td>182</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void UtilsKey_inputString(
  void (*fProcess)(char* sInput, void *pData),
  void (*fExitProcess)(char* sInput, void *pData),
  void *pData
)</pre></td>
		<td colspan="3"> Enables string input from the user.
 Terminates when enter is pressed.
 
<br></td>
	</tr>
	<tr>
		<td>183</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int UtilsKey_isNum(char cInput) </pre></td>
		<td colspan="3"> Returns whether or not a character represents a digit character.
 
<br></td>
	</tr>
	<tr>
		<td>184</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int UtilsKey_isAlpha(char cInput) </pre></td>
		<td colspan="3"> Returns whether or not a character represents an alphabet character.
 
<br></td>
	</tr>
	<tr>
		<td>185</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int UtilsKey_isReturn(
	char cInput,
	char *sDummy
) </pre></td>
		<td colspan="3"> Returns whether or not the character is a newline or EOF.
 I know it's kinda redundant with UtilsIO_isReturn, 
    BUT I don't wanna have to access two different header files when coding the other game components.
 
<br></td>
	</tr>
	<tr>
		<td>186</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int UtilsKey_isBackspace(
	char cInput,
	char *sDummy
) </pre></td>
		<td colspan="3"> Returns whether or not the character is a backspace or delete character.
 
<br></td>
	</tr>
	<tr>
		<td>187</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int UtilsKey_isNotReturn(
	char cInput,
	char *sDummy
) </pre></td>
		<td colspan="3"> Just another helper function.
 
<br></td>
	</tr>
	<tr>
		<td>188</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int UtilsKey_isNot(
	char cInput,
	char *sReference
) </pre></td>
		<td colspan="3"> If character is not in char array.
 
<br></td>
	</tr>
	<tr>
		<td>189</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int UtilsKey_dummy(
	char cInput,
	char *sReference
) </pre></td>
		<td colspan="3"> A dummy function we can use to instantly terminate the inputPoll method.
 
<br></td>
	</tr>
	<tr>
		<td>190</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int UtilsKey_stringToInt(char *sInt) </pre></td>
		<td colspan="3"> Converts positive integer strings into their respective int values.
 
<br></td>
	</tr>
</table>
<br>

<table style="font-size: 13px">
  <colgroup>
    <col span="1" style="width: 3%;">
    <col span="1" style="width: 10%;">
    <col span="1" style="width: 10%;">
    <col span="1" style="width: 22%;">
    <col span="1" style="width: 22%;">
    <col span="1" style="width: 22%;">
    <col span="1" style="width: 11%;">
  </colgroup>
	<tr>
		<th> # </th>
		<th colspan="3"> Functions in <code>utils.selector.h</code> </th>
		<th colspan="3"> Description </th>
	</tr>
	<tr>
		<td>191</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">struct UtilsSelector *UtilsSelector_new() </pre></td>
		<td colspan="3"> Creates a new instance of the UtilsSelector class.
 
<br></td>
	</tr>
	<tr>
		<td>192</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void UtilsSelector_init(
	struct UtilsSelector *this,
	int bIsLooped,
	char *sDefaultWrapper,
	char *sSelectedWrapper,
	char *sDisabledWrapper
) </pre></td>
		<td colspan="3"> Initializes an instance of the UtilsSelector class.
 Note that if the wrapper template strings are too long, they are simply replaced with "%s".
 
<br></td>
	</tr>
	<tr>
		<td>193</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">struct UtilsSelector *UtilsSelector_create(
	int bIsLooped,
	char *sDefaultWrapper,
	char *sSelectedWrapper,
	char *sDisabledWrapper
) </pre></td>
		<td colspan="3"> Creates an initialized instance of the class.
 
<br></td>
	</tr>
	<tr>
		<td>194</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void UtilsSelector_kill(struct UtilsSelector *this) </pre></td>
		<td colspan="3"> Destroys an instance of the class.
 
<br></td>
	</tr>
	<tr>
		<td>195</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void UtilsSelector_addOption(
	struct UtilsSelector *this,
	char *sOption,
	int dOptionValue
) </pre></td>
		<td colspan="3"> Adds a new option to the selection.
 
<br></td>
	</tr>
	<tr>
		<td>196</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">char *UtilsSelector_getOption(
	struct UtilsSelector *this,
	int dIndex
) </pre></td>
		<td colspan="3"> Returns a certain option.
 
<br></td>
	</tr>
	<tr>
		<td>197</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void UtilsSelector_setOptionAvailability(
	struct UtilsSelector *this,
	int dIndex,
	int bAvailability
) </pre></td>
		<td colspan="3"> Returns a certain option.
 
<br></td>
	</tr>
	<tr>
		<td>198</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void UtilsSelector_setAllAvailability(
	struct UtilsSelector *this,
	int bAvailability
) </pre></td>
		<td colspan="3"> Sets the availability of all options.
 
<br></td>
	</tr>
	<tr>
		<td>199</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void UtilsSelector_setFirstAvailable(struct UtilsSelector *this) </pre></td>
		<td colspan="3"> If the current value of the selector is unavailable, we gett the first available value in the array.
 
<br></td>
	</tr>
	<tr>
		<td>200</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int UtilsSelector_getOptionValue(
	struct UtilsSelector *this,
	int dIndex
) </pre></td>
		<td colspan="3"> Returns the value of a certain option.
 
<br></td>
	</tr>
	<tr>
		<td>201</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int UtilsSelector_getAvailableCount(struct UtilsSelector *this) </pre></td>
		<td colspan="3"> Gets how many options are available in the selector.
 
<br></td>
	</tr>
	<tr>
		<td>202</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int UtilsSelector_getCurrentIndex(struct UtilsSelector *this) </pre></td>
		<td colspan="3"> Gets the current selected index.
 
<br></td>
	</tr>
	<tr>
		<td>203</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">char *UtilsSelector_getCurrentOption(struct UtilsSelector *this) </pre></td>
		<td colspan="3"> Gets the option of the current selected index.
 
<br></td>
	</tr>
	<tr>
		<td>204</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int UtilsSelector_getCurrentValue(struct UtilsSelector *this) </pre></td>
		<td colspan="3"> Gets the value of the current selected option.
 
<br></td>
	</tr>
	<tr>
		<td>205</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">char *UtilsSelector_getOptionFormatted(
	struct UtilsSelector *this,
	int dIndex
) </pre></td>
		<td colspan="3"> Gets the formatted string for the option requested.
 
<br></td>
	</tr>
	<tr>
		<td>206</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int UtilsSelector_getLength(struct UtilsSelector *this) </pre></td>
		<td colspan="3"> Returns how many options are stored by the instance.
 
<br></td>
	</tr>
	<tr>
		<td>207</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void UtilsSelector_increment(struct UtilsSelector *this) </pre></td>
		<td colspan="3"> Increments the selection index.
 
<br></td>
	</tr>
	<tr>
		<td>208</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void UtilsSelector_decrement(struct UtilsSelector *this) </pre></td>
		<td colspan="3"> Decrements the selection index.
 
<br></td>
	</tr>
</table>
<br>

<table style="font-size: 13px">
  <colgroup>
    <col span="1" style="width: 3%;">
    <col span="1" style="width: 10%;">
    <col span="1" style="width: 10%;">
    <col span="1" style="width: 22%;">
    <col span="1" style="width: 22%;">
    <col span="1" style="width: 22%;">
    <col span="1" style="width: 11%;">
  </colgroup>
	<tr>
		<th> # </th>
		<th colspan="3"> Functions in <code>utils.text.h</code> </th>
		<th colspan="3"> Description </th>
	</tr>
	<tr>
		<td>209</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">struct UtilsText *UtilsText_new() </pre></td>
		<td colspan="3"> Returns a new instance of the UtilsText class.
 
<br></td>
	</tr>
	<tr>
		<td>210</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void UtilsText_init(struct UtilsText *this) </pre></td>
		<td colspan="3"> Initializes the object.
 
<br></td>
	</tr>
	<tr>
		<td>211</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">struct UtilsText *UtilsText_create() </pre></td>
		<td colspan="3"> Creates an initialized instance of the class.
 
<br></td>
	</tr>
	<tr>
		<td>212</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void UtilsText_kill(struct UtilsText *this) </pre></td>
		<td colspan="3"> Destroys a specified instance.
 
<br></td>
	</tr>
	<tr>
		<td>213</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void UtilsText_addPatternLines(
	struct UtilsText *this,
	int dLines,
	char *sPattern
) </pre></td>
		<td colspan="3"> Adds a line of a repeated string pattern.
 
<br></td>
	</tr>
	<tr>
		<td>214</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void UtilsText_addNewLines(
	struct UtilsText *this,
	int dLines
) </pre></td>
		<td colspan="3"> Adds the specified number of newlines to the array.
 
<br></td>
	</tr>
	<tr>
		<td>215</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void UtilsText_addText(
	struct UtilsText *this,
	char *sText
) </pre></td>
		<td colspan="3"> Adds a new string to the instance and updates the length variable.
 If the array has already reached the maximum number of lines, nothing happens.
 
<br></td>
	</tr>
	<tr>
		<td>216</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void UtilsText_addBlock(
	struct UtilsText *this,
	char **sTextArray,
	int dLines
) </pre></td>
		<td colspan="3"> Adds a new string to the instance and updates the length variable.
 If the array has already reached the maximum number of lines, nothing happens.
 
<br></td>
	</tr>
	<tr>
		<td>217</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">char **UtilsText_getText(struct UtilsText *this) </pre></td>
		<td colspan="3"> Returns the array of strigns stored by the struct.
 
<br></td>
	</tr>
	<tr>
		<td>218</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">char *UtilsText_getTextLine(
	struct UtilsText *this,
	int dIndex
) </pre></td>
		<td colspan="3"> Returns one of the stored lines of text.
 
<br></td>
	</tr>
	<tr>
		<td>219</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">int UtilsText_getLines(struct UtilsText *this) </pre></td>
		<td colspan="3"> Returns the number of lines stored by the instance.
 
<br></td>
	</tr>
	<tr>
		<td>220</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void UtilsText_mergeText(
	struct UtilsText *this,
	struct UtilsText *pSource
) </pre></td>
		<td colspan="3"> Combines a source UtilsText object with a destination UtilsText object.
 
<br></td>
	</tr>
	<tr>
		<td>221</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">char *UtilsText_paddedText(
	char *sText,
	char *sPadText,
	enum UtilsText_Alignment eAlignment
) </pre></td>
		<td colspan="3"> A helper function to created a line of text padded with a certain character set.
 
<br></td>
	</tr>
	<tr>
		<td>222</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">char *UtilsText_centeredText(char *sText) </pre></td>
		<td colspan="3"> A helper function to create a single line of text centered along the width of the console.
 
<br></td>
	</tr>
</table>
<br>

<table style="font-size: 13px">
  <colgroup>
    <col span="1" style="width: 3%;">
    <col span="1" style="width: 10%;">
    <col span="1" style="width: 10%;">
    <col span="1" style="width: 22%;">
    <col span="1" style="width: 22%;">
    <col span="1" style="width: 22%;">
    <col span="1" style="width: 11%;">
  </colgroup>
	<tr>
		<th> # </th>
		<th colspan="3"> Functions in <code>utils.ui.h</code> </th>
		<th colspan="3"> Description </th>
	</tr>
	<tr>
		<td>223</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">struct UtilsText *UtilsUI_centerX(struct UtilsText *pUtilsText) </pre></td>
		<td colspan="3"> A helper function to create a lines of text centered along the width of the console.
 
<br></td>
	</tr>
	<tr>
		<td>224</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">struct UtilsText *UtilsUI_centerXY(struct UtilsText *pUtilsText) </pre></td>
		<td colspan="3"> A helper function to create text centered on the console.
 This is honestly implemented in such a disgusting way; it accesses the struct members directly instead of using setters and getters.
 I don't know why using the setters and getters don't seem to work here hmmm.
 
<br></td>
	</tr>
	<tr>
		<td>225</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">struct UtilsText *UtilsUI_header(
	struct UtilsText *pUtilsText,
	struct UtilsText *pHeader
) </pre></td>
		<td colspan="3"> Modifies the first few lines in the string array of the object to create a header.
 
<br></td>
	</tr>
	<tr>
		<td>226</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">struct UtilsText *UtilsUI_footer(
	struct UtilsText *pUtilsText,
	struct UtilsText *pFooter
) </pre></td>
		<td colspan="3"> Modifies the last few lines in the string array of the object to create a footer.
 
<br></td>
	</tr>
	<tr>
		<td>227</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">void UtilsUI_print(struct UtilsText *pUtilsText) </pre></td>
		<td colspan="3"> A moderately useful helper function.
 
<br></td>
	</tr>
	<tr>
		<td>228</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">char *UtilsUI_toUpper(char *sString) </pre></td>
		<td colspan="3"> Converts a string to uppercase.
 
<br></td>
	</tr>
	<tr>
		<td>229</td>
		<td colspan="3"><pre style="background: 0; white-space: pre-wrap;">char *UtilsUI_createBuffer() </pre></td>
		<td colspan="3"> Creates a default sized string buffer.
 
<br></td>
	</tr>
</table>

---
## 5 Previews and Test Cases

### 5.1 Default Mode Preview and Test Cases

Test cases will only be provided for the default mode of the game for the sake of brevity. They will be formatted as a sequence of keystrokes with comments beside them.

#### 5.1.1 Default Mode Main Menu

Unlike the full mode depicted later on, the default mode only offers a rudimentary UI with no ASCII graphics. The text divisions are also fairly constant, and key input interactions are much more concise. The main menu below represents the template for all the other scenes in default mode.

<div style="text-align: center; overflow-x: hidden;">
<pre style="display: inline-block margin-left: -100%; margin-right: -100%; text-align: left;">




                                ###############################################################
                                ###  Day:    1 (0 Starved)  #  Energy:   30  #  Gold:   50  ###
                                ###############################################################



                                                     This is Harvest Sun.

                                                   Select a place to go to.


                                -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

                                                           [H] Home
                                                           [F] Farm
                                                           [S] Shop
                                                           [Q] Quit





                                ###############################################################
                                ###############################################################





                                                                                                         [ Mo David @2023 ]


</pre>
</div>

#### 5.1.2 Test Case 1 - Planting Nothing

Test Case 1 involves the player repeatedly going home until they starve to death.

```
#
# Sequence of keystrokes
#

(01) > H				# Makes the player go home
(02) > Enter			# Returns to menu to choose next option
(03) > H				# Makes the player go home
(04) > Enter			# Returns to menu to choose next option
(05) > H				# Makes the player go home
(06) > Enter			# Returns to menu to choose next option
(07) > H				# Makes the player go home
(08) > Enter			# Returns to menu to choose next option
(09) > H				# Makes the player go home
(10) > Enter			# Returns to menu to choose next option

#
# At this point in time, the player has run out of gold and starts to starve
#

(11) > H				# Makes the player go home
(12) > Enter			# Returns to menu to choose next option
(13) > H				# Makes the player go home
(14) > Enter			# Returns to menu to choose next option
(15) > H				# Makes the player go home
(16) > Enter			# Returns to menu to choose next option

#
# This is when the player dies (at the end of the third day)
#

(17) > H				# Makes the player go home
(18) > Enter			# Exits the progam
```

#### 5.1.2 Test Case 2 - Going Bananas

Test Case 2 involves the player planting 10 banana plants.

```
#
# Sequence of keystrokes
#

(01) > S				# Go to the shop
(02) > B				# Select the buying action
(03) > B				# Select the banana crop
(04) > 10				# Enter 10 bananas to buy
(05) > Enter			# Enact the transaction
(06) > Enter			# Return to shop
(07) > G				# Go back to menu

#
# First day of farming
#

(08) > F				# Go to farm
(09) > T				# Till some plots
(10) > 10				# 10 plots to till
(11) > Enter			# Finalize action 
(12) > Enter			# Return to farm
(13) > S				# Sow some seeds
(14) > B				# Choose banana crop for sowing
(15) > 10				# 10 banana seeds to sow
(16) > Enter			# Finalize action
(17) > Enter 			# Return to farm
(18) > W				# Water the new crops
(19) > B				# Water the banana crops
(20) > Enter			# Return to farm

#
# The player has just run out of energy and must go home
#

(21) > Enter			# Return to menu
(22) > H				# Go home and regenerate energy
(23) > Enter			# Return to menu

#
# Second day of farming
#

(24) > F				# Go to farm
(25) > W				# Water yesterday's crops
(26) > B				# Water the banana crops
(27) > Enter			# Go back to farm
(28) > G				# Go back to menu
(29) > H				# Do nothing else and go home
(30) > Enter			# Go back to menu

#
# Third day of farming
#

(31) > F				# Go to farm
(32) > W				# Water yesterday's crops
(33) > B				# Water the banana crops
(34) > Enter			# Go back to farm
(35) > G				# Go back to menu
(36) > H				# Do nothing else and go home
(37) > Enter			# Go back to menu

#
# Fourth day of farming and first harvest
#

(38) > F				# Go to farm
(39) > W				# Water yesterday's crops
(40) > B				# Water the banana crops
(41) > Enter			# Go back to farm, ready to harvest bananas
(42) > H				# Harvest fully grown crops
(43) > B				# harvest the banana crops
(44) > Enter			# Go back to farm
(45) > G				# Go back to menu

#
# Sell the bananas and buy 10 again
#

(46) > S				# Go to shop
(47) > S				# Sell harvested crops
(48) > B				# Sell the banana crops
(49) > 10				# Sell all the bananas
(50) > Enter			# Enact transaction
(51) > Enter			# Go back to shop
(52) > B				# Select the buying action
(53) > B				# Select the banana crop
(54) > 10				# Enter 10 bananas to buy
(55) > Enter			# Enact the transaction
(56) > Enter			# Return to shop
(57) > G				# Go back to menu
(58) > H				# Go home
(59) > Enter			# Return to menu

#
# Player got to eat again; we try to farm for a second harvest
#

(60) > F				# Go to farm
(61) > T				# Till some plots
(62) > 10				# 10 plots to till
(63) > Enter			# Finalize action 
(64) > Enter			# Return to farm
(65) > S				# Sow some seeds
(66) > B				# Choose banana crop for sowing
(67) > 10				# 10 banana seeds to sow
(68) > Enter			# Finalize action
(69) > Enter 			# Return to farm
(70) > W				# Water the new crops
(71) > B				# Water the banana crops
(72) > Enter			# Return to farm
(73) > Enter			# Return to menu
(74) > H				# Go home and regenerate energy
(75) > Enter			# Return to menu

#
# Second day of farming, part 2
#

(76) > F				# Go to farm
(77) > W				# Water yesterday's crops
(78) > B				# Water the banana crops
(79) > Enter			# Go back to farm
(80) > G				# Go back to menu
(81) > H				# Do nothing else and go home
(82) > Enter			# Go back to menu

#
# Third day of farming, part 2
#

(83) > F				# Go to farm
(84) > W				# Water yesterday's crops
(85) > B				# Water the banana crops
(86) > Enter			# Go back to farm
(87) > G				# Go back to menu
(88) > H				# Do nothing else and go home
(89) > Enter			# Go back to menu

#
# Fourth day of farming and second harvest, but player is already starving for three days
#

(90) > F				# Go to farm
(91) > W				# Water yesterday's crops
(92) > B				# Water the banana crops
(93) > Enter			# Go back to farm, ready to harvest bananas
(94) > H				# Harvest fully grown crops
(95) > B				# harvest the banana crops
(96) > Enter			# Go back to farm
(97) > G				# Go back to menu

#
# Sell the bananas
#

(98) > S				# Go to shop
(99) > S				# Sell harvested crops
(100) > B				# Sell the banana crops
(101) > 10				# Sell all the bananas
(102) > Enter			# Enact transaction
(103) > Enter			# Go back to shop
(104) > G				# Go back to menu

#
# Unfortunately, if the player tries to go home to eat breakfast the next day, 
# they die first
#

(105) > H				# Go home
(106) > Enter			# Exit the program

```

### 5.2 Full Mode Preview

Due to the high amount of functionality provided, only previews will be provided to help describe the workings of the full mode of the game.

#### 5.2.2 Full Mode Main Menu

This is the opening scene of full mode.

<div style="text-align: center; overflow-x: hidden;">
<pre style="display: inline-block margin-left: -100%; margin-right: -100%; text-align: left;">


                                                        ,     :     ,
                                                   '.    ;    :    ;    ,`
                                               '-.   '.   ;   :   ;   ,`   ,-`
                                            "-.   '-.  '.  ;  :  ;  ,`  ,-`   ,-"
                                               "-.   '-. '. ; : ; ,` ,-`   ,-"
                                          '"--.   '"-.  '-.'  '  `.-`  ,-"`   ,--"`
                                __             '"--.  '"-.   ...    _"`  ,--"`
                               |  |--.---.-.----.--.--.-----.::::-.|  |_     .-----.--.--.-----.
                               |     |  _  |   _|  |  |  -__|__ --||   _|    |__ --|  |  |     |
                               |__|__|___._|__|  \___/|_____|_____||____|    |_____|_____|__|__|



                                                    -=> [x]  begin
                                                        [ ]  how to
                                                        [ ]  keys
                                                        [ ]  author
                                                        [ ]  quit



                                 .=-=.=-=.=-=.=-=.=-=.=-=.=-=.=-=.=-=.=-=.=-=.=-=.=-=.=-=.=-=.


                                                  [Enter] to choose an option
                                                [X] and [C] to change selection




                                                                                                         [ Mo David @2023 ]
</pre>
</div>

#### 5.2.2 Full Mode Controls

Game controls show up when hitting the `H` key.

<div style="text-align: center; overflow-x: hidden;">
<pre style="display: inline-block margin-left: -100%; margin-right: -100%; text-align: left;">


                                                .___.       .___.
                                                | Q | .___. | E |
                                                |___| | W | |___|
                                                  .___|___|___.       .___.___.
                                                  | A | S | D |       | Enter |
                                                  |___|___|___|       |___ ___|
                                                        .___ ___.
                                                        | X | C |
                                                        |___|___|

                           [Q]                   -=>     Quit the current scene.
                           [E]                   -=>     Select an object to be modified.
                           [W], [A], [S], [D]    -=>     Used for selecting items in a grid layout.
                           [X], [C]              -=>     Toggle options present in a selection.
                           [Enter]               -=>     Finalize an action / select an option.


                                 .=-=.=-=.=-=.=-=.=-=.=-=.=-=.=-=.=-=.=-=.=-=.=-=.=-=.=-=.=-=.


                                                   [Q] to return to the game


</div>
</pre>

#### 5.2.3 Full Mode Inventory Inspector

Inventory preview comes up when hitting the `I` key.

<div style="text-align: center; overflow-x: hidden;">
<pre style="display: inline-block margin-left: -100%; margin-right: -100%; text-align: left;">



                                                          __________
                                                         /\____;;___\
                                                        | /         /
                                                         `. ())oo() .
                                                          |\(%()*^^()^\
                                                          | |---------|
                                                          \ |    ))   |
                                                           \|_________|



                                                           |       seed bags | harvested crops
                                =-=-=-=-=-=-=-=-=-=-=-=-=-=|=-=-=-=-=-=-=-=-=|=-=-=-=-=-=-=-=-=
                                  banana                   |         0 seeds |       0 to sell
                                  corn                     |         0 seeds |       0 to sell
                                  mango                    |         0 seeds |       0 to sell




                                 .=-=.=-=.=-=.=-=.=-=.=-=.=-=.=-=.=-=.=-=.=-=.=-=.=-=.=-=.=-=.


                                                   [Q] to return to the game

</pre>
</div>

#### 5.2.4 Farm Inspection

Navigating the farm plots is possible through the `WASD` keys. When performing an action on the farm, the `E` key can be used to select plots.

<div style="text-align: center; overflow-x: hidden;">
<pre style="display: inline-block margin-left: -100%; margin-right: -100%; text-align: left;">
_______________________________________________________________________________________________________________________________<br>:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=
----[ mo ]--[ Day:    1 ]--[ Days Starved:    0 ]--[ Energy:   30 ]--[ Gold:   50 ]--------------------------------------------




                                            You are currently inspecting the farm.

                                    v
                                 ._____._____._____._____._____._____._____._____._____._____.
                                 |`. .`|     |     |     |     |     |     |     |     |     |
                              >  | .'. |     |     |     |     |     |     |     |     |     |
                                 |`___`|____'|____'|____'|____'|____'|____'|____'|____'|____'|
                                 |     |     |     |     |     |     |     |     |     |     |
                                 |     |     |     |     |     |     |     |     |     |     |
                                 |____'|____'|____'|____'|____'|____'|____'|____'|____'|____'|
                                 |     |     |     |     |     |     |     |     |     |     |
                                 |     |     |     |     |     |     |     |     |     |     |
                                 |____'|____'|____'|____'|____'|____'|____'|____'|____'|____'|




                                                  [W], [A], [S], [D] to move.
                                         [Enter] to go back and do another farm thing.




_______________________________________________________________________________________________________________________________<br>'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-<br>&Tab;unselected  | This plot is currently (UNTILLED).<br>&Tab;   @(1, 1)  |

-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-{ [I] to view inventory; [H] to view controls; [Q] to exit to main menu. }-=-=
</pre>
</div>

#### 5.2.5 Game Paused

The user has the option to pause the game in full mode.

<div style="text-align: center; overflow-x: hidden;">
<pre style="display: inline-block margin-left: -100%; margin-right: -100%; text-align: left;">







                                                                                               __
                             .-----.---.-.--------.-----.    .-----.---.-.--.--.-----.-----.--|  |
                             |  _  |  _  |        |  -__|    |  _  |  _  |  |  |__ --|  -__|  _  |
                             |___  |___._|__|__|__|_____|    |   __|___._|_____|_____|_____|_____|
                             |_____|                         |__|


                                        Are you sure you want to exit to the main menu?

                                                       -=> [x]  Okay
                                                           [ ]   No




</pre>
</div>

#### 5.2.6 Game Over

Unlike in the default mode, losing the game doesn't automatically exit the program.

<div style="text-align: center; overflow-x: hidden;">
<pre style="display: inline-block margin-left: -100%; margin-right: -100%; text-align: left;">








                                   .-----.---.-.--------.-----.    .-----.--.--.-----.----.
                                   |  _  |  _  |        |  -__|    |  _  |  |  |  -__|   _|
                                   |___  |___._|__|__|__|_____|    |_____|\___/|_____|__|
                                   |_____|


                                            You starved for three consecutive days!

                                                 [Enter] to return to the menu








</pre>
</div>

### 5.3 Debug Mode Preview

#### 5.3.1 Farm Debugging

The farm in debug mode features a bunch of pre-initialized plots with crops in different growth stages.

<div style="text-align: center; overflow-x: hidden;">
<pre style="display: inline-block margin-left: -100%; margin-right: -100%; text-align: left;">

_______________________________________________________________________________________________________________________________<br>:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=
----[ DEBUG MODE ]--[ Day:    1 ]--[ Days Starved:    0 ]--[ Energy:   30 ]--[ Gold:   50 ]------------------------------------




                                            You are currently inspecting the farm.

                                                v
                                 ._____._____._____._____._____._____._____._____._____._____.
                                 |     |'    |`. .`|     |'    |M , !|     |'    |M # $|     |
                              >  |     | ^^^ | .M. |     | ^^^ | _|_ |     | ^^^ | _|_ |     |
                                 |____'|____'|`___`|____'|____'|____M|____'|____'|____M|____'|
                                 |'    |M   !|     |'    |M # $|     |'    |M   !|     |'    |
                                 | ^^^ | _._ |     | ^^^ | _|_ |     | ^^^ | _._ |     | ^^^ |
                                 |____'|____M|____'|____'|____M|____'|____'|____M|____'|____'|
                                 |M # $|     |'    |M , !|     |'    |M # $|     |'    |M , !|
                                 | _|_ |     | ^^^ | _|_ |     | ^^^ | _|_ |     | ^^^ | _|_ |
                                 |____M|____'|____'|____M|____'|____'|____M|____'|____'|____M|




                                                  [W], [A], [S], [D] to move.
                                         [Enter] to go back and do another farm thing.





_______________________________________________________________________________________________________________________________<br>'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-<br>&Tab;unselected  | This plot is currently (SOWN) with a (MANGO) seed and was already watered today.<br>&Tab;   @(3, 1)  | The crop has been fully watered and is now harvestable.

-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-{ [I] to view inventory; [H] to view controls; [Q] to exit to main menu. }-=-=
</pre>
</div>

#### 5.3.2 Player Debugging

Debug mode also automatically names the player `DEBUG MODE` to help keep track of the fact that the user is debugging. Aside from this, the player's inventory and other stats are initialized to different values.

<div style="text-align: center; overflow-x: hidden;">
<pre style="display: inline-block margin-left: -100%; margin-right: -100%; text-align: left;">
_______________________________________________________________________________________________________________________________<br>:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=
----[ DEBUG MODE ]--[ Day:    1 ]--[ Days Starved:    0 ]--[ Energy:   30 ]--[ Gold:   50 ]------------------------------------



                                                     It's a brand new day.

                                                          .=gp.
                                                       .'/$$$$
                                                       || "TP"
                                                       ||          .:
                                                       ||       .-' |
                                                       ||    .-'    |
                                                       ||    |      !____
                                                       ||    |   .-'  .-'
                                                       ||    '.____.-'(
                                                       ||     \  /  /__\
                                                       ||      )(
                                                      |::|    /__\
                                                      |::|


                                                   Where do you want to go?

                                                   -=> [x]  go to home
                                                       [ ]  go to farm
                                                       [ ]  visit shop



_______________________________________________________________________________________________________________________________<br>'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-'-<br>&Tab;go to home  | Sleep and restore your energy to its default amount. Eat breakfast for (10) gold.<br>&Tab;| If you do not have enough gold to buy breakfast, you will starve the next day.

-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-{ [I] to view inventory; [H] to view controls; [Q] to exit to main menu. }-=-=

</pre>
</div>

### 5.4 Disabling Strict Death Mode

There is an option located within the `game.player.obj.h` file that allows you to toggle the strict death mode. With strict death mode, the player dies at the end of the third day of starving, regardless of whether or not they have enough gold to eat breakfast the next day; on the other hand, disabling this option allows the player to save themselves at the start of the fourth day (if they have the gold to buy breakfast). The option is disabled by default as per the specifications demanded by the project.

To disable the option, simply change the value of `PLAYER_STRICT_DEATH_MODE` to 0 in the aforementioned file.

```
#define PLAYER_STRICT_DEATH_MODE 0
```

With strict death mode disabled, a sustainable sequence of actions is possible which lets the player survive indefinitely.

> **NOTE:** From a game design perspective, it makes sense that the player cannot sustain themselves indefinitely with strict death mode enabled since the crop with the least number of watering times (the banana with 4) will need to grow over the course of 4 days, whereas the player starves over the course of 3.

---
## 6 About the Author


<div style="text-align: center; overflow-x: hidden;">
<pre style="display: inline-block margin-left: -100%; margin-right: -100%; text-align: left;">




                                                        |\      _,,,---,,_
                                                 ZZZzz /,`.-'`'    -.  ;-;;,_
                                                      |,4-  ) )-,_. ,\ (  `'-'
                                                     '---''(_/--'  `-'\_)

</pre>
</div>

To restate the author page included in the full mode of the game:

> **QUOTE:** Mo David is a code enthusiast who loves cats and dabbles in occasional music-making. He also writes poetry on the side amidst a chronic addiction to math. Nevertheless, despite the prevailing stereotypes on tryhard programmers, Mo apparently does not (usually) engage in the consumption of caffeinated beverages.


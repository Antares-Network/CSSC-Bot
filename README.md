[![DeepSource](https://deepsource.io/gh/Antares-Network/CSSC-Bot.svg/?label=active+issues&show_trend=true&token=GgdxIdd6daxTyyfTYz5OUiUl)](https://deepsource.io/gh/Antares-Network/CSSC-Bot/?ref=repository-badge)
# CS Smart Club Bot

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Setting up the bot](#setting-up-the-bot)
3. [Project structure](#project-structure)
4. [Features](#features)
5. [Running the bot](#running-the-bot)
6. [Resources](#resources)

## Prerequisites

- A working docker installation, learn more at [Docker](https://docs.docker.com/get-docker/)  
OR
- A working Node JS installation, learn more at [Node JS](https://nodejs.org/en/download/). Minimum version 6.13.0.

**You will need a server to test the bot on. Create your own 'private' Discord server.**

## Setting up the bot

After you have the project and a server, go to the [Discord Developer Portal](https://discord.com/developers/applications). If you are prompted to log in, use the same credentials that you use for your Discord account.

Once that's done, create a new application **(Applications > New Application)**.

![Step #1](/demo/1.jpg)

Name your application any way you like, and click **Create**.

![Step #2](/demo/2.jpg)

This should take you to the 'General Information' page of your new application. In the left menu, select **Bot**.

![Step #3](/demo/3.jpg)

Choose **Add Bot**.

![Step #4](/demo/4.jpg)

![Step #5](/demo/5.jpg)

On your new bots page, select **Reset Token**. Once the new token appears, copy the token. It will only be shown to you once.

![Step #6](/demo/6.jpg)

In the project folder, create a file called **.env**.
Fill it out using the template in **.env.template**.

**Why you should keep your bot token a secret**:
A bot token is used to attach a script to your bot. If someone has your bot token, they can control your bot with any script they attach to it. If you want your own remote branch in this project, **please do not commit changes to this file.**

After that is done, generate a URL for your bot. Select **OAuth2** from the left menu, and click **URL Generator**. Choose the **bot** checkbox, and select the **Administrator** checkbox in the section that appears. Copy the URL at the bottom of the page.

![Step #7](/demo/7.jpg)

Follow this link in a browser, and choose the private server you created to add your bot to.

## Running the bot

### Run from source

```bash
git clone https://github.com/Antares-Network/CSSC-Bot.git
# Fill out the .env file using the template in .env.template
npm install
npm install -g typescript ts-node
ts-node index.ts
```

### Run from Docker

```bash
git clone https://github.com/Antares-Network/CSSC-Bot.git
# Fill out the .env file using the template in .env.template;
# Or add the environment variables to your docker run command by adding the 
# --env-file .env option 
docker build -t cssc-bot .
docker run -d cssc-bot
```

The bot should become responsive. You can check for errors in the console.

## Project Structure

- `/commands/owner` - Commands that can only be used by the owner of the bot
- `/commands/user` - Commands that can be used by anyone
- `/features` - Features are modules that contain code that runs on a schedule or when triggered by an event emitted by the discord client.
- `/definitions.ts` - Contains the definitions for the roles and their ids that get loaded by the client.
- `/rolesOps.ts` - Contains the functions that are used to add and remove roles from users, as well as to check if a user has a role.
- `/index.ts` - The entry point of the application. This is where the discord client is created and the commands and features are loaded as well as where some logic is performed on the client's events.
- `Dockerfile` - The dockerfile contains values used to build the docker image.

## Features

### User Commands

- `/help` - Shows this help embed
- `/github` - Shows the official GitHub repository for this bot.
- `/view` - Shows a list of all roles that I have assigned to you
- `/clear` - Removes all roles that I have assigned to you
- `/uptime` - Shows how long I have been online
- `/status` - Shows the status of the bot

### Admin Commands

- `/createRoles` - Creates the roles that will be used in the server and in polls
- `/staffpoll` - Creates a poll for staff role choosing
- `/yearpoll` - Creates a poll for year role choosing

### Polls

- `College Student Roles` - Assigns the correct role for your year in school.
- `College Employee Roles` - Assigns the correct role for your job title.

## Resources

- [Discord.js Docs](https://discord.js.org/#/docs)
- [Discord.js Guide](https://discordjs.guide/)
- [WOKcommands Docs](https://docs.wornoffkeys.com/)
- [AntaresBot Codebase](https://playantares.com/antaresbot)
- [Antares Status Tracking](https://status.playantares.com/)

## Credits

- [Lisa Isaeva](https://github.com/llisaeva)
- [Nate Goldsborough](https://github.com/nathen418)
- [John Schiltz](https://github.com/schiltz3)

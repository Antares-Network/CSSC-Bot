# CS Smart Club Bot

## Table of Contents

1. [WARNING](#warning)
2. [Prerequisites](#prerequisites)
3. [Setting up the bot](#setting-up-the-bot)
4. [Project structure](#project-structure)
5. [Features](#features)
6. [Resources](#resources)

## warning

This branch is **NOT** ready for production use. Do not use it. No support is provided at this time.

## Prerequisites

TBD - This branch is a complete rewrite of the existing codebase so no prerequisites are provided yet.

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
a bot token is used to attach a script to your bot. If someone has your bot token, they can control your bot with any script they attach to it. If you want your own remote branch in this project, **please do not commit changes to this file.**

After that is done, generate a URL for your bot. Select **OAuth2** from the left menu, and click **URL Generator**. Choose the **bot** checkbox, and select the **Administrator** checkbox in the section that appears. Copy the URL at the bottom of the page.

![Step #7](/demo/7.jpg)

Follow this link in a browser, and choose the private server you created to add your bot to. Go to the project folder, and run

```bash
npm install
npm install -g typescript ts-node
ts-node index.ts
```

Alternately a Docker image will be provided soon for more reliable operation.

The bot should become responsive. You can check for errors in the console.


## Project Structure

TBD - This branch is a complete rewrite of the existing codebase so no structure is provided yet.

## Features

TBD - This branch is a complete rewrite of the existing codebase so no feature explanations are provided yet.

## Resources

 - [Discord.js Docs](https://discord.js.org/#/docs)
 - [WOKcommands Docs](https://docs.wornoffkeys.com/)
 - [AntaresBot Codebase](https://playantares.com/antaresbot)
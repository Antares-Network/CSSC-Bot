# Discord bot info

## Table of Contents

1. [Setting up the bot](#setting-up-the-bot)
2. Project structure

### Setting up the bot

Python 3.8.10 or later is required to run this bot. To check your python version, open a terminal and run:
```bash
$ python --version
```
You can also try:
```bash
$ python2 --version
```
and 
```bash
$ python3 --version
```
Out of those three, use the interpreter of a version that is equal or higher than the one mentioned above. If you do not have the correct version, [you can download it here.](https://www.python.org/downloads/release/python-3105/)

Next, clone the project to a folder on your machine:
```bash
git clone https://github.com/llisaeva/Rolebot.git
```
If you don't have git, you can either download the project as a zip file **(Code > Download ZIP)**, or [download git](https://git-scm.com/downloads).

You will need a server to test the bot on. Create your own 'private' Discord server.

After you have the project and a server, go to the [Discord Developer Portal](https://discord.com/developers/applications). If you are prompted to log in, use the same credentials that you use for your Discord account. 

Once that's done, create a new application **(Applications > New Application)**.

![Step #1](/demo/1.jpg)

Name your application in any way that you like, and click **Create**.

![Step #2](/demo/2.jpg)

This should take you to the 'General Information' page of your new application. In the left menu, select **Bot**.

![Step #3](/demo/3.jpg)

Choose **Add Bot**.

![Step #4](/demo/4.jpg)

![Step #5](/demo/5.jpg)

On your new bots page, select **Reset Token**. Once the new token appears, copy the token. It will only be shown to you once.

![Step #6](/demo/6.jpg)

In the project folder, open the **tkn.py** file. Paste the token between the quotes next to the TOKEN variable.

```python
TOKEN="<paste your token here>"
```

**Why you should keep your bot token a secret**:
a bot token is used to attach a script to your bot. If someone has your bot token, they can control your bot with any script they attach to it. If you want your own remote branch in this project, **please do not commit changes to this file.**

The **MAKER** variable in **tkn.py** is used to assosiate the bot with an author (your ID). This file contains the ID of the author, you can change it to your own.

After that is done, generate a URL for your bot. Select **OAuth2** from the left menu, and click **URL Generator**. Choose the **bot** checkbox, and select the **Administrator** checkbox in the box that appears. Copy the URL at the bottom of the pate.

![Step #7](/demo/7.jpg)

Follow this link in a browser, and choose the private server you created to add your bot to. Go to the project folder, and run

```py
python rolebot.py
```

The bot should become responsive. If there are errors, they will be found in **logs/bot.txt**.

## Project Structure

All python files are located in the **modules** folder, the only exception is **rolebot.py** - it is the interface of the bot.

**modules/logger.py** - code for logging errors for this project. There are 2 log files: **logs/bot.txt** and **logs/discord.txt**. bot.txt is used for errors caused by the bot, and discord.txt is used for errors that are sent from your Discord server.

**modules/persistance.py** - used for creating json files that need to be persisted. Currently, it keeps track of the IDs of the messages that the bot creates. This makes those messages accessable by the bot after it reboots. The message ID json file is stored at **json/msg_ids.json**.

**modules/role_poll.py** - module for the role reaction polls. There are two, one for selecting a college year, and another for choosing an occupation at UWM. 

The role reaction poll options are represented by objects that extend `ReactionPoll`. The existing classes that extend it are `CollegeYearPoll` and `CollegeStaffPoll`.


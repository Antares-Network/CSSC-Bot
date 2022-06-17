# Discord bot info

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Setting up the bot](#setting-up-the-bot)
3. Project structure

## Prerequisites

**Python 3.8.10 or later is required to run this bot.** To check your python version, open a terminal and run:
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

**Once that's done, [download Discord.py here](https://discordpy.readthedocs.io/en/stable/intro.html).**

Next, clone the project to a folder on your machine:
```bash
git clone https://github.com/llisaeva/Rolebot.git
```
If you don't have git, you can either download the project as a zip file **(Code > Download ZIP)**, or [download git](https://git-scm.com/downloads).

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

In the project folder, open the **tkn.py** file. Paste the token between the quotes next to the TOKEN variable.

```python
TOKEN="<paste your token here>"
```

**Why you should keep your bot token a secret**:
a bot token is used to attach a script to your bot. If someone has your bot token, they can control your bot with any script they attach to it. If you want your own remote branch in this project, **please do not commit changes to this file.**

The **MAKER** variable in **tkn.py** is used to associate the bot with an author (your ID). This file contains the ID of the author, you can change it to your own.

After that is done, generate a URL for your bot. Select **OAuth2** from the left menu, and click **URL Generator**. Choose the **bot** checkbox, and select the **Administrator** checkbox in the box that appears. Copy the URL at the bottom of the page.

![Step #7](/demo/7.jpg)

Follow this link in a browser, and choose the private server you created to add your bot to. Go to the project folder, and run

```py
python rolebot.py
```

The bot should become responsive. If there are errors, they can be found in **logs/bot.txt**.


## Project Structure

All python files are located in the **modules** folder, the only exception is **rolebot.py** - it is the interface of the bot.

**modules/logger.py** - code for logging errors for this project. There are 2 log files: **logs/bot.txt** and **logs/discord.txt**. bot.txt is used for errors caused by the bot, and discord.txt is used for errors that are sent from your Discord server.

**modules/persistance.py** - used for creating json files that need to be persisted. Currently, it keeps track of the IDs of the messages that the bot creates. This makes those messages accessable by the bot after it reboots. The message ID json file is stored at **json/msg_ids.json**.

**modules/role_poll.py** - module for the role reaction polls. There are two, one for selecting a college year, and another for choosing an occupation at UWM. The role reaction poll options are represented by objects that extend `ReactionPoll`. The existing classes that extend it are `CollegeYearPoll` and `CollegeStaffPoll`. You can add a new reaction poll by creating a key, extending the ReactionPoll class, and editing the `polls` variable, like so:

```python

MY_NEW_POLL_KEY = "new_poll_key"

class MyNewPoll(ReactionPoll):
    pass

polls = {

    ...,

    MY_NEW_POLL_KEY: 
        {   
            TITLE: "New Poll",
            DESCRIPTION: "This is your new polls description:",
            OPTIONS:
                [
                    MyNewPoll("#1", 0xfff, "🙂", "yay"),
                    MyNewPoll("#2", 0xaaa, "😐", "meh"),
                    MyNewPoll("#3", 0x000, "🙁", "boo"),
                ]
        }
}

```

This will assign the roles `#1`, `#2` or `#3` to the user that selects the corresponding reaction. Their colors will be `0xfff`, `0xaaa` and `0x000`. If those roles do not exist on the server, they will be created. The last parameter is needs to be unique among all polls, it is used to assign a role to a user with a command.

The base `ReactionPoll` class has one function `assign()` that can be overriden. It assigns the role that it represents to the argument **member** from the argument **server** (Guild)

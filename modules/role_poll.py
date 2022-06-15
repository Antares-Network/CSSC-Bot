import discord
from discord import Embed, Guild, Member
from discord.ext.commands import Context
import modules.logger as logger
import modules.utils as utils

# 'Constants' ==============================================

# key of the College Year poll IDs
COLLEGE_YEAR_POLL_KEY = "college_year_poll"
COLLEGE_STAFF_POLL_KEY = "college_staff_poll"

TITLE = "title"
DESCRIPTION = "description"
OPTIONS = "options"

# Classes ==================================================

# role reaction poll 'interface'
class ReactionPoll:
    def __init__(self, name: str, color: int, emoji: str, cmd: str):
        self.name : str = name
        self.color : int = color
        self.emoji : str = emoji
        self.cmd : str = cmd

    async def assign(self, guild: Guild, author: Member):
        role = await utils.getRole(guild, self.name, self.color)
        if role and not role in author.roles:
            await author.add_roles(role)

class CollegeYearPoll(ReactionPoll):
    async def assign(self, guild: Guild, author: Member):
        role = await utils.getRole(guild, self.name, self.color)
        if role:
            await clearRoles(COLLEGE_YEAR_POLL_KEY, author)
            await author.add_roles(role)

class CollegeStaffPoll(ReactionPoll):
    pass

# Reaction poll content ====================================

polls = {
    # College Year Poll content ----------------------------
    COLLEGE_YEAR_POLL_KEY: 
        {
            TITLE: "College Year",
            DESCRIPTION: "React with your current college year:",
            OPTIONS: 
            [
                CollegeYearPoll("Prefrosh", 0x3498db, "0️⃣", "prefrosh"),
                CollegeYearPoll("Freshman", 0x2ecc71, "1️⃣", "freshman"),
                CollegeYearPoll("Sophomore", 0xe67e22, "2️⃣", "sophomore"),
                CollegeYearPoll("Junior", 0x9b59b6, "3️⃣", "junior"),
                CollegeYearPoll("Senior", 0xe74c3c, "4️⃣", "senior"),
                CollegeYearPoll("Grad Student", 0x4fe8f5, "5️⃣", "gradstudent"),
                CollegeYearPoll("Alumni", 0xe9e740, "6️⃣", "alumni")
            ],
        },

    # College Staff Poll content ---------------------------
    COLLEGE_STAFF_POLL_KEY: 
        {   
            TITLE: "College Staff Member",
            DESCRIPTION: "React with your occupation at UWM:",
            OPTIONS:
                [
                    CollegeStaffPoll("Tutor", 0xcaad66, "🐶", "tutor"),
                    CollegeStaffPoll("SI Leader", 0xcaad66, "🐱", "sileader"),
                    CollegeStaffPoll("TA", 0xcaad66, "🦊", "ta"),
                    CollegeStaffPoll("Professor", 0xcaad66, "🐻", "professor")
                ]
        }
}

# Utilities ================================================

# A map where two keys map to one value --------------------
# Keys map to OPTIONS in the polls object
# An option can be found either by its command, or by its ID
# and emoji
roleMap = {}

# creating the roleMap -------------------------------------
def makeRoleMap():
    for key in polls:
        for item in polls[key][OPTIONS]:
            roleMap[(key, item.emoji)] = item
            roleMap[item.cmd] = item

makeRoleMap()

# Module functions =========================================

# posts a reaction role poll, based on its ID --------------
async def post(ctx: Context, key):
    content = f"*{polls[key][DESCRIPTION]}*\n\n"
    for item in polls[key][OPTIONS]:
        content += f"{item.emoji} - **{item.name}**\n"

    embed = discord.Embed(title=polls[key][TITLE], description=content)
    if embed == Embed.Empty:
        logger.log.warn("In college_year.post() the created embed was empty")
    else:
        msg = await ctx.send(embed=embed)

        for item in polls[key][OPTIONS]:
            await msg.add_reaction(item.emoji)
        return msg
    return None

# assign a role to <author> in <guild> based ---------------
# on command <cmd>
async def cmd(cmd, guild, author):
    if cmd in roleMap:
        await roleMap[cmd].assign(guild, author)

# assign a role to <author> in <guild> based ---------------
# on the reaction poll <key> and option <emoji>
async def reaction(key, emoji, guild, author):
    if (key, emoji) in roleMap:
        await roleMap[(key, emoji)].assign(guild, author)

# clear roles that are in the poll with <key> from <author> 
async def clearRoles(key, author: Member):
    rolesToClear = [option.name for option in polls[key][OPTIONS]]
    for role in author.roles:
        if role.name in rolesToClear:
            await author.remove_roles(role)

# clear all roles from all polls in the polls --------------
# object from <author>
async def clearAllRoles(author: Member):
    rolesToClear = []
    for key in polls:
        rolesToClear += [option.name for option in polls[key][OPTIONS]]
    for role in author.roles:
        if role.name in rolesToClear:
            await author.remove_roles(role)
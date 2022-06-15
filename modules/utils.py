import discord
from discord import Guild
from discord.utils import get

# Checks if the server has the specified role --------------
# and returns it, creates the role if it does
# not exist
async def getRole(guild: Guild, roleName: str, roleColor: int):
    role = get(guild.roles, name=roleName)
    if not role:
        role = await guild.create_role(name=roleName, colour=discord.Colour(roleColor))
    return role
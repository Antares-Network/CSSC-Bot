import { GuildMember } from "discord.js";
import { ICommand } from "wokcommands";
import { returnRoles as roleDictionary } from "../../definitions";


export default {
  name: "clear",
  category: "user",
  description: "removes all roles the bot has assigned to a user",
  slash: true,
  testOnly: false,
  guildOnly: true,
  requiredPermissions: ["SEND_MESSAGES"],

  callback: async ({ interaction }) => {

    // Remove roles from user
    if (!interaction.member) return;
    const member = interaction.member as GuildMember;
    for (const role of Object.values(roleDictionary())) {
        if (member.roles.cache.has(role)) {
            await member.roles.remove(role);
        }
    }

    // Reply to the user
    interaction.reply({content: "Cleared all roles that I have assigned to you.", ephemeral: true});

  },
} as ICommand;
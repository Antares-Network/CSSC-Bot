import { GuildMember } from "discord.js";
import { ICommand } from "wokcommands";
import { returnRoles as roleDictionary } from "../../definitions";


export default {
  name: "view",
  category: "user",
  description: "Shows a list of all roles that I have assigned to you",
  slash: true,
  testOnly: false,
  guildOnly: true,
  requiredPermissions: ["SEND_MESSAGES"],

  callback: async ({ interaction }) => {

    // Remove roles from user
    if (!interaction.member) return;
    let list = "";
    const member = interaction.member as GuildMember;
    for (const role of Object.values(roleDictionary())) {
        if (member.roles.cache.has(role)) {
            list += `${member.guild.roles.cache.get(role)?.name}\n`;
        }
    }
    

    // Reply to the user
    if (list === "") {
        interaction.reply({content: "You don't have any College roles assigned to you.", ephemeral: true});
    } else {
    interaction.reply({content: "**Your roles:**\n" + list, ephemeral: true});
    }

  },
} as ICommand;
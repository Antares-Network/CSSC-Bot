import { Client, MessageEmbed, GuildMember } from "discord.js";
import { yearModel } from "../models/yearModel";
import { removeRole, addNewRole } from "../utils/roles";
import { staffModel } from "../models/staffModel";
import { classModel } from "../models/classModel";

// Listen interactionCreate events from the client
export default (client: Client): void => {
  client.on("interactionCreate", async (interaction) => {
    // Make sure the interaction is from a select menu
    if (!interaction.isSelectMenu()) return;
    const color = "#0099ff";
    const description = `You selected the ${interaction.values[0]} role.`;
    const footer = `Delivered in: ${client.ws.ping}ms | CSSC-bot | ${process.env.VERSION}`;
    const footerIcon = "https://antaresnetwork.com/resources/CSSC-bot/icon.jpg";
    // Constants for all interactions
    const member = interaction.member as GuildMember;

    // Get the select menu by it's custom ID
    if (interaction.customId === "collegeYearPoll") {
      // Set the embed values
      const title = "College Year Poll";

      // Create and send the embed object
      interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor(color)
            .setTitle(title)
            .setDescription(description)
            .setFooter({ text: footer, iconURL: footerIcon }),
        ],
        ephemeral: true,
      });
      // Remove any previous roles in the dictionary from the user
      await removeRole(member, yearModel);

      // No role to add
      if (interaction.values[0] === "None") {
        return;
      }

      // Assign the new role to the user
      await addNewRole(member, yearModel, interaction.values[0]);
    } else if (interaction.customId === "collegeStaffPoll") {
      // Set the embed title
      const title = "College Staff Poll";
      // Create and send the embed object
      interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor(color)
            .setTitle(title)
            .setDescription(description)
            .setFooter({ text: footer, iconURL: footerIcon }),
        ],
        ephemeral: true,
      });

      // Remove any previous roles in the dictionary from the user
      await removeRole(member, staffModel);

      // No role to add
      if (interaction.values[0] === "None") {
        return;
      }

      // Assign the new role to the user
      await addNewRole(member, staffModel, interaction.values[0]);
    } else if (interaction.customId.startsWith("csClassPoll+")) {
      // Assign the new role to the user
      await addNewRole(member, classModel, interaction.values[0]);
      // Set the embed title
      const title = "CS Class Poll";
      // Create and send the embed object
      interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor(color)
            .setTitle(title)
            .setDescription(description)
            .setFooter({ text: footer, iconURL: footerIcon }),
        ],
        ephemeral: true,
      });
    }
  });
};

export const config = {
  dbName: "INTERACTION_CREATE",
  displayName: "Interaction Create Event (ICE)",
};

import { Client, MessageEmbed, GuildMember } from "discord.js";
import { removePrevRole, addNewRole } from "../rolesOps";

// Listen interactionCreate events from the client
export default (client: Client): void => {
	client.on("interactionCreate", async (interaction) => {
		// Make sure the interaction is from a select menu
		if (!interaction.isSelectMenu()) return;

		// Constants for all interactions
		const member = interaction.member as GuildMember;

		// Get the select menu by it's custom ID
		if (interaction.customId === "collegeYearPoll") {
			// Set the embed values
			const title = "College Year Poll";
			const color = "#0099ff";
			const description = `You selected the ${interaction.values[0]} role.`;
			const footer = `Delivered in: ${client.ws.ping}ms | CSSC-bot | ${process.env.VERSION}`;
			const footerIcon = "https://playantares.com/resources/CSSC-bot/icon.jpg";

			// Create and send the embed object
			interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor(color)
                        .setTitle(title)
                        .setDescription(description)
                        .setFooter({text: footer, iconURL: footerIcon}),
                ],
                ephemeral: true
            });
			// Remove any previous roles in the dictionary from the user
			removePrevRole(member, 0);

			// Assign the new role to the user
			addNewRole(member, 1, interaction.values[0]);
		} else if (interaction.customId === "collegeStaffPoll") {
			// Set the embed values
			const title = "College Staff Poll";
			const color = "#0099ff";
			const description = `You selected the ${interaction.values[0]} role.`;
			const footer = `Delivered in: ${client.ws.ping}ms | CSSC-bot | ${process.env.VERSION}`;
			const footerIcon = "https://playantares.com/resources/CSSC-bot/icon.jpg";

			// Create and send the embed object
			interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor(color)
                        .setTitle(title)
                        .setDescription(description)
                        .setFooter({text: footer, iconURL: footerIcon}),
                ],
                ephemeral: true
            });
			// Remove any previous roles in the dictionary from the user
			removePrevRole(member, 1);

			// Assign the new role to the user
			addNewRole(member, 1, interaction.values[0]);
		}
	});
};

export const config = {
	dbName: "INTERACTION_CREATE",
	displayName: "Interaction Create Event (ICE)",
};

import { MessageEmbed, MessageActionRow, MessageSelectMenu } from "discord.js";
import { ICommand } from "wokcommands";

export default {
	name: "collegeYearPolldropdown",
	category: "owner",
	description: "Posts the College Year Poll",
	slash: true,
	testOnly: false,
	guildOnly: true,
	requiredPermissions: ["SEND_MESSAGES"],
	ownerOnly: true,

	callback: async ({ client, interaction: msgInt }) => {
		// Define embeds used in this command
		const infoEmbed = new MessageEmbed()
			.setTitle("Choose a role")
			.setColor("#0099ff")
			.setDescription("Select the button with your current college year.")
			.setFooter({
				text: `Delivered in: ${client.ws.ping}ms | CSSC-Bot | ${process.env.VERSION}`,
				iconURL: "https://playantares.com/resources/CSSC-bot/icon.jpg",
			});

		// Create row one of the buttons for the poll
		const row = new MessageActionRow().addComponents(
			new MessageSelectMenu()
      .setCustomId("collegeYearPoll")
      .setPlaceholder("Select the button with your current college year.")
      .addOptions(
				{
					label: "Prefrosh",
					value: "prefrosh",
				},
				{
					label: "Freshman",
					value: "freshman",
				},
				{
					label: "Sophomore",
					value: "sophomore",
				},
				{
					label: "Junior",
					value: "junior",
				},
				{
					label: "Senior",
					value: "senior",
				},
				{
					label: "Graduate Student",
					value: "graduatestudent",
				},
				{
					label: "Alumni",
					value: "alumni",
				}
			)
		);

		// Send the embed and message component rows
		msgInt.reply({ embeds: [infoEmbed], components: [row] });
	},
} as ICommand;

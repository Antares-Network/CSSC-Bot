import { MessageEmbed, MessageActionRow, MessageSelectMenu } from "discord.js";
import { ICommand } from "wokcommands";

export default {
	name: "collegeStaffPollDropdown",
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
			.setDescription("Select the option with your current occupation at UWM.")
			.setFooter({
				text: `Delivered in: ${client.ws.ping}ms | CSSC-Bot | ${process.env.VERSION}`,
				iconURL: "https://playantares.com/resources/CSSC-bot/icon.jpg",
			});

		// Create row one of the buttons for the poll
		const row = new MessageActionRow().addComponents(
			new MessageSelectMenu()
      .setCustomId("collegeStaffPoll")
      .setPlaceholder("Select an option")
      .addOptions(
				{
                    label: "Tutor",
                    value: "tutor",
                },
                {
                    label: "SI Leader",
                    value: "sileader",
                },
                {
                    label: "TA",
                    value: "ta",
                },
                {
                    label: "Professor",
                    value: "professor",
                },
                {
                    label: "Student Employee",
                    value: "studentemployee",
                }
			)
		);

		// Send the embed and message component rows
		msgInt.reply({ embeds: [infoEmbed], components: [row] });
	},
} as ICommand;

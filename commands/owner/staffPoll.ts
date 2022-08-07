import { MessageEmbed, MessageActionRow, MessageSelectMenu } from "discord.js";
import { ICommand } from "wokcommands";
import { checkForRoles } from "../../rolesOps";

export default {
	name: "staffPoll",
	category: "owner",
	description: "Posts the College Staff Poll",
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
                    value: "Tutor",
                },
                {
                    label: "SI Leader",
                    value: "Sileader",
                },
                {
                    label: "TA",
                    value: "Ta",
                },
                {
                    label: "Professor",
                    value: "Professor",
                },
                {
                    label: "Student Employee",
                    value: "Studentemployee",
                }
			)
		);

		// Send the embed and message component rows
		if (!checkForRoles(msgInt.guild!, 1)) {
			msgInt.reply("Please run the `/createRoles` command in this server to create the necessary roles for this poll!");
		} else {
			msgInt.reply({ embeds: [infoEmbed], components: [row] });
		}
	},
} as ICommand;

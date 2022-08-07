import { ICommand } from "wokcommands";
import { createRoles } from "../../rolesOps";
import chalk from "chalk";

export default {
	name: "createRoles",
	category: "owner",
	description: "Creates roles if they do not exist in the server",
	slash: true,
	testOnly: false,
	guildOnly: true,
	requiredPermissions: ["SEND_MESSAGES"],
    ownerOnly: true,

	callback: async ({ interaction }) => {
        console.log(chalk.green("Creating roles...\nCopy and paste the following output into your .env file"));
        console.log(chalk.red("------------------------------------------------------"))
        // Create the roles
        createRoles(interaction.guild!, 0)
        createRoles(interaction.guild!, 1)
        interaction.reply("Roles created! Check the console for the role IDs\nPaste the output into your .env file and restart the bot\n ");
    },
} as ICommand;
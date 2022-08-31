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
	requiredPermissions: ["MANAGE_GUILD", "MANAGE_ROLES"],
	ownerOnly: true,

	callback: async ({ interaction }) => {
		console.log(chalk.green("Creating roles...\nCopy and paste the following output into your .env file"));
		console.log(chalk.red("------------------------------------------------------"));
		// Create the roles
		createRoles(interaction.guild!, "class");
		createRoles(interaction.guild!, "staff");
		createRoles(interaction.guild!, "year");
		interaction.reply({
			content: "Roles created! Check the console for the role IDs\nPaste the output into your .env file and restart the bot\n ", 
			ephemeral: true,
		});

		// Log the command usage
		console.log(
			chalk.blue(
				`${chalk.green(`[COMMAND]`)} ${chalk.yellow(interaction.user.tag)} used the ${chalk.green(`/yearPoll`)} command in ${chalk.yellow(
					interaction.guild?.name
				)}`
			)
		);
	},
} as ICommand;

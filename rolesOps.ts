import { GuildMember, Guild } from "discord.js";
import { returnRoles, returnRoles as roleDictionary } from "./definitions";
import chalk from "chalk";

export async function removePrevRole(member: GuildMember, listID: number) {
	// This function is triggered when a user changes their role,
	// it removes the previous role from the user
	for (const role of Object.values(roleDictionary()[listID])) {
		if (member.roles.cache.has(role)) {
			await member.roles.remove(role);
		}
	}
}

//* Get the key names of the roles object and check if a role with that name exists in the guild.
//* If not create those roles and print their id's to the console.
export async function createRoles(guild: Guild, listID: number): Promise<void> {
	Object.keys(roleDictionary()[listID]).forEach(async (roleName) => {
		// If the guild does not have the role, create it
		if (!guild.roles.cache.find((r) => r.name === roleName)) {
			// Create the role
			const role = await guild.roles.create({ name: roleName });
			// Print the role id to the console
			console.log(chalk.yellow(`${roleName}=${role.id}`));
		} else {
			// If the role already exists, print the id to the console
			const roleId = guild.roles.cache.find((r) => r.name === roleName)?.id;
			console.log(chalk.yellow(`${roleName}=${roleId}`));
		}
	});
}

export function checkForRoles(guild: Guild, listID: number): boolean {
	const roles = returnRoles()[listID];
	const roleNames = Object.keys(roles);
	let collection: boolean[] = [];

	roleNames.forEach((roleName) => {
		let state = guild.roles.cache.find((r) => r.name === roleName);

		if (!state) {
			console.log(chalk.red.bold(`Role ${roleName} does not exist in ${guild.name}, Please run the /createRoles command in that server.`));
			collection.push(false);
			
		}
	});
	
	if (collection.includes(false)) {
		return false;
	} else {
		return true;
	}
}

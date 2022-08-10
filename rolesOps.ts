import { GuildMember, Guild } from "discord.js";
import { returnRoles, returnRoles as roleDictionary } from "./definitions";
import chalk from "chalk";

export async function getUsersRoles(member: GuildMember): Promise<string> {
	let list = "";
	for (const role of Object.values(roleDictionary()[0])) {
        if (member.roles.cache.has(role)) {
            list += `${member.guild.roles.cache.get(role)?.name}\n`;
        }
    }
	for (const role of Object.values(roleDictionary()[1])) {
		if (member.roles.cache.has(role)) {
			list += `${member.guild.roles.cache.get(role)?.name}\n`;
		}
	}
	return list;
}

export async function removePrevRole(member: GuildMember, listID: number): Promise<void> {
	// This function is triggered when a user changes their role,
	// it removes the previous role from the user
	for (const role of Object.values(roleDictionary()[listID])) {
		if (member.roles.cache.has(role)) {
			await member.roles.remove(role);
			console.log(chalk.green(`Removed role ${chalk.green(role)} from ${chalk.yellow(member.user.tag)}`));
		}
	}
}

export async function addNewRole(member: GuildMember, listID: number, roleKey: string) {
	// This function is triggered when a user changes their role,
	// it adds the new role to the user
	const role = roleDictionary()[listID][roleKey]
	await member.roles.add(role);
	console.log(chalk.green(`Added role ${chalk.green(role)} to ${chalk.yellow(member.user.tag)}`));
}

export async function createRoles(guild: Guild, listID: number): Promise<void> {
	// Get the key names of the roles object and check if a role with that name exists in the guild.
	// If not create those roles and print their id's to the console.
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
	// Check if all roles exist in a guild
	// Return true if they do, false if they don't
	const roles = returnRoles()[listID];
	const roleNames = Object.keys(roles);
	let collection: boolean[] = [];

	roleNames.forEach((roleName) => {
		let stateName = guild.roles.cache.find((r) => r.name === roleName);
		let stateId = guild.roles.cache.find((r) => r.id === roles[roleName]);

		if (!stateName && !stateId) {
			console.log(chalk.red.bold(`Role ${roleName} does not exist in ${guild.name}, Please run the /createRoles command in that server.`));
			collection.push(false);
		}
	});

	if (collection.includes(false)) {
		return false;
	} else {
		console.log(chalk.yellow.bold(`All roles in list ${listID} exist in ${guild.name}`));
		return true;
	}
}

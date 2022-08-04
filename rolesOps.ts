import { GuildMember, Guild } from "discord.js";
import { returnRoles as roleDictionary } from "./definitions";

async function removePrevRole(member: GuildMember, listID: number) {
	for (const role of Object.values(roleDictionary()[listID])) {
		if (member.roles.cache.has(role)) {
			await member.roles.remove(role);
		}
	}
}

// write a function that will create all necessary roles when the bot joins a guild, if they don't exist already
//! this does not work yet. DO NOT USE
export async function createRoles(guild: Guild, listID: number): Promise<void> {
	for (const role of Object.values(roleDictionary()[listID])) {
		if (!guild.roles.cache.has(role)) {
			await guild.roles.create({ name: role });
		}
	}
}

export { removePrevRole };

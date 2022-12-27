import { GuildMember, Guild } from "discord.js";
import chalk from "chalk";
import { classModel } from "../models/classModel";
import { staffModel } from "../models/staffModel";
import { yearModel } from "../models/yearModel";
import { Model } from "mongoose";

export interface IRole {
  ROLE_NAME: string;
  ROLE_ID: string;
}

export function cleanRoleString(role_name: string): string {
  const clean_role_name: string = role_name
    .toLowerCase()
    .replace(/[`~!@#$%^&*()|+=?;:'",.<>\{\}\[\]\\\/\n]+/gi, "")
    .replace(/\s+/gi, "-")
    .replace(/-{2,}/gi, "-")
    .slice(0, 100);
  return clean_role_name;
}

export async function checkIfCollectionsExist<T>(model: Model<T>) {
  if (!(await model.exists({}))) {
    throw new Error(`${model.name} collection does not exist`);
  }
}
async function dbQuery() {
  return await Promise.all([
    classModel.find({}),
    staffModel.find({}),
    yearModel.find({}),
  ]);
}

export async function getUsersRoles(member: GuildMember): Promise<string> {
  let list = "";
  for (const group of await dbQuery()) {
    for (const element of group) {
      if (member.roles.cache.has(element.ROLE_ID)) {
        list += `${member.guild.roles.cache.get(element.ROLE_ID)?.name}\n`;
      }
    }
  }
  return list;
}

export async function removeRole<T extends IRole>(
  member: GuildMember,
  model: Model<T>
): Promise<void> {
  // This function is triggered when a user changes their role,
  // it removes the previous role from the user
  const list = await model.find({});

  for (const role of list) {
    if (member.roles.cache.has(role.ROLE_ID)) {
      await member.roles.remove(role.ROLE_ID);
      console.log(
        chalk.green(
          `Removed role ${chalk.green(role.ROLE_ID)} from ${chalk.yellow(
            member.user.tag
          )}`
        )
      );
    }
  }
}

export async function addNewRole<T extends IRole>(
  member: GuildMember,
  model: Model<T>,
  id: string
) {
  // This function is triggered when a user changes their role, it adds the new role to the user
  const role = await model.findOne({ ROLE_NAME: id });

  if (role === null) {
    throw new Error(`No roll found with id: ${id}`);
  }

  if (!member.roles.cache.has(role.ROLE_ID)) {
    await member.roles.add(role.ROLE_ID);
    console.log(
      chalk.green(
        `Added role ${chalk.green(role.ROLE_NAME)} to ${chalk.yellow(
          member.user.tag
        )}`
      )
    );
  }
}

export async function createRoles<T extends IRole>(
  guild: Guild,
  model: Model<T>
): Promise<void> {
  const role_docs = await model.find({});

  for (let index = 0; index < role_docs.length; index++) {
    const role_doc = role_docs[index];
    if (
      guild.roles.cache.find((r) => r.name === role_doc.ROLE_NAME) == undefined
    ) {
      // Create the role
      const role = await guild.roles.create({
        name: cleanRoleString(role_doc.ROLE_NAME),
      });
      role_doc.ROLE_ID = role.id;
      await role_doc.save();

      // Print the role id to the console
      console.log(chalk.yellow(`Created role: ${role.name}\tid: ${role?.id}`));
    } else {
      // If the role already exists, print the id to the console
      const role = guild.roles.cache.find((r) => r.name === role_doc.ROLE_NAME);
      if (role == undefined) {
        continue;
      }
      const id = role.id;
      role_doc.ROLE_ID = id;
      await role_doc.save();

      console.log(chalk.yellow(`Role exists: ${role.name}\tid: ${id}`));
    }
  }
}

export async function checkForRoles(guild: Guild): Promise<boolean> {
  // Check if all roles exist in a guild
  // Return true if they do, false if they don't

  const collection: boolean[] = [];

  for (const group of await dbQuery()) {
    for (const element of group) {
      const name = guild.roles.cache.find((r) => r.name === element.ROLE_NAME);
      const id = guild.roles.cache.find((r) => r.id === element.ROLE_ID);

      if (name == undefined && id == undefined) {
        console.log(
          chalk.red.bold(
            `Role ${element.ROLE_NAME} does not exist in ${guild.name}, Please run the /createRoles command in that server.`
          )
        );
        collection.push(false);
      }
    }
  }
  if (collection.includes(false)) {
    return false;
  } else {
    console.log(chalk.yellow.bold(`All roles in list exist in ${guild.name}`));
    return true;
  }
}

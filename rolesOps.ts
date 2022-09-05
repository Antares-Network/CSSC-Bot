import { GuildMember, Guild } from "discord.js";
import chalk from "chalk";
import { classModel, IClass } from "./models/classModel";
import { staffModel, IStaff } from "./models/staffModel";
import { yearModel, IYear } from "./models/yearModel";
import { Model } from "mongoose";

export interface IRole {
  ROLE_NAME: string;
  ROLE_ID: string;
}

export async function checkIfCollectionsExist(model: Model<any>) {
  if (!(await model.exists({}))) {
    throw new Error(`${model.name} collection does not exist`);
  }
}
async function dbQuery() {
  const classes = await classModel.find({});
  const staff = await staffModel.find({});
  const years = await yearModel.find({});
  return [classes, staff, years];
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

export async function addNewRole(
  member: GuildMember,
  type: string,
  id: string
) {
  // This function is triggered when a user changes their role, it adds the new role to the user
  let role: IClass | IYear | IStaff | null = null;
  if (type === "class") {
    role = await classModel.findOne({ CODE: id });
  } else if (type === "staff") {
    role = await staffModel.findOne({ NAME: id });
  } else if (type === "year") {
    role = await yearModel.findOne({ NAME: id });
  }
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

export async function createRoles(guild: Guild, type: string): Promise<void> {
  let list = null;
  if (type === "class") {
    list = await classModel.find({});
  } else if (type === "staff") {
    list = await staffModel.find({});
  } else if (type === "year") {
    list = await yearModel.find({});
  }

  list?.forEach(async (element) => {
    if (!guild.roles.cache.find((r) => r.name === element.ROLE_NAME)) {
      // Create the role
      const role = await guild.roles.create({ name: element.ROLE_NAME });
      element.ROLE_ID = role.id;
      element.save();
      // Print the role id to the console
      console.log(chalk.yellow(`${element}: ${role?.id}`));
    } else {
      // If the role already exists, print the id to the console
      const id = guild.roles.cache.find(
        (r) => r.name === element.ROLE_NAME
      )?.id;
      if (id !== undefined) {
        element.ROLE_ID = id;
      }
      element.save();
      console.log(chalk.yellow(`${element}: ${id}`));
    }
  });
}

export async function checkForRoles(guild: Guild): Promise<boolean> {
  // Check if all roles exist in a guild
  // Return true if they do, false if they don't

  let collection: boolean[] = [];

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

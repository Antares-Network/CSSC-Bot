import { GuildMember, Guild } from "discord.js";
import chalk from "chalk";
import { classModel } from "../models/classModel";
import { staffModel } from "../models/staffModel";
import { yearModel } from "../models/yearModel";
import { Model } from "mongoose";

/**
 * @description
 * @author John Schiltz
 * @export
 * @interface IRole
 */
export interface IRole {
  ROLE_NAME: string;
  ROLE_ID: string;
}

/**
 * @description Clean the role name by removing special characters, replacing whitespace with dashes, and truncating to 100 characters
 * @author John Schiltz
 * @export
 * @param name - The role name to clean
 * @return {*}
 */
export function cleanRoleString(name: string): string {
  const clean_name: string = name
    .toLowerCase()
    .replace(/[`~!@#$%^&*()|+=?;:'",.<>{}[\]\\/\n]+/gi, "")
    .replace(/(?:\s[\s-]*|-[\s-]+|-+)/gm, "-")
    .slice(0, 100);
  return clean_name;
}

/**
 * @description Check if the collections exist in the database
 * @author John Schiltz
 * @export
 * @template T
 * @param model - The model to check
 */
export async function checkIfCollectionsExist<T>(model: Model<T>) {
  if (!(await model.exists({}))) {
    throw new Error(`${model.name} collection does not exist`);
  }
}
/**
 * @description Get all groups of roles from the database and return them as an array
 * @author Nathen Goldsborough
 * @return {*}
 */
async function getAllRolesFromDB() {
  return await Promise.all([
    classModel.find({}),
    staffModel.find({}),
    yearModel.find({}),
  ]);
}

/**
 * @description Get all roles from a user and return them as a string
 * @author Nathen Goldsborough
 * @export
 * @param member - The user to get the roles from
 * @return {*} - The roles as a string
 */
export async function getUsersRoles(member: GuildMember): Promise<string> {
  let roles_list = "";
  for (const role_group of await getAllRolesFromDB()) {
    for (const role of role_group) {
      if (member.roles.cache.has(role.ROLE_ID)) {
        roles_list += `${member.guild.roles.cache.get(role.ROLE_ID)?.name}\n`;
      }
    }
  }
  return roles_list;
}

/**
 * @description Remove all roles from a user given a model and member
 * @author Nathen Goldsborough
 * @export
 * @template T - Extends IRole
 * @param member - The user to remove the roles from
 * @param model - The model to get the roles from
 * @return {*}
 */
export async function removeRole<T extends IRole>(
  member: GuildMember,
  model: Model<T>
): Promise<void> {
  const roles = await model.find({});

  for (const role of roles) {
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

/**
 * @description Add a role to a user given a role id and model
 * @author Nathen Goldsborough
 * @export
 * @template T - Extends IRole
 * @param member - The user to add the role to
 * @param model - The model to get the role from
 * @param name - The name of the role to add as specified in the database
 */
export async function addNewRole<T extends IRole>(
  member: GuildMember,
  model: Model<T>,
  name: string
) {
  const role = await model.findOne({ NAME: name });

  if (role === null) {
    throw new Error(`No role found with id: ${name}`);
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

/**
 * @description
 * @author Nathen Goldsborough
 * @export
 * @template T - Extends IRole
 * @param guild - The server to create the roles in
 * @param model - The mongo db model to get the roles from
 * @return {*}
 */
export async function createRoles<T extends IRole>(
  guild: Guild,
  model: Model<T>
): Promise<void> {
  const role_docs = await model.find({});

  for (let index = 0; index < role_docs.length; index++) {
    const role_doc = role_docs[index];
    const clean_role_name = cleanRoleString(role_doc.ROLE_NAME);
    const found_role = checkForRole(guild, clean_role_name, role_doc.ROLE_ID);

    if (found_role === undefined) {
      const role = await guild.roles.create({
        name: clean_role_name,
      });

      // save role id to database
      role_doc.ROLE_ID = role.id;
      await role_doc.save();

      // Print the role id to the console
      console.log(chalk.yellow(`Created role: ${role.name}\tid: ${role?.id}`));
    } else {
      // If the role already exists, update it to match the db then print the id to the console
      role_doc.ROLE_ID = found_role.id;
      role_doc.ROLE_NAME = found_role.name;
      await role_doc.save();

      console.log(
        chalk.yellow(`Role exists: ${found_role.name}\tid: ${found_role.id}`)
      );
    }
  }
}
/**
 * @description - Checks if a role exists in the guild first by id, then by name
 * @author John Schiltz
 * @export
 * @param guild
 * @param role_name
 * @param role_id
 * @return - The role if it exists, undefined if it doesn't
 */
export function checkForRole(
  guild: Guild,
  role_name?: string,
  role_id?: string
) {
  if (role_id !== undefined) {
    const found_role = guild.channels.cache.find((role) => {
      return role.id === role_id;
    });
    if (found_role !== undefined) {
      return found_role;
    }
  }
  if (role_name !== undefined) {
    const found_role = guild.channels.cache.find((role) => {
      return role.name === role_name;
    });
    if (found_role !== undefined) {
      return found_role;
    }
  }
  return undefined;
}

/**
 * @description Check if all roles in database exist for a server and print if they do not
 * @author Nathen Goldsborough
 * @export
 * @param guild Server to check roles for
 * @return {*} true if all roles exist, false if they do not
 */
export async function checkForRoles(guild: Guild): Promise<boolean> {
  let foundAllRoles = true;
  for (const roleGroups of await getAllRolesFromDB()) {
    for (const role of roleGroups) {
      const name = guild.roles.cache.find((r) => r.name === role.ROLE_NAME);
      const id = guild.roles.cache.find((r) => r.id === role.ROLE_ID);

      if (name === undefined && id === undefined) {
        foundAllRoles = false;
        console.log(
          chalk.red.bold(
            `Role ${role.ROLE_NAME} does not exist in ${guild.name}, Please run the /createRoles command in that server.`
          )
        );
      }
    }
  }
  if (foundAllRoles) {
    console.log(chalk.yellow.bold(`All roles in list exist in ${guild.name}`));
  }
  return foundAllRoles;
}

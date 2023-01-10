import { CategoryChannel, Guild, GuildChannel } from "discord.js";
import chalk from "chalk";
import { IClass } from "../models/classModel";

export function cleanChannelString(s: string): string {
  const s_new = s
    .toLowerCase()
    .replace(/[`~!@#$%^&*()|+=?;:'",.<>{}[\]\\/]/gi, "")
    .replace(/\s+/gi, "-")
    .replace(/-{2,}/gi, "-")
    .slice(0, 100);
  return s_new;
}
/**
 * @description
 * @author John Schiltz
 * @export
 * @param course
 * @return {*}
 */
export function getTopic(course: IClass): string {
  return `${course.TITLE} | ${course.INFO}`.slice(0, 1024);
}
/**
 * @description - Gets the course name, if it is a duplicate, it adds the title to the end of the name
 * @author John Schiltz
 * @export
 * @param course
 * @return - The course name
 */
export function getCourseName(course: IClass) {
  return course.DUPE === true ? `${course.NAME}-${course.TITLE}` : course.NAME;
}

/**
 * @description - Checks if a channel exists in the guild
 * @author John Schiltz
 * @export
 * @param guild
 * @param channel_name
 * @return - The channel if it exists, undefined if it doesn't
 */
export function checkForChannel(guild: Guild, channel_name: string) {
  return guild.channels.cache.find((channel) => {
    return channel.name === channel_name;
  });
}

/**
 * @description Gets a category from the guild, if it doesn't exist, it creates it
 * @author John Schiltz
 * @export
 * @param guild
 * @param category_name
 * @return - The category channel
 */
export async function getCategory(guild: Guild, category_name: string) {
  let found_category = guild.channels.cache.find((category) => {
    return category.name === category_name;
  });

  if (
    found_category === undefined ||
    found_category.type !== "GUILD_CATEGORY"
  ) {
    found_category = await guild.channels.create(category_name, {
      type: "GUILD_CATEGORY",
    });
  }

  return found_category;
}

/**
 * @description Creates and returns a new text channel
 * @author John Schiltz
 * @param guild
 * @param name
 * @param topic
 * @param category
 * @param category_name - Will create new channel if it doesn't exist
 * @returns - The newly created channel
 */
export async function createTextChannel(
  guild: Guild,
  name: string,
  topic: string,
  category?: CategoryChannel,
  category_name?: string
) {
  //Determine which arg to use
  let parent: CategoryChannel | undefined;
  if (category !== undefined) {
    parent = category;
  } else if (category_name !== undefined) {
    parent = await getCategory(guild, category_name);
  } else {
    throw Error(
      "Must specify either channel_category or channel_category_name"
    );
  }

  return guild.channels.create(cleanChannelString(name), {
    type: "GUILD_TEXT",
    topic,
    parent,
  });
}

/**
 * @description - Moves a channel to a category, if it is already in the category, it does nothing
 * @author John Schiltz
 * @param guild
 * @param channel
 * @param category_name
 * @returns 1 if channel was moved, 0 if it was already in the correct category
 */
export async function moveChannel(
  guild: Guild,
  channel: GuildChannel,
  category_name: string
): Promise<number> {
  if (
    channel.parent === null ||
    channel.parent === undefined ||
    channel.parent?.name !== category_name
  ) {
    const category = await getCategory(guild, category_name);
    channel.setParent(category);

    console.log(
      chalk.yellow(
        `Moved channel ${channel.name} from: ${channel.parent?.name} to: ${category_name}`
      )
    );
    return 1;
  }
  return 0;
}

/**
 * @description - Concatenates the category name with the category number
 * @author John Schiltz
 * @export
 * @param category_name
 * @param category_number
 * @return - The concatenated category name
 */
export function concatCategoryName(
  category_name: string,
  category_number: number
) {
  return category_number === 0
    ? category_name
    : `${category_name} ${category_number}`;
}

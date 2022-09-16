import { CategoryChannel, Guild, GuildChannel } from "discord.js";
import chalk from "chalk";
import { classModel, IClass } from "../models/classModel";

export function cleanChannelString(s: string): string {
  const s_new = s
    .toLowerCase()
    .replace(/[`~!@#$%^&*()|+=?;:'",.<>\{\}\[\]\\\/\n]+/gi, "")
    .replace(/\s+/gi, "-")
    .replace(/-{2,}/gi, "-");
  console.log(`${s}\t:\t${s_new}`);
  return s_new;
}
export function getCourseName(course: IClass) {
  return course.DUPE == true ? `${course.NAME}-${course.TITLE}` : course.NAME;
}

export function checkForChannel(guild: Guild, channel_name: string) {
  return guild.channels.cache.find((channel) => {
    return channel.name == channel_name;
  });
}

export async function findCategory(guild: Guild, category_name: string) {
  let category = guild.channels.cache.find((category) => {
    return category.name == category_name;
  });

  if (category === undefined || category.type !== "GUILD_CATEGORY") {
    category = await guild.channels.create(category_name, {
      type: "GUILD_CATEGORY",
    });
  }

  return category;
}
export async function createTextChannel(
  guild: Guild,
  name: string,
  topic: string,
  category?: CategoryChannel,
  category_name?: string
) {
  //Determine which arg to use
  let channel_parent: CategoryChannel | undefined;
  if (category !== undefined) {
    channel_parent = category;
  } else if (category_name !== undefined) {
    channel_parent = await findCategory(guild, category_name);
  } else {
    throw Error(
      "Must specify either channel_category or channel_category_name"
    );
  }

  return guild.channels.create(cleanChannelString(name), {
    type: "GUILD_TEXT",
    topic: topic,
    parent: channel_parent,
  });
}

export async function moveChannel(
  guild: Guild,
  channel: GuildChannel,
  category_name: string
): Promise<number> {
  if (
    channel.parent === null ||
    channel.parent === undefined ||
    channel.parent?.name != category_name
  ) {
    const category = await findCategory(guild, category_name);
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

export function concatCategoryName(
  category_name: string,
  category_number: number
) {
  return category_number == 0
    ? category_name
    : `${category_name} ${category_number}`;
}

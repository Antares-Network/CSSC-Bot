import { CategoryChannel, Guild, GuildChannel } from "discord.js";
import chalk from "chalk";

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
  channel_name: string,
  channel_topic: string,
  channel_category?: CategoryChannel,
  channel_category_name?: string
) {
  console.log(`Category: ${channel_category}`);
  console.log(`Category name: ${channel_category_name}`);

  let channel_parent = undefined;
  if (channel_category !== undefined) {
    channel_parent = channel_category;
  } else if (channel_category_name !== undefined) {
    channel_parent = await findCategory(guild, channel_category_name);
  } else {
    throw Error(
      "Must specify either channel_category or channel_category_name"
    );
  }

  return guild.channels.create(channel_name, {
    type: "GUILD_TEXT",
    topic: channel_topic,
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
        `Moved channel${channel.name} from: ${channel.parent?.name} to: ${category_name}`
      )
    );
    return 1;
  }
  return 0;
}

export function cleanChannelString(s: string): string {
  return s
    .toLowerCase()
    .replace(/[`~!@#$%^&*)|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "")
    .replace("(", "-")
    .replace("compsci ", "cs");
}
export function concatCategoryName(
  category_name: string,
  category_number: number
) {
  return category_number == 0
    ? category_name
    : category_name + ` ${category_number}`;
}

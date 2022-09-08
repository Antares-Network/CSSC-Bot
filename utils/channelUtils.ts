import { Guild, GuildChannel } from "discord.js";
import chalk from "chalk";

export async function checkForChannel(guild: Guild, channel_name: string) {
  return guild.channels.cache.find((channel) => {
    return channel.name == channel_name;
  });
}

export async function createTextChannel(
  guild: Guild,
  channel_name: string,
  channel_topic: string,
  channel_category_name: string
) {
  let category = await findCategory(guild, channel_category_name);

  return guild.channels.create(channel_name, {
    type: "GUILD_TEXT",
    topic: channel_topic ? channel_topic : "",
    parent: category,
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
    let category = await findCategory(guild, category_name);
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

export function cleanChannelString(s: string): string {
  return s
    .toLowerCase()
    .replace(/[`~!@#$%^&*)|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "")
    .replace("(", "-")
    .replace("compsci ", "cs");
}

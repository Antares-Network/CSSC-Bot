import { Guild, GuildChannel } from "discord.js";

export async function checkForChannel(guild: Guild, channel_name: string) {
  // console.log(guild.channels.cache);
  return guild.channels.cache.find((channel) => {
    console.log(channel.name);
    return channel.name == channel_name;
  });
}

export async function createTextChannel(
  guild: Guild,
  channel_name: string,
  channel_topic?: string,
  channel_category?: string
) {
  let category = undefined;

  if (channel_category) {
    category = guild.channels.cache.find(
      (channel) =>
        channel.name == channel_name && channel.type === "GUILD_CATEGORY"
    );

    if (category === undefined) {
      category = await guild.channels.create(channel_category, {
        type: "GUILD_CATEGORY",
      });
    }
  }

  return guild.channels.create(channel_name, {
    type: "GUILD_TEXT",
    topic: channel_topic ? channel_topic : "",
    parent: channel_category,
  });
}

export async function moveChannel(
  guild: Guild,
  channel: GuildChannel,
  category_name: string
) {
  if (
    channel.parent === null ||
    channel.parent === undefined ||
    channel.parent?.name != category_name
  ) {
    // Move the class to parent "COMP SCI"
    console.log(
      `Parent Name: ${channel.parent?.name}.....Category name: ${category_name}`
    );
    console.log("moving channel");
    let category = await findCategory(guild, category_name);
    channel.setParent(category);
  }
}

async function findCategory(guild: Guild, category_name: string) {
  let category = guild.channels.cache.find(
    (category) => category.name == category_name
  );

  if (category === undefined || category.type !== "GUILD_CATEGORY") {
    category = await guild.channels.create(category_name, {
      type: "GUILD_CATEGORY",
    });
  }

  return category;
}

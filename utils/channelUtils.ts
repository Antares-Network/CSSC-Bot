import { Guild } from "discord.js";

export async function checkForChannel(guild: Guild, channel_name: string) {
  return guild.channels.cache.find((channel) => channel.name === channel_name);
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
      category = guild.channels.create(channel_category, {
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

import { Client, MessageEmbed } from "discord.js";
/**
 * @description Creates a default embed for bot messages
 * @author John Schiltz
 * @export
 * @param client - Discord Client
 * @param title - Title of embed
 * @param description - Description of embed
 * @return {*} - MessageEmbed
 */
export function create_default_embed(
  client: Client,
  title: string,
  description: string
) {
  const color = "#0099ff";
  const thumbnail =
    "https://antaresnetwork.com/resources/CSSC-bot/cssc-server-icon.png";
  const footer = `Delivered in: ${client.ws.ping}ms | CSSC-bot | ${process.env.VERSION}`;
  const footerIcon = "https://antaresnetwork.com/resources/CSSC-bot/icon.jpg";

  // Embed construction
  const embed = new MessageEmbed()
    .setColor(color)
    .setTitle(title)
    .setThumbnail(thumbnail)
    .setDescription(description)
    .setFooter({ text: footer, iconURL: footerIcon });
  return embed;
}

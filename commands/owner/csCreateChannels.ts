import { Client, MessageEmbed } from "discord.js";

import chalk from "chalk";
import { ICommand } from "wokcommands";
import { classModel } from "../../models/classModel";
import {
  checkForChannel,
  cleanChannelString,
  createTextChannel,
  moveChannel,
} from "../../utils/channelUtils";

function create_default_embed(
  client: Client,
  title: string,
  description: string
) {
  const color = "#0099ff";
  const thumbnail =
    "https://playantares.com/resources/CSSC-bot/cssc-server-icon.png";
  const footer = `Delivered in: ${client.ws.ping}ms | CSSC-bot | ${process.env.VERSION}`;
  const footerIcon = "https://playantares.com/resources/CSSC-bot/icon.jpg";

  // Embed construction
  const embed = new MessageEmbed()
    .setColor(color)
    .setTitle(title)
    .setThumbnail(thumbnail)
    .setDescription(description)
    .setFooter({ text: footer, iconURL: footerIcon });
  return embed;
}
export default {
  name: "csCreateChannels",
  category: "owner",
  description: "Update CS class channels",
  slash: true,
  testOnly: false,
  guildOnly: true,
  requiredPermissions: ["MANAGE_GUILD", "MANAGE_ROLES"],
  ownerOnly: true,

  callback: async ({ client, interaction: msgInt }) => {
    if (msgInt.guild === null) {
      console.log(chalk.red("No guild"));
      return;
    }

    await msgInt.deferReply({ ephemeral: true });

    const courses = await classModel.find({}).sort({ CODE: 1 });

    //create a copy of the courses with cleaned names
    const cleaned_courses = Array.from(courses).map((course) => {
      course.CODE = cleanChannelString(course.CODE);
      return course;
    });
    const cs_category_name = "COMP SCI CLASSES";

    let new_channel_count = 0;
    let move_channel_count = 0;
    for (let index = 0; index < cleaned_courses.length; index++) {
      const channel = await checkForChannel(
        msgInt.guild,
        cleaned_courses[index].CODE
      );

      if (channel === undefined || channel.type !== "GUILD_TEXT") {
        console.log(
          chalk.yellow(`Created channel: ${cleaned_courses[index].CODE}`)
        );
        const new_channel = await createTextChannel(
          msgInt.guild,
          cleaned_courses[index].CODE,
          cleaned_courses[index].INFO,
          cs_category_name
        );

        ++new_channel_count;
        console.log(chalk.yellow(`Created channel: ${new_channel.name}`));

        //TODO: Write channel id to db
      } else {
        move_channel_count += await moveChannel(
          msgInt.guild,
          channel,
          "COMP SCI CLASSES"
        );
        //TODO: Confirm channel ID is in db
      }
    }

    const title = "Create Classes";
    let description = `Created ${new_channel_count} new channels\nMoved ${move_channel_count} channels`;
    if (move_channel_count > 0) {
      description += ` to ${cs_category_name}`;
    }

    const embed = create_default_embed(client, title, description);
    await msgInt.editReply({ embeds: [embed] });

    console.log(chalk.yellow(description));

    // Log the command usage
    console.log(
      chalk.blue(
        `${chalk.green(`[COMMAND]`)} ${chalk.yellow(
          msgInt.user.tag
        )} used the ${chalk.green(
          `/csCreateChannels`
        )} command in ${chalk.yellow(msgInt.guild?.name)}`
      )
    );
  },
} as ICommand;

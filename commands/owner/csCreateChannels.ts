import { Client, MessageEmbed } from "discord.js";

import chalk from "chalk";
import { ICommand } from "wokcommands";
import { classModel } from "../../models/classModel";
import {
  checkForChannel,
  cleanChannelString,
  createTextChannel,
  findCategory,
  moveChannel,
  concatCategoryName,
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

    const category_name = "COMP SCI CLASSES";
    let category_number = 0;
    const max_category_size = 50;

    const cs_past_category_name = "PAST CLASSES";
    let new_channel_count = 0;
    let move_channel_count = 0;

    //Move classes no longer in the db to
    const cs_category = checkForChannel(
      msgInt.guild,
      concatCategoryName(category_name, category_number)
    );
    if (cs_category != undefined && cs_category.type == "GUILD_CATEGORY") {
      const children = Array.from(cs_category.children.values());
      for (let index = 0; index < children.length; index++) {
        const match = cleaned_courses.find((course) => {
          return course.CODE == children[index].name;
        });
        if (match == undefined) {
          await moveChannel(
            msgInt.guild,
            children[index],
            cs_past_category_name
          );
        }
      }
    }

    for (let index = 0; index < cleaned_courses.length; index++) {
      // Iterate through courses in db
      const channel = checkForChannel(
        msgInt.guild,
        cleaned_courses[index].CODE
      );

      // Create new channels
      if (channel === undefined || channel.type !== "GUILD_TEXT") {
        let category = await findCategory(
          msgInt.guild,
          concatCategoryName(category_name, category_number)
        );

        // Increment category if category is full
        if (category.children.size >= max_category_size) {
          ++category_number;
          category = await findCategory(
            msgInt.guild,
            concatCategoryName(category_name, category_number)
          );
        }

        const new_channel = await createTextChannel(
          msgInt.guild,
          cleaned_courses[index].CODE,
          cleaned_courses[index].INFO,
          category
        );

        ++new_channel_count;
        console.log(chalk.yellow(`Created channel: ${new_channel.name}`));

        //TODO: Write channel id to db
      }
      // Move old channels
      else {
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
      description += ` to ${concatCategoryName(
        category_name,
        category_number
      )}`;
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

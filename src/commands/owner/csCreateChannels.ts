import chalk from "chalk";
import { ICommand } from "wokcommands";
import { classModel } from "../../models/classModel";
import {
  checkForChannel,
  cleanChannelString,
  createTextChannel,
  getCategory,
  moveChannel,
  concatCategoryName,
  getTopic,
} from "../../utils/channels";
import { create_default_embed } from "../../utils/embeds";
import { cleanRoleString } from "../../utils/roles";
import { getCourseName } from "../../utils/course_cleaning";
import { CategoryChannel, GuildBasedChannel } from "discord.js";

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

    const courses = await classModel.find({}).sort({ NAME: 1 });

    //create an array of the courses with cleaned names
    const cleaned_courses: string[] = [];
    for (let index = 0; index < courses.length; index++) {
      cleaned_courses.push(cleanChannelString(getCourseName(courses[index])));
    }

    // for (let index = 0; index < courses.length; index++) {
    //   console.log(courses[index].CODE);
    // }

    const category_name = "COMP SCI CLASSES";
    let category_number = 0;
    const max_category_size = 50;

    const cs_past_category_name = "PAST CLASSES";
    let new_channel_count = 0;
    let move_channel_count = 0;

    console.log(
      chalk.blue(
        `category name: ${concatCategoryName(category_name, category_number)}`
      )
    );

    let past_category = msgInt.guild.channels.cache.find((category) => {
      return (
        category.name === category_name && category.type === "GUILD_CATEGORY"
      );
    });
    if (
      past_category !== undefined &&
      !(past_category instanceof CategoryChannel)
    ) {
      past_category = undefined;
    }

    //Move classes no longer in the db to cs_past_category_name

    let cs_category = checkForChannel(
      msgInt.guild,
      concatCategoryName(category_name, category_number)
    );
    console.log(chalk.blue(`Channel: ${cs_category?.name}`));

    while (cs_category !== undefined && cs_category.type === "GUILD_CATEGORY") {
      const children = Array.from(cs_category.children.values());
      for (let index = 0; index < children.length; index++) {
        const match = courses.find((course) => {
          return course.CHANNEL_ID === children[index].id;
        });
        if (match !== undefined) {
          console.log(
            chalk.green(
              `Channel ${children[index].name}'s COURSE_ID matches ${match.NAME}`
            )
          );
          continue;
        }
        if (past_category === undefined) {
          past_category = await getCategory(
            msgInt.guild,
            cs_past_category_name
          );
        }
        console.log(
          chalk.yellow(
            `Moving: ${children[index].name} to: ${cs_past_category_name}`
          )
        );
        await moveChannel(children[index], past_category);
      }
      ++category_number;
      cs_category = checkForChannel(
        msgInt.guild,
        concatCategoryName(category_name, category_number)
      );
    }
    category_number = 0;

    for (let index = 0; index < courses.length; index++) {
      // Iterate through courses in db
      const channel = checkForChannel(
        msgInt.guild,
        cleanChannelString(getCourseName(courses[index])),
        courses[index].CHANNEL_ID
      );

      let category = await (
        await getCategory(
          msgInt.guild,
          concatCategoryName(category_name, category_number)
        )
      ).fetch(true);

      // Increment category if category is full
      if (category.children.size >= max_category_size - 1) {
        ++category_number;
        category = await (
          await getCategory(
            msgInt.guild,
            concatCategoryName(category_name, category_number)
          )
        ).fetch(true);
        console.log(
          chalk.yellow(
            `old category full, new category: ${concatCategoryName(
              category_name,
              category_number
            )} created`
          )
        );
      }
      console.log(
        chalk.yellow(
          `Working in category: ${concatCategoryName(
            category_name,
            category_number
          )} size: ${category.children.size}`
        )
      );

      // Create new channels
      if (channel === undefined || channel.type !== "GUILD_TEXT") {
        const new_channel = await createTextChannel(
          msgInt.guild,
          getCourseName(courses[index]),
          getTopic(courses[index]),
          category
        );

        ++new_channel_count;
        console.log(chalk.yellow(`Created channel: ${new_channel.name}`));

        courses[index].CHANNEL_ID = new_channel.id;
        courses[index].save();

        // Ping members who have this role
        const found_role = msgInt.guild.roles.cache.find(
          (role) => courses[index].ROLE_ID === role.id
        );
        // const found_role = courses[index].ROLE_ID
        if (found_role !== undefined) {
          //Ping member
          new_channel.send(
            `Hey! <@&${found_role.id}> here is a channel for you!`
          );
        } else {
          new_channel.send(
            `Strange, there seems to be no role for this course. Please contact a mod to fix this.`
          );
        }
      } else if (
        channel.parent !== null &&
        !channel.parent.name.startsWith(category_name)
      ) {
        // Moves and updates old channels
        console.log(
          chalk.yellow(
            `Moving: ${channel.name} to: ${concatCategoryName(
              category_name,
              category_number
            )}`
          )
        );
        channel.edit({ topic: courses[index].INFO });
        move_channel_count += await moveChannel(
          msgInt.guild,
          channel,
          concatCategoryName(category_name, category_number)
        );

        courses[index].CHANNEL_ID = channel.id;
        courses[index].save();
        // Ping members who have this role
        const found_role = msgInt.guild.roles.cache.find((role) => {
          return (
            cleanRoleString(role.name) ===
            cleanChannelString(getCourseName(courses[index]))
          );
        });
        if (found_role !== undefined) {
          //Ping member
          channel.send(
            `Hey! <@&${found_role.id}> here is the channel for you!`
          );
        }
      } else if (
        channel.parent !== null &&
        channel.parent.name.startsWith(category_name)
      ) {
        // updates old channels
        channel.edit({ topic: courses[index].INFO });
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

    console.log(chalk.green(description));

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

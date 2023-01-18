import { ICommand } from "wokcommands";
import DiscordJS from "discord.js";
import chalk from "chalk";
import axios from "axios";
import { classModel } from "../../models/classModel";

interface course {
  code: string;
  title: string;
  description: string;
}

async function getCourses(srcdb: string) {
  const body = encodeURIComponent(
    `{"other":{"srcdb":"${srcdb}"},"criteria":[{"field":"subject","value":"COMPSCI"}]}`
  );
  const config = {
    method: "post",
    url: `https://catalog.uwm.edu/course-search/api/?page=fose&route=search&subject=COMPSCI`,
    headers: {
      "Content-Type": "text/plain",
    },
    data: body,
  };
  const response = await axios(config);
  return response.data.results;
}

async function getDescription(course: any, srcdb: string) {
  const code = course.code;
  const crn = course.crn;
  const body = encodeURIComponent(
    `{"group":"code:${code}","key":"crn:${crn}","srcdb":"${srcdb}","matched":"crn:${crn}"}`
  );
  const config = {
    method: "get",
    url: `https://catalog.uwm.edu/course-search/api/?page=fose&route=details`,
    headers: {
      "Content-Type": "text/plain",
    },
    data: body,
  };
  const result = await axios(config);
  return result.data.description;
}

async function getCourseInfo(srcdb: string) {
  const courses = await getCourses(srcdb);
  let info: course[] = [];
  for (const course of courses) {
    const description = await getDescription(course, srcdb);
    let entry: course = {
      code: course.code,
      title: course.title,
      description: description
        .replace(/<\/?[^>]+(>|$)/g, "")
        .replace(".", ". "), // cleans all html tags and adds spaces after periods
    };
    info.push(entry);
  }
  return await info;
}
export default {
  name: "getCsClasses",
  category: "owner",
  description: "Update the database with new classes",
  slash: true,
  expectedArgs: "<Semester>",
  minArgs: 1,
  permissions: ["MANAGE_MESSAGES", "MANAGE_GUILD"],
  guildOnly: true,
  ownerOnly: true,
  options: [
    {
      name: "semester",
      description: "Which semester to query",
      type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING,
      required: true,
      choices: [
        //TODO: Make this dynamic by querying the catalog api for all available semesters when the bot starts and then updating this list when the bot is restarted
        {
          name: "Spring 2023",
          value: "2232",
        },
        {
          name: "Summer 2023",
          value: "2228",
        },
      ],
    },
  ],

  callback: async ({ interaction }) => {
    interaction.deferReply(); // Defer the reply until all entries have been created or updated
    const srcdb = interaction.options.getString("semester");
    let currentCourses = await classModel.find({});
    let info = await getCourseInfo(srcdb!);

    // Set all current entries to inactive so when we update the db we can know the ones that are no longer active. they will get moved to the PAST CLASSES category
    for (const course of currentCourses) {
      course.ACTIVE = false;
      await course.save();
    }

    // Loop through all the new classes info and update current entries or create new ones
    for (const entry of info) {
      const name = entry.code.toLowerCase().replace("compsci ", "cs").trim();
      let currentCourse = await classModel.findOne({ NAME: name });
      if (currentCourse) {
        currentCourse.ACTIVE = true;
        currentCourse.NAME = name;
        currentCourse.TITLE = entry.title;
        currentCourse.INFO = entry.description
          .replace(/<\/?[^>]+(>|$)/g, "")
          .replace(".", ". "); // cleans all html tags and adds spaces after periods
        await currentCourse.save();
      } else {
        //TODO: Create new class db entry. Need to create channel and role and get name/id's to save to db
      }
    }

    //TODO: Reply to interaction when all classes are updated

    // Log the command usage
    console.log(
      chalk.blue(
        `${chalk.green(`[COMMAND]`)} ${chalk.yellow(
          interaction.user.tag
        )} used the ${chalk.green(`/updateDB`)} command in ${chalk.yellow(
          interaction.guild?.name
        )}`
      )
    );
  },
} as ICommand;

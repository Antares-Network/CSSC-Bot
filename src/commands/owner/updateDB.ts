import { ICommand } from "wokcommands";
import DiscordJS from "discord.js";
import chalk from "chalk";
import axios from "axios";
import { classModel, IClass } from "../../models/classModel";
import { Types, Document } from "mongoose";
import { cleanCourseCode, removeHTML } from "../../utils/course_cleaning";

/**
 * @description
 * @author Nathen Goldsborough
 * @interface course
 */
interface course {
  code: string;
  title: string;
  description: string;
}

/**
 * @description - Gets all courses from the course catalog api
 * @author Nathen Goldsborough
 * @param srcdb
 * @return - the response data (results field)
 */
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

/**
 * @description - Gets the course description from the course catalog api
 * @author Nathen Goldsborough
 * @param course - the course to get the description for
 * @param srcdb - the semester id to get the description for
 * @return - the course description returned from the api call
 */
async function getDescription(course: any, srcdb: string) {
  // skipcq: JS-0323
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

/**
 * @description - Gets all course data from the course catalog api
 * @author Nathen Goldsborough
 * @param srcdb - the semester id to get the courses for
 * @return - Array of course objects
 */
async function getCoursesWithDescription(srcdb: string) {
  const courses = await getCourses(srcdb);
  const info: course[] = [];
  for (const course of courses) {
    const description = await getDescription(course, srcdb);
    const entry: course = {
      code: cleanCourseCode(course.code),
      title: course.title,
      description: removeHTML(description),
    };
    info.push(entry);
  }
  return info;
}
export default {
  name: "updatedb",
  category: "owner",
  description: "Update the database with new classes",
  slash: true,
  expectedArgs: "<Semester>",
  minArgs: 1,
  permissions: ["MANAGE_GUILD", "MANAGE_CHANNELS", "MANAGE_ROLES"],
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
    const current_courses = await classModel.find({});
    const new_courses = await getCoursesWithDescription(srcdb!); // skipcq: JS-0339

    // Set all current entries to inactive so when we update the db we can know the ones that are no longer active. they will get moved to the PAST CLASSES category
    current_courses.forEach((course) => {
      course.ACTIVE = false;
    });

    const courses_to_save: (Document<unknown, any, IClass> & // skipcq: JS-0323
      IClass & { _id: Types.ObjectId })[] = [];

    // Loop through all the new classes info and update current entries or create new ones
    for (const new_course of new_courses) {
      const found_courses = await classModel.find({ NAME: new_course.code });
      if (found_courses === undefined || found_courses.length === 0) {
        const newClass = new classModel({
          NAME: new_course.code,
          TITLE: new_course.title,
          INFO: new_course.description,
          ACTIVE: true,
          DUPE: false,
        });
        courses_to_save.push(newClass);
      } else {
        let found_dupe = false;
        const multiple_results = found_courses.length > 1 ? true : false; // If there are multiple results for a class then it is a duplicate
        for (const found_course of found_courses) {
          found_course.DUPE = multiple_results;
          if (found_course.TITLE === new_course.title) {
            found_course.ACTIVE = true;
            found_course.NAME = new_course.code;
            found_course.INFO = new_course.description;
            found_dupe = true;
          }
        }
        if (found_dupe === false) {
          const newClass = new classModel({
            NAME: new_course.code,
            TITLE: new_course.title,
            INFO: new_course.description,
            ACTIVE: true,
            DUPE: multiple_results,
          });
          courses_to_save.push(newClass);
        }
      }
    }

    await classModel.bulkSave(courses_to_save).then(async () => {
      await classModel.bulkSave(current_courses).then(() => {
        interaction.editReply({ content: "Database updated!" }); // Can't be ephemeral because the interaction is deferred and deferred edits can't be ephemeral
      });
    });

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

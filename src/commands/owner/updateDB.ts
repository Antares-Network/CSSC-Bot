import { ICommand } from "wokcommands";
import DiscordJS from "discord.js";
import chalk from "chalk";
import axios from "axios";
import { classModel } from "../../models/classModel";

interface course{
	code: string;
	title: string;
	description: string;
}

async function getCourses(srcdb: string, subject: string) {
	const body = encodeURIComponent(`{"other":{"srcdb":"${srcdb}"},"criteria":[{"field":"subject","value":"${subject}"}]}`);
	const config = {
		method: "post",
		url: `https://catalog.uwm.edu/course-search/api/?page=fose&route=search&subject=${subject}`,
		headers: {
			"Content-Type": "text/plain",
		},
		data: body,
	};
    const response = await axios(config);
    return response.data.results;
}

async function getDescription(course: any, srcdb: string){
    const code = course.code;
    const crn = course.crn;
    const body = encodeURIComponent(`{"group":"code:${code}","key":"crn:${crn}","srcdb":"${srcdb}","matched":"crn:${crn}"}`);
    const config = {
        method: "post",
        url: `https://catalog.uwm.edu/course-search/api/?page=fose&route=details`,
        headers: {
            "Content-Type": "text/plain",
        },
        data: body,
    };
    const result = await axios(config);
    return result.data.description;
}

async function getCourseInfo(srcdb: string, subject: string){
    const courses = await getCourses(srcdb, subject);
    let info: course[] = [];
    courses.forEach(async (course: any) => {
        const description = await getDescription(course, srcdb);
        let entry: course = {
            code: course.code,
            title: course.title,
            description: description,
        };
        info.push(entry);

        
    });
    return info;
}
export default {
	name: "updateDB",
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
			description: "Which Semester to query",
			type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING,
			required: true,
			choices: [
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
		{
			name: "subject",
			description: "Which Subject to query",
			type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING,
			required: true,
			choices: [
				{
					name: "Computer Science",
					value: "COMPSCI",
				},
			],
		},
	],

	callback: async ({ interaction }) => {
		const srcdb = interaction.options.getString("semester");
		const subject = interaction.options.getString("subject");
		let currentCourses = await classModel.find({});
		let info = await getCourseInfo(srcdb!, subject!)

		currentCourses.forEach(async (course: any) => {
			course.ACTIVE = false;
			await course.save();
		});

		info.forEach(async (course: any) => {
			let currentCourse = await classModel.findOne({ CODE: course.code });
			if (currentCourse) {
				currentCourse.ACTIVE = true;
				currentCourse.NAME = course.code;
				currentCourse.TITLE = course.title;
				currentCourse.INFO = course.description;
				await currentCourse.save();
			} else {
				let newCourse = new classModel({
					NAME: course.code,
					TITLE: course.title,
					INFO: course.description,
					ACTIVE: true,
					DUPE: false,
				});
				await newCourse.save();
			}
		});
			

		


		// Log the command usage
		console.log(chalk.blue(`${chalk.green(`[COMMAND]`)} ${chalk.yellow(interaction.user.tag)} used the ${chalk.green(`/updateDB`)} command in ${chalk.yellow(interaction.guild?.name)}`));
	},
} as ICommand;

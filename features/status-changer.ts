import { Client } from "discord.js";


export default async (client: Client) => {

	const statusOptions = [
		`V.${process.env.VERSION}`,
		`status.playantares.com`,
        'Go to #roles!',
        'Hello! I\'m CSSC-Bot',
	];
	let counter = 0;

	const updateStatus = () => {
		client.user?.setPresence({
			status: "online",
			activities: [
				{
					name: statusOptions[counter],
					type: "PLAYING",
				},
			],
		});

		if (++counter >= statusOptions.length) {
			counter = 0;
		}

		setTimeout(updateStatus, 1000 * 60 * 5);
	};
	updateStatus();
};

export const config = {
	dbName: "STATUS_CHANGER",
	displayName: "Status Changer",
};
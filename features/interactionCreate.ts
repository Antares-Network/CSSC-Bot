import { Client, MessageEmbed, GuildMember } from "discord.js";
import { returnRoles as roleDictionary } from "../definitions";


// Listen interactionCreate events from the client
export default (client: Client): void  => {
    client.on("interactionCreate", async (interaction) => {
        // Make sure the interaction is from a select menu
        if (!interaction.isSelectMenu()) return;
    
        // Get the select menu by it's custom ID
        if (interaction.customId === "collegeYearPoll") {
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle("College Year Poll")
                        .setColor("#0099ff")
                        .setDescription(`You selected the ${interaction.values[0]} role.`)
                        .setFooter({
                            text: `Delivered in: ${client.ws.ping}ms | CSSC-Bot | ${process.env.VERSION}`,
                            iconURL: "https://playantares.com/resources/CSSC-bot/icon.jpg",
                        }),
                ],
                ephemeral: true,
            });
            // Remove any previous roles in the dictionary from the user
            const member = interaction.member as GuildMember;
            for (const role of Object.values(roleDictionary()[0])) {
                if (member.roles.cache.has(role)) {
                    await member.roles.remove(role);
                }
            }
            // Assign the new role to the user
            member.roles.add(roleDictionary()[0][interaction.values[0]]);
        } else if (interaction.customId === "collegeStaffPoll") {
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle("College Year Poll")
                        .setColor("#0099ff")
                        .setDescription(`You selected the ${interaction.values[0]} role.`)
                        .setFooter({
                            text: `Delivered in: ${client.ws.ping}ms | CSSC-Bot | ${process.env.VERSION}`,
                            iconURL: "https://playantares.com/resources/CSSC-bot/icon.jpg",
                        }),
                ],
                ephemeral: true,
            });
            // Remove any previous roles in the dictionary from the user
            const member = interaction.member as GuildMember;
            for (const role of Object.values(roleDictionary()[1])) {
                if (member.roles.cache.has(role)) {
                    await member.roles.remove(role);
                }
            }
            // Assign the new role to the user
            member.roles.add(roleDictionary()[1][interaction.values[0]]);
        }
    });
}
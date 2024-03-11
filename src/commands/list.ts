import { findServer, startServer } from '../api';
import { config } from '../config';
import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	GuildMemberRoleManager,
	SlashCommandBuilder
} from 'discord.js';

// Define the slash command data
export const data = new SlashCommandBuilder()
	.setName('list')
	.setDescription('Lists all servers.');

// Execute function for the slash command
export async function execute(interaction: ChatInputCommandInteraction) {
	// Create an embed for the response message
	const embed = new EmbedBuilder()
		.setColor(0x0099ff)
		.setAuthor({
			name: 'RiftStarter'
		})
		.setTimestamp()
		.setFooter({
			text: `Requested by ${interaction.member?.user.username}`,
			iconURL: interaction.user?.displayAvatarURL()
		});

	// Get the roles of the member who triggered the command
	const memberRoles = interaction.member?.roles as GuildMemberRoleManager;

	// Check if the member has the required permission to start servers
	const hasPermission = memberRoles.cache.some((role) =>
		config.DISCORD_ALLOWED_ROLES!.includes(role.id)
	);

	// If the member doesn't have permission, send an error message and return
	if (!hasPermission) {
		embed.setDescription('You do not have permission to list servers!');
		embed.setColor(0xff0000);
		return interaction.reply({ embeds: [embed] });
	}

	// Send a message indicating that the server start request is being processed
	embed.setDescription(`Requesting list of servers...`);
	await interaction.reply({ embeds: [embed] });

	// Get all servers from config.SERVERS and concatenate them
	const allServers = Object.keys(config.SERVERS).join(', ');

	// Add the list of servers to the embed description
	embed.setDescription(`List of servers: ${allServers}`);

	// Log the server start request
	console.log(`${interaction.member?.user.username} is listing servers...`);

	return interaction.editReply({ embeds: [embed] });
}

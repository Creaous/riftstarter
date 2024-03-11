import { findServer, stopServer } from '../api';
import { config } from '../config';
import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	GuildMemberRoleManager,
	SlashCommandBuilder
} from 'discord.js';

// Define the slash command data
export const data = new SlashCommandBuilder()
	.setName('stop')
	.setDescription('Stops a requested server.')
	.addStringOption((option) =>
		option
			.setName('server')
			.setDescription('The server to stop')
			.setRequired(true)
	);

// Execute function for the slash command
export async function execute(interaction: ChatInputCommandInteraction) {
	// Get the server index from the interaction options
	const serverIndex = interaction.options
		.getString('server', true)
		?.toLowerCase();

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

	// Check if the member has the required permission to stop servers
	const hasPermission = memberRoles.cache.some((role) =>
		config.DISCORD_ALLOWED_ROLES!.includes(role.id)
	);

	// If the member doesn't have permission, send an error message and return
	if (!hasPermission) {
		embed.setDescription('You do not have permission to stop servers!');
		embed.setColor(0xff0000);
		return interaction.reply({ embeds: [embed] });
	}

	// Find the server based on the server index
	const server = await findServer(serverIndex);

	// If the server is not found, send an error message and return
	if (!server) {
		embed.setDescription("I couldn't find that server! 😢");
		embed.setColor(0xff0000);
		return interaction.reply({ embeds: [embed] });
	}

	embed.setTitle(`${server.name}`);

	// Check if the member can bypass prohibited servers
	const canBypassProhibited = memberRoles.cache.some((role) =>
		config.DISCORD_BYPASS_ROLES!.includes(role.id)
	);

	// If the server is prohibited and the member can't bypass, send an error message and return
	if (server.prohibited && !canBypassProhibited) {
		embed.setDescription('You do not have permission to stop this server!');
		embed.setColor(0xff0000);
		return interaction.reply({ embeds: [embed] });
	}

	// Send a message indicating that the server stop request is being processed
	embed.setDescription(`Requesting server to stop...`);
	await interaction.reply({ embeds: [embed] });

	// Log the server stop request
	console.log(
		`${interaction.member?.user.username} is stopping server ${server.name}...`
	);

	let action;

	// Loop through each server instance and stop the server
	for (const [key, value] of Object.entries(server.servers)) {
		const serverInstance = value as any;
		if (key === '0') {
			action = await stopServer(serverInstance);
		}
		await stopServer(serverInstance);
	}

	// If the server is already stopped, send an error message
	if (action.data === 'Failed to stop: not running.') {
		embed.setDescription(`The server is already stopped! 🛑`);
		embed.setColor(0xff0000);
		return interaction.editReply({ embeds: [embed] });
	}

	// Send a success message
	embed.setColor(0xffff00);
	embed.setDescription(`Server is stopping! 🛑`);
	return interaction.editReply({ embeds: [embed] });
}

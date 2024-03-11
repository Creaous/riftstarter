import { findServer, getServer, startServer } from '../api';
import { config } from '../config';
import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	GuildMemberRoleManager,
	SlashCommandBuilder
} from 'discord.js';

// Define the slash command data
export const data = new SlashCommandBuilder()
	.setName('status')
	.setDescription('Get status of a requested server.')
	.addStringOption((option) =>
		option
			.setName('server')
			.setDescription('The server to request info for')
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

	// Check if the member has the required permission to view server status
	const hasPermission = memberRoles.cache.some((role) =>
		config.DISCORD_ALLOWED_ROLES!.includes(role.id)
	);

	// If the member doesn't have permission, send an error message and return
	if (!hasPermission) {
		embed.setDescription(
			'You do not have permission to view status on servers!'
		);
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
		embed.setDescription(
			'You do not have permission to view the status of this server!'
		);
		embed.setColor(0xff0000);
		return interaction.reply({ embeds: [embed] });
	}

	// Send a message indicating that the server status request is being processed
	embed.setDescription(`Requesting status of server...`);
	await interaction.reply({ embeds: [embed] });

	// Log the server status request
	console.log(
		`${interaction.member?.user.username} is requesting status of server ${server.name}...`
	);

	let action = await getServer(server.servers[0]);

	if (action.data.status === 0) {
		// Server is stopped
		embed.setColor(0xff0000);
		embed.setDescription(`Server is stopped. 🛑`);
	} else if (action.data.status === 1) {
		// Server is stopping
		embed.setColor(0xffff00);
		embed.setDescription(`Server is stopping! 🛑`);
	} else if (action.data.status === 2) {
		// Server is starting
		embed.setColor(0xffff00);
		embed.setDescription(`Server is starting! 🚀`);
	} else if (action.data.status === 3) {
		// Server is running
		embed.setColor(0x00ff00);
		embed.setDescription(`Server is running! 🏃`);
	}

	return interaction.editReply({ embeds: [embed] });
}

import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

// Create a new slash command builder
export const data = new SlashCommandBuilder()
	.setName('ping') // Set the name of the command to "ping"
	.setDescription('Replies with Pong!'); // Set the description of the command

// Function to execute when the command is invoked
export async function execute(interaction: CommandInteraction) {
	return interaction.reply('Pong!'); // Reply with "Pong!"
}

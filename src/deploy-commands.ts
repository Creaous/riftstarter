import { REST, Routes } from 'discord.js';
import { config } from './config';
import { commands } from './commands';

// Extract the command data from the commands object
const commandsData = Object.values(commands).map((command) => command.data);

// Create a REST client and set the token
const rest = new REST({ version: '10' }).setToken(config.DISCORD_TOKEN);

// Define the type for the deployCommands function parameter
type DeployCommandsProps = {
	guildId: string;
};

// Define the type for the response of the commands API
type CommandsResponse = {
	id: string;
	application_id: string;
	name: string;
	description: string;
};

// Function to deploy commands to a guild
export async function deployCommands({ guildId }: DeployCommandsProps) {
	try {
		console.log('Started refreshing application (/) commands.');

		console.log('Fetching existing commands...');

		// Get the existing commands for the guild
		const data = await rest.get(
			Routes.applicationGuildCommands(config.DISCORD_CLIENT_ID, guildId),
			{
				body: commandsData
			}
		);

		// Delete existing commands
		for (const command of data as CommandsResponse[]) {
			console.log('Deleting command', command.name);
			await rest.delete(
				Routes.applicationGuildCommand(
					config.DISCORD_CLIENT_ID,
					guildId,
					command.id
				)
			);
		}

		console.log('Adding commands...');

		// Add new commands
		await rest.put(
			Routes.applicationGuildCommands(config.DISCORD_CLIENT_ID, guildId),
			{
				body: commandsData
			}
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
}

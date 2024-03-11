import { Client, Guild } from 'discord.js';
import { config } from './config';
import { commands } from './commands';
import { deployCommands } from './deploy-commands';

// Log the timestamp with each log
require('log-timestamp');

// Create a new Discord client
export const client = new Client({
	intents: ['Guilds', 'GuildMessages', 'DirectMessages']
});

// Event: When the client is ready
client.once('ready', async () => {
	console.log('Discord bot is ready! 🤖');

	// Get all guilds the client is a member of
	const guilds = client.guilds.cache;

	// Leave any guild that is not in the list of main guilds
	for (const guild of guilds) {
		if (!config.DISCORD_GUILD_IDS!.includes(guild[0])) {
			console.log(
				`Leaving ${guild[1].name} since it is not a main guild`
			);
			guild[1].leave();
		} else {
			// Deploy commands to the main guild
			await deployCommands({ guildId: guild[0] });
		}
	}
});

// Event: When the client joins a guild
client.on('guildCreate', async (guild: Guild) => {
	if (!config.DISCORD_GUILD_IDS!.includes(guild.id)) {
		console.log(`Leaving ${guild.name} since it is not a main guild`);
		// Leave the guild
		guild.leave();
	} else {
		// Deploy commands to the main guild
		await deployCommands({ guildId: guild.id });
	}
});

// Event: When an interaction (e.g., slash command) is created
client.on('interactionCreate', async (interaction: any) => {
	if (!interaction.isCommand()) {
		return;
	}

	const { commandName } = interaction;

	// Check if the command exists in the commands object
	if (commands[commandName as keyof typeof commands]) {
		// Execute the corresponding command
		commands[commandName as keyof typeof commands].execute(interaction);
	}
});

// Login to Discord using the provided token
client.login(config.DISCORD_TOKEN);

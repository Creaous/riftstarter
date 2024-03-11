import dotenv from 'dotenv';
import fs from 'node:fs';

dotenv.config();

// Read the contents of 'servers.json' file and parse it as JSON
const SERVERS = JSON.parse(fs.readFileSync('servers.json', 'utf8'));

// Destructure the required environment variables from process.env
const {
	DISCORD_TOKEN,
	DISCORD_CLIENT_ID,
	DISCORD_GUILD_ID,
	DISCORD_ALLOWED_ROLES,
	DISCORD_BYPASS_ROLES,
	MCS_BASE_URL,
	MCS_API_KEY
} = process.env;

// Check if the required environment variables are present
if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID) {
	throw new Error('Missing environment variables');
}

// Export the configuration object
export const config = {
	DISCORD_TOKEN,
	DISCORD_CLIENT_ID,
	DISCORD_GUILD_ID,
	DISCORD_ALLOWED_ROLES,
	DISCORD_BYPASS_ROLES,
	MCS_BASE_URL,
	MCS_API_KEY,
	SERVERS
};

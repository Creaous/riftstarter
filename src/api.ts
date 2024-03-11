import axios from 'axios';
import { config } from './config';

/**
 * Finds a server by name.
 * @param name - The name of the server.
 * @returns The server object if found, otherwise null.
 */
export async function findServer(name: string) {
	const server = config.SERVERS[name.toLowerCase()];
	if (!server) {
		return null;
	}
	return server;
}

/**
 * Retrieves the list of servers for a given remote UUID.
 *
 * @param remote_uuid - The UUID of the remote service.
 * @returns A promise that resolves to the server data or an error response.
 */
export async function getServers(remote_uuid: string) {
	try {
		const res = await axios.get(
			`${config.MCS_BASE_URL}/api/service/remote_service_instances`,
			{
				params: {
					apikey: config.MCS_API_KEY,
					remote_uuid: remote_uuid,
					page: 1,
					page_size: 50,
					instance_name: ''
				}
			}
		);
		return res.data;
	} catch (error: any) {
		return error.response.data;
	}
}

/**
 * Retrieves server data from the API.
 * @param server - The server object containing the necessary UUIDs.
 * @returns A promise that resolves to the server data.
 */
export async function getServer(server: any) {
	try {
		const res = await axios.get(`${config.MCS_BASE_URL}/api/instance`, {
			params: {
				apikey: config.MCS_API_KEY,
				remote_uuid: server.remote_uuid,
				uuid: server.uuid
			}
		});
		return res.data;
	} catch (error: any) {
		console.log(error);
		return error.response.data;
	}
}

/**
 * Starts a server.
 * @param server - The server object.
 * @returns The response data if successful, otherwise the error response data.
 */
export async function startServer(server: any) {
	try {
		const res = await axios.get(
			`${config.MCS_BASE_URL}/api/protected_instance/open`,
			{
				params: {
					apikey: config.MCS_API_KEY,
					remote_uuid: server.remote_uuid,
					uuid: server.uuid
				}
			}
		);
		return res.data;
	} catch (error: any) {
		return error.response.data;
	}
}

/**
 * Stops a server.
 * @param server - The server object.
 * @returns The response data if successful, otherwise the error response data.
 */
export async function stopServer(server: any) {
	try {
		const res = await axios.get(
			`${config.MCS_BASE_URL}/api/protected_instance/stop`,
			{
				params: {
					apikey: config.MCS_API_KEY,
					remote_uuid: server.remote_uuid,
					uuid: server.uuid
				}
			}
		);
		return res.data;
	} catch (error: any) {
		return error.response.data;
	}
}

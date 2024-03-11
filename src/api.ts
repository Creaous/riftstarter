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
 * Get remote instances.
 * @param server - The server object.
 * @returns The response data if successful, otherwise the error response data.
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
 * Get remote instances.
 * @param server - The server object.
 * @returns The response data if successful, otherwise the error response data.
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

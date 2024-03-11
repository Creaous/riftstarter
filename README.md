# RiftStarter

A Discord bot made to interact with the
[MCSManager](https://github.com/MCSManager/MCSManager) API.

## Commands

-   **/ping** - Replies with Pong!
-   **/start** - Starts a requested server.
-   **/stop** - Stops a requested server.
-   **/status** - Get status of a requested server.
-   **/list** - Lists all servers.

## Setup

## Prerequisites

-   Node.js 18
-   Yarn (npx yarn)
-   Discord
-   MCSManager

## Preparation

1. Create a Discord bot at
   [discord.com/developers](https://discord.com/developers).
2. Go to the `Bot` section and copy the token for later.
3. Uncheck `Public Bot` to prevent unknown guilds.
4. Go to the `OAuth2` section and do the following:
    - Check:
        - bot
        - applications.commands
5. Copy the newly generated link for later.
6. Scroll up and copy the Client ID (for later).
7. Go to the following URL (`<MCS>` is your manager url):
    - `<MCS>/#/private`
8. Click `Generate API Token` and copy the value for later.

## Retrieve Servers

1. Go to your MCSManager panel `Overview` page.
2. Do CTRL+SHIFT+I and go to the Network tab.
3. Go to the `Applications` page on the panel.
4. Look for a request `remote_service_instances`.
    - Copy the part after `?remote_uuid=` and before `&`.
5. View the response of that request.
6. Copy any instance UUIDs that you need.

## Instructions

1. Clone the Git repository.
2. Install the dependencies with `yarn install`.
3. Copy the `.env.example` file to `.env`.
4. Edit the `.env` file with your earlier saved values.
5. Copy the `servers.json.example` file to `servers.json`.
6. Edit the `servers.json` file with your earlier saved values.
7. Run `yarn dev` to start the bot in development mode.
8. Add it to your server using the URL generated earlier.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to
discuss what you would like to change.

## License

This project is licensed under the MIT License.

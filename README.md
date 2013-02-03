# mc-proxy

Allows you to have a Minecraft server in online mode for a whitelist
of players, making it possible to have protected and unprotected accounts
at the same time.

The primary motivation for this software is to have a Minecraft server in
which players' accounts are protected, but players and/or the server is
free to spin up bots with arbitrary usernames to join the server.

## Setup

1. Get a minecraft server running on a port other than the one that you want
   people to connect to. Set the `server-ip` to `127.0.0.1`.
2. Run mc-proxy with the port that you want players to connect to.

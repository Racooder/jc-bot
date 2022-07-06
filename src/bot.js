const { readdirSync } = require('fs');
const { Client, Collection, Intents } = require('discord.js');
require('dotenv').config();

/**
 * The discord client
 */
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// * Event Setup
const eventFiles = readdirSync('src/events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

// * Command Setup
client.commands = new Collection();
const commandFiles = readdirSync('src/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    if (!command.data) continue;
    client.commands.set(command.data.name, command);
}

// * Client Login
client.login(process.env.TOKEN);

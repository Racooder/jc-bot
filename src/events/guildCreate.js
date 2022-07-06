const { updateGuild } = require("../deploy-commands");
const { Guild } = require("discord.js");
const log = require("../log.js");

/**
 * The event when the bot is added to a guild.
 */
module.exports = {
	/**
	 * The name of the event
	 */
	name: 'guildCreate',
	/**
	 * If the event is executed once
	 */
	once: false,
	/**
	 * Handles the guildCreate event
	 * @param {Guild} guild - The joined guild
	 */
	async execute(guild) {
		updateGuild([guild.id]);
		log.log(`Joined the guild ${guild.name} and successfully deployed the commands!`);
	},
};

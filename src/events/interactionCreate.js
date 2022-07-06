const { readdirSync, existsSync } = require('fs');
const { CommandInteraction } = require('discord.js');
const { report, reportFlags } = require('../report');
const log = require('../log.js');

const buttonFiles = readdirSync('src/buttons').filter(file => file.endsWith('.js'));

/**
 * The event when the bot recieves a interaction.
 */
module.exports = {
    /**
     * The name of the event
     */
    name: 'interactionCreate',
    /**
     * Handles the given interaction
     * @param {CommandInteraction} interaction - The interaction object
     */
    async execute(interaction) {
        // * Button Handling
        if (interaction.isButton()) {
            let args = interaction.customId.split('_');
            const id = args.shift();

            if (existsSync(`src/buttons/${id}.js`)) {
                const button = require(`./buttons/${id}`);
                await button.execute(interaction, args);
            } else {
                for (const file of buttonFiles) {
                    const button = require(`../buttons/${file}`);
                    if (id === button.id) {
                        button.execute(interaction, args);
                    }
                }
            }
        }

        // * Command Handling
        if (interaction.isCommand()) {
            const command = interaction.client.commands.get(interaction.commandName); // Get the corresponding command for the command interaction

            if (!command) return;

            try {
                await command.execute(interaction);
            } catch (err) {
                report(
                    interaction.client,
                    interaction.user.username,
                    interaction.user.displayAvatarURL(),
                    `${interaction.user.username} tried to use the \`${interaction.commandName}\` command, but an error occured!`,
                    [{ name: err.name, value: err.message }, { name: 'Stack Trace', value: err.stack }],
                    reportFlags.error
                );
                log.error(err.name);
                log.error(err.message);
                log.error(err.stack);
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    },
};

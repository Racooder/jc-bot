const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, CommandInteraction } = require('discord.js');

module.exports = {
    guildOnly: false,
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Sends a latency report!'),
    /**
     * 
     * @param {CommandInteraction} interaction - The interaction object
     */
    async execute(interaction) {
        await interaction.deferReply()
        const pong = await interaction.fetchReply();
        const latency = pong.createdTimestamp - interaction.createdTimestamp;

        const pongMessage = new MessageEmbed()
            .addFields(
                {
                    name: ':stopwatch: Latency',
                    value: `${latency}ms`
                },
                {
                    name: ':hourglass: API Latency',
                    value: `${Math.round(interaction.client.ws.ping)}ms`
                }
            );

        await interaction.editReply({ embeds: [pongMessage] });
    },
};

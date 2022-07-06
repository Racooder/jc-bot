const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, Permissions } = require('discord.js');

module.exports = {
    guildOnly: true,
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kicks a user from the server!')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to kick')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for the kick')),
    /**
     * 
     * @param {CommandInteraction} interaction - The interaction object
     */
    async execute(interaction) {
        const targetId = interaction.options.getUser('user').id;
        if (!interaction.guild.members.cache.has(targetId))
            return interaction.reply({ content: 'This user is not in this server!', empheral: true });
        const user = interaction.member;
        if (user.id === targetId)
            return interaction.reply({ content: 'You can\'t kick yourself!', empheral: true });
        if (!user.permissions.has(Permissions.FLAGS.KICK_MEMBERS))
            return interaction.reply({ content: 'You do not have the permissions to kick other users!', empheral: true });
        const target = await interaction.guild.members.fetch(targetId);
        if (!target.kickable)
            return interaction.reply({ content: 'This user is not kickable!', empheral: true });
        const reason = interaction.options.getString('reason');

        target.kick(reason);
    },
};

const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, Permissions } = require('discord.js');
const ms = require('ms');

module.exports = {
     guildOnly: true,
     data: new SlashCommandBuilder()
          .setName('mute')
          .setDescription('Mutes a user!')
          .addUserOption(option =>
               option.setName('user')
                    .setDescription('The user to mute')
                    .setRequired(true))
          .addStringOption(option =>
               option.setName('time')
                    .setDescription('Intervals shorter than two minutes can be very inexact. (default: forever)'))
          .addStringOption(option =>
               option.setName('reason')
                    .setDescription('The reason for the ban')),

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
               return interaction.reply({ content: 'You can\'t mute yourself!', empheral: true });
          if (!user.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS))
               return interaction.reply({ content: 'You do not have the permissions to mute other users!', empheral: true });
          const target = await interaction.guild.members.fetch(targetId);
          const reason = interaction.options.getString('reason');
          const timeString = interaction.options.getString('time') || 'forever';

          let muteTime = ms(timeString);

          if (!muteTime) {
               return interaction.reply({ content: 'No valid mute time!', empheral: true })
          }
          
          try {
               target.timeout(muteTime, reason);
               return interaction.reply({ content: `${interaction.user.tag} muted ${target.user.tag} for ${timeString}!`, empheral: true });
          } catch (_) {
               return interaction.reply({ content: 'Cannot mute this user!', empheral: true });
          }
     },
};

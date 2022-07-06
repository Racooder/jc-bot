const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, Permissions, MessageEmbed } = require('discord.js');

module.exports = {
     guildOnly: true,
     data: new SlashCommandBuilder()
          .setName('ban')
          .setDescription('Bans a user from the server!')
          .addUserOption(option =>
               option.setName('user')
                    .setDescription('The user to ban')
                    .setRequired(true))
          .addStringOption(option =>
               option.setName('reason')
                    .setDescription('The reason for the ban'))
          .addIntegerOption(option =>
               option.setName('clear')
                    .setDescription('The amount of days to delete the messages (default: 0)')
                    .setMinValue(0)
                    .setMaxValue(7)),

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
               return interaction.reply({ content: 'You can\'t ban yourself!', empheral: true });
          if (!user.permissions.has(Permissions.FLAGS.BAN_MEMBERS))
               return interaction.reply({ content: 'You do not have the permissions to ban other users!', empheral: true });
          const target = await interaction.guild.members.fetch(targetId);
          if (!target.bannable)
               return interaction.reply({ content: 'This user is not bannable!', empheral: true });
          const reason = interaction.options.getString('reason');
          const clear = interaction.options.getInteger('clear') || 0;

          try {
               const result = await interaction.guild.bans.fetch(targetId);
               if (result)
                    return interaction.reply({ content: 'This user is already banned!', empheral: true });
          } catch (err) {

          }

          target.ban({ days: clear, reason: reason });
          const embed = new MessageEmbed()
               .setColor(0x852321)
               .setTitle(`${interaction.user.tag} banned ${target.user.tag}!`)
               .addFields([
                    {
                         name: 'Reason', 
                         value: reason || 'No reason given', 
                    },
                    {
                         name: 'Cleared Messages', 
                         value: clear ? `${clear} days` : 'No messages cleared',
                    },
               ]);
          return interaction.reply({ embeds: [embed] , empheral: true });
     },
};

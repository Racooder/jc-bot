const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, MessageEmbed } = require('discord.js');

module.exports = {
     guildOnly: true,
     data: new SlashCommandBuilder()
          .setName('warn')
          .setDescription('Warns a user!')
          .addUserOption(option =>
               option.setName('user')
                    .setDescription('The user to warn')
                    .setRequired(true))
          .addStringOption(option =>
               option.setName('reason')
                    .setDescription('The reason for the warning')),
     /**
      * 
      * @param {CommandInteraction} interaction - The interaction object
      */
     async execute(interaction) {
          const targetId = interaction.options.getUser('user').id;
          if (!interaction.guild.members.cache.has(targetId))
               return interaction.reply({ content: 'This user is not in this server!', empheral: true });
          const target = interaction.guild.members.cache.get(targetId);
          if (interaction.user.id === targetId)
               return interaction.reply({ content: 'You cannot warn yourself!', empheral: true });
          const reason = interaction.options.getString('reason');

          target.send(`You have been warned in ${interaction.guild.name} for: ${interaction.options.getString('reason')}`);
          const embed = new MessageEmbed()
               .setAuthor({ name: `${target.user.tag} has been warned!`, iconURL: target.user.displayAvatarURL() })
               .setDescription(`**Reason:** ${reason}`);
          await interaction.reply({ embeds: [embed] });
     },
};

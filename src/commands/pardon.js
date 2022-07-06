const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, MessageEmbed, Permissions } = require('discord.js');

module.exports = {
     guildOnly: true,
     data: new SlashCommandBuilder()
          .setName('pardon')
          .setDescription('Revokes a user\'s ban!')
          .addStringOption(option =>
               option.setName('id')
                    .setDescription('The id of the user to pardon'))
          .addStringOption(option =>
               option.setName('username')
                    .setDescription('The user to pardon'))
          .addStringOption(option =>
               option.setName('discriminator')
                    .setDescription('The discriminator of the user to pardon'))
          .addStringOption(option =>
               option.setName('reason')
                    .setDescription('The reason for the pardon')),
     /**
      * 
      * @param {CommandInteraction} interaction - The interaction object
      */
     async execute(interaction) {
          const targetId = interaction.options.getString('id');
          const targetName = interaction.options.getString('username');
          let targetDiscriminator = interaction.options.getString('discriminator');
          if (targetDiscriminator && targetDiscriminator[0] === '#')
               targetDiscriminator = targetDiscriminator.substring(1);
          if (!targetId && !targetName)
               return interaction.reply({ content: 'You must provide a username or id!', empheral: true });
          const user = interaction.member;
          if (user.id === targetId)
               return interaction.reply({ content: 'You can\'t pardon yourself!', empheral: true });
          if (!user.permissions.has(Permissions.FLAGS.BAN_MEMBERS))
               return interaction.reply({ content: 'You do not have the permissions to pardon other users!', empheral: true });
          const reason = interaction.options.getString('reason');

          const bans = await interaction.guild.bans.fetch();
          const targetedBans = bans.filter(ban => ban.user.id === targetId || ban.user.username.toLowerCase() === targetName.toLowerCase() || ban.user.discriminator === targetDiscriminator);
          if (targetedBans.size > 1) {
               const embed = new MessageEmbed()
                    .setTitle('Multiple bans found!')
                    .setDescription('Please provide more specific information.')
               for (const [banKey, banValue] of bans) {
                    embed.addField(`${banKey}`, `${banValue.user.username}#${banValue.user.discriminator}`);
               }
               return interaction.reply({ embeds: [embed] });
          }
          else {
               const ban = targetedBans.first();
               if (!ban)
                    return interaction.reply({ content: 'No ban found!', empheral: true });
               const result = await interaction.guild.members.unban(ban.user.id, reason);
               if (result) {
                    const embed = new MessageEmbed()
                         .setTitle('Pardoned!')
                         .setDescription(`${result.username}#${result.discriminator} has been pardoned!`)
                         .setColor(0x198C34)
                         .setTimestamp();
                    return interaction.reply({ embeds: [embed], empheral: true  });
               }
               else {
                    return interaction.reply({ content: 'Failed to pardon user!', empheral: true });
               }
          }
     },
};

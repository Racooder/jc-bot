const { MessageEmbed, Client } = require('discord.js');
require('dotenv').config();

module.exports = {
    /**
     * Reports a bug to the developers
     * @param {Client} client - The discord client
     * @param {String} username - The username of the user
     * @param {String} avatar - The avatar of the user
     * @param {String} description - The description of the bug
     * @param {[{ name: String, value: String}]} fields - The fields of the embed
     * @param {Number} reportFlag - The type of the bug
     */
    report: (client, username, avatar, description, fields = [], reportFlag = module.exports.reportFlags.error) => {
        const embed = new MessageEmbed()
            .setAuthor({ name: username, iconURL: avatar })
            .setDescription(description);

        switch (reportFlag) {
            case (module.exports.reportFlags.error): {
                embed.setTitle("Runtime Error");
                embed.setColor(0x852321);
                break;
            }
            default: {
                embed.setTitle("Unknown Report");
                embed.setColor(0xE2CCF2);
                break;
            }
        }

        for (const field of fields) {
            embed.addField(field.name, field.value);
        }

        client.channels.cache.get(process.env.REPORT_CHANNEL_ID).send({ embeds: [embed] });
    },
    reportFlags: {
        error: 0
    }
}

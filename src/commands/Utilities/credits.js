const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('credits')
		.setDescription('Get the credits for the bot'),

	async execute(interaction, client) {
		const { guild } = interaction;
		const embed = new EmbedBuilder()
			.setAuthor({
				name: `${client.user.tag}`,
				iconURL: `${client.user.displayAvatarURL()}`,
			})
			.setColor(client.config.theme.color)
			.setTitle('Bot Credits')
			.setDescription(
				'**[Sarkosis#3052](https://sarksdevelopment.com)** - Writing Source Code.\n**[Hyperz#0001](https://store.hyperz.net)** - Partial Idea behind styling of giveaway embed (Buttons).\n**[GiveawayBot](https://giveawaybot.party/invite)** - Partial Idea behind styling of giveaway embed (Embed Format).',
			)
			.setThumbnail(guild.iconURL())
			.setFooter({
				text: guild.name,
				iconURL: guild.iconURL({ dynamic: true }),
			})
			.setTimestamp();

		return interaction.reply({
			embeds: [embed],
			ephemeral: true,
		});
	},
};

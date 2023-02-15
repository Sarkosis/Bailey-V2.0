const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Stop the bot from discord'),
	async execute(interaction, client) {
		if (!client.config.owners.includes(interaction.member.id)) {
			return interaction.reply({
				content: 'Only the bot owners can use this command!',
				ephemeral: true,
			});
		}
		await interaction.reply({
			content: 'Stopping...',
			ephemeral: true,
		});
		client.destroy();
	},
};

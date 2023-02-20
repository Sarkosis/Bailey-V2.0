const { SlashCommandBuilder } = require('discord.js');
const answers = [
	'Maybe.',
	'Certainly not.',
	'I hope so.',
	'Not in your wildest dreams.',
	'There is a good chance.',
	'Quite likely.',
	'I think so.',
	'I hope not.',
	'I hope so.',
	'Never!',
	'Fuhgeddaboudit.',
	'Ahaha! Really?!?',
	'Pfft.',
	'Sorry, bucko.',
	'Hell, yes.',
	'Hell to the no.',
	'The future is bleak.',
	'The future is uncertain.',
	'I would rather not say.',
	'Who cares?',
	'Possibly.',
	'Never, ever, ever.',
	'There is a small chance.',
	'Yes!',
];

module.exports = {
	data: new SlashCommandBuilder()
		.setName('8ball')
		.setDescription('Ask the magic 8ball a question.')
		.addStringOption((option) =>
			option
				.setName('question')
				.setDescription('Ask your question...')
				.setRequired(false),
		),

	async execute(interaction, client) {
		const question = interaction.options.getString('question');
		if (!question || question == null || question == undefined) {
			return interaction.reply({
				content: 'You need to ask me a **question**',
				ephemeral: true,
			});
		}
		return interaction.reply({
			content: `**Question:** ${question}\n🎱 ${
				answers[Math.floor(Math.random() * answers.length)]
			}`,
			ephemeral: true,
		});
	},
};

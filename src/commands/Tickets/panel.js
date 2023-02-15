const {
	SlashCommandBuilder,
	ChannelType,
	PermissionFlagsBits,
} = require('discord.js');
const { tickets } = require('../../../Settings/config').modules;
module.exports = {
	data: new SlashCommandBuilder()
		.setName('panel')
		.setDescription('Ticket panel options')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addSubcommand((sub) =>
			sub
				.setName('add-ticket')
				.setDescription('Add a new ticket category')
				.addStringOption((option) =>
					option
						.setName('name')
						.setDescription('The ticket name')
						.setRequired(true),
				)
				.addStringOption((option) =>
					option
						.setName('description')
						.setDescription('The ticket description')
						.setRequired(true),
				),
		)
		.addSubcommand((sub) =>
			sub
				.setName('remove-ticket')
				.setDescription('Remove a ticket category')
				.addStringOption((option) =>
					option
						.setName('name')
						.setDescription('The ticket name')
						.setRequired(true),
				),
		)
		.addSubcommand((sub) =>
			sub
				.setName('send')
				.setDescription('Send the ticket panel')
				.addChannelOption((option) =>
					option
						.setName('channel')
						.setDescription('The ticket name')
						.addChannelTypes(ChannelType.GuildText)
						.setRequired(true),
				),
		),
	async execute(interaction, client) {
		if (tickets == false) {
			return interaction.reply({
				content: 'The ticket module was disabled.',
				ephemeral: client.utils.ephemeral(client),
			});
		}
		const { guild, options } = interaction;
		const sub = options.getSubcommand();
		const name = options.getString('name');
		const description = options.getString('description');
		const channel = options.getChannel('channel');
		switch (sub) {
		case 'add-ticket':
			{
				client.tickets.addTicket(
					interaction,
					client,
					guild,
					name,
					description,
				);
			}
			break;
		case 'remove-ticket':
			{
				client.tickets.removeTicket(interaction, client, guild, name);
			}
			break;
		case 'send':
			{
				client.tickets.sendTickets(interaction, client, guild, channel);
			}
			break;

		default:
			break;
		}
	},
};

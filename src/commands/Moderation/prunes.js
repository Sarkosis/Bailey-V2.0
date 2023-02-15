const {
	SlashCommandBuilder,
	ChannelType,
	EmbedBuilder,
} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('prune')
		.setDescription('Prune up to 100 messages within the last 14 days!')
		.addSubcommand((sub) =>
			sub
				.setName('channel')
				.setDescription('Prune messages from a single within the past 14 days')
				.addChannelOption((o) =>
					o
						.setName('channel')
						.setDescription('Select a channel')
						.addChannelTypes(ChannelType.GuildText)
						.setRequired(true),
				)
				.addNumberOption((o) =>
					o
						.setName('amount')
						.setDescription('Enter an amount of message to prune')
						.setMinValue(1)
						.setMaxValue(100)
						.setRequired(true),
				)
				.addStringOption((o) =>
					o
						.setName('reason')
						.setDescription('Enter the reason for the pruning')
						.setRequired(false),
				),
		)
		.addSubcommand((sub) =>
			sub
				.setName('category')
				.setDescription(
					'Prune messages for all channels from a single category within the past 14 days',
				)
				.addChannelOption((o) =>
					o
						.setName('category')
						.setDescription('Select a category')
						.addChannelTypes(ChannelType.GuildCategory)
						.setRequired(true),
				)
				.addNumberOption((o) =>
					o
						.setName('amount')
						.setDescription('Enter an amount of message to prune (Per Channel)')
						.setMinValue(1)
						.setMaxValue(100)
						.setRequired(true),
				)
				.addStringOption((o) =>
					o
						.setName('reason')
						.setDescription('Enter the reason for the pruning')
						.setRequired(false),
				),
		),

	async execute(interaction, client) {
		const { guild, member, options } = interaction;
		const category = options.getChannel('category');
		const channel = options.getChannel('channel');
		const amount = options.getNumber('amount');
		const reason = options.getString('reason') || 'No reason provided.';
		const sub = options.getSubcommand();
		await client.connection.query(
			`SELECT * FROM modperms WHERE GuildID = '${guild.id}'`,
			async (e, rows) => {
				if (e) {
					if (client.config.bot.debugMode) {
						console.log(e);
					}
					return interaction.reply({
						content: '`Database Error Occured`',
						ephemeral: true,
					});
				}
				const roles = [];
				for (const data of rows) {
					roles.push(data?.RoleID);
				}
				if (roles.length === 0) {
					return interaction.reply({
						content: '`No guild moderation permissions found!`',
						ephemeral: true,
					});
				}
				let result = false;
				await member.roles.cache.each((r) => {
					const rolecheck = roles.includes(r.id);
					if (rolecheck == true) {
						result = true;
					}
				});
				if (result == false) {
					return interaction.reply({
						content: '`You don\'t have any staff roles in this guild`',
						ephemeral: true,
					});
				}
				switch (sub) {
				case 'channel':
					{
						let delmessages = 0;
						await channel
							.bulkDelete(amount)
							.then((messages) => {
								delmessages = messages.size;
							})
							.catch(() => {});
						await client.connection.query(
							'SELECT count(CaseID) as total FROM prunes',
							async (e, results) => {
								if (e) {
									if (client.config.bot.debugMode) {
										console.log(e.stack);
									}
								}
								const embed = new EmbedBuilder()
									.setColor(client.config.theme.color)
									.setAuthor({
										name: 'Action Logs - Pruned Messages',
										iconURL: client.user.displayAvatarURL({
											dyanmic: true,
										}),
									})
									.setTitle('Pruned Messages')
									.setDescription(
										`**Staff Member:** <@${member.id}> - (${member.id})\n**Channel:** <#${channel.id}> - (${channel.id})\n**Selected Amount:** ${amount}\n**Pruned Amount:** ${delmessages}\n**Reason:** ${reason}`,
									)
									.setThumbnail(guild.iconURL({ dyanmic: true }))
									.setFooter({
										text: `Case #${results[0]?.total + 1}`,
										iconURL: client.user.displayAvatarURL({
											dyanmic: true,
										}),
									})
									.setTimestamp();
								await interaction.reply({
									content: 'Prune successfull!',
									ephemeral: true,
								});
								const m = await interaction.channel
									.send({ embeds: [embed] })
									.catch(() => {});
								setTimeout(async () => {
									await m.delete();
								}, 10000);
								await client.connection.query(
									`INSERT INTO prunes (GuildID, PruneType, StaffID, ChannelID, MessageCount, Reason) VALUES ('${guild.id}', 'Channel', '${member.id}', '${channel.id}', '${amount}', "${reason}")`,
									async (er) => {
										if (er) {
											if (client.config.bot.debugMode) {
												console.log(er.stack);
											}
										}
									},
								);
								await client.connection.query(
									`SELECT * FROM guildlogging WHERE GuildID = '${guild.id}'`,
									async (er, row) => {
										if (er) {
											if (client.config.bot.debugMode) {
												console.log(er.stack);
											}
										}
										if (row[0]?.GuildID) {
											const thechan = await guild.channels.cache.get(
												row[0]?.ModLogs,
											);
											if (thechan?.id) {
												await thechan
													?.send({ embeds: [embed] })
													.catch(() => {});
											}
										}
									},
								);
							},
						);
					}
					break;
				case 'category':
					{
						let delmessages = 0;
						await category.children.cache.each(async (chan) => {
							await chan
								.bulkDelete(amount)
								.then((messages) => {
									delmessages = delmessages + messages.size;
								})
								.catch((e) => {
									console.log(e);
								});
							await client.connection.query(
								'SELECT count(CaseID) as total FROM prunes',
								async (e, results) => {
									if (e) {
										if (client.config.bot.debugMode) {
											console.log(e.stack);
										}
									}
									const embed = new EmbedBuilder()
										.setColor(client.config.theme.color)
										.setAuthor({
											name: 'Action Logs - Pruned Messages',
											iconURL: client.user.displayAvatarURL({
												dyanmic: true,
											}),
										})
										.setTitle('Pruned Messages')
										.setDescription(
											`**Staff Member:** <@${member.id}> - (${member.id})\n**Category:** <#${category.id}> - (${category.id})\n**Affected Channels:** ${category.children.cache.size}\n**Selected Amount:** ${amount}\n**Pruned Amount:** ${delmessages}\n**Reason:** ${reason}`,
										)
										.setThumbnail(guild.iconURL({ dyanmic: true }))
										.setFooter({
											text: `Case #${results[0]?.total + 1}`,
											iconURL: client.user.displayAvatarURL({
												dyanmic: true,
											}),
										})
										.setTimestamp();
									await interaction
										.reply({
											content: 'Prune successfull!',
											ephemeral: true,
										})
										.catch(() => {});
									const m = await interaction.channel
										.send({ embeds: [embed] })
										.catch(() => {});
									setTimeout(async () => {
										await m.delete();
									}, 10000);
									await client.connection.query(
										`INSERT INTO prunes (GuildID, PruneType, StaffID, ChannelID, MessageCount, Reason) VALUES ('${guild.id}', 'Category', '${member.id}', '${category.id}', '${amount}', "${reason}")`,
										async (er) => {
											if (er) {
												if (client.config.bot.debugMode) {
													console.log(er.stack);
												}
											}
										},
									);
									await client.connection.query(
										`SELECT * FROM guildlogging WHERE GuildID = '${guild.id}'`,
										async (er, row) => {
											if (er) {
												if (client.config.bot.debugMode) {
													console.log(er.stack);
												}
											}
											if (row[0]?.GuildID) {
												const thechan = await guild.channels.cache.get(
													row[0]?.ModLogs,
												);
												if (thechan?.id) {
													await thechan
														?.send({ embeds: [embed] })
														.catch(() => {});
												}
											}
										},
									);
								},
							);
						});
					}
					break;
				default:
					break;
				}
			},
		);
	},
};

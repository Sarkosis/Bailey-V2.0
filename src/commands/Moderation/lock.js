const {
	SlashCommandBuilder,
	ChannelType,
	EmbedBuilder,
} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lock')
		.setDescription('Lockdown Commands')
		.addSubcommandGroup((subg) =>
			subg
				.setName('add')
				.setDescription('Add a lockdown')
				.addSubcommand((sub) =>
					sub
						.setName('channel')
						.setDescription('Lockdown a channel')
						.addChannelOption((option) =>
							option
								.setName('channel')
								.setDescription('Select a channel')
								.addChannelTypes(ChannelType.GuildText)
								.setRequired(false),
						)
						.addStringOption((option) =>
							option
								.setName('reason')
								.setDescription('Reason for lockdown')
								.setRequired(false),
						),
				)
				.addSubcommand((sub) =>
					sub
						.setName('category')
						.setDescription('Lockdown all channels within a category')
						.addChannelOption((option) =>
							option
								.setName('category')
								.setDescription('Select a category')
								.addChannelTypes(ChannelType.GuildCategory)
								.setRequired(true),
						)
						.addStringOption((option) =>
							option
								.setName('reason')
								.setDescription('Reason for lockdown')
								.setRequired(false),
						),
				),
		)
		.addSubcommandGroup((subg) =>
			subg
				.setName('remove')
				.setDescription('Remove a lockdown')
				.addSubcommand((sub) =>
					sub
						.setName('channel')
						.setDescription('Remove the lockdown on a channel')
						.addChannelOption((option) =>
							option
								.setName('channel')
								.setDescription('Select a channel')
								.addChannelTypes(ChannelType.GuildText)
								.setRequired(false),
						),
				)
				.addSubcommand((sub) =>
					sub
						.setName('category')
						.setDescription('Unlock all channels within a category')
						.addChannelOption((option) =>
							option
								.setName('category')
								.setDescription('Select a category')
								.addChannelTypes(ChannelType.GuildCategory)
								.setRequired(true),
						),
				),
		),

	async execute(interaction, client) {
		const { guild, member } = interaction;
		const sub = interaction.options.getSubcommand();
		const subg = interaction.options.getSubcommandGroup();
		const reason =
      interaction.options.getString('reason') || 'No reason provided.';
		const channel =
      interaction.options.getChannel('channel') || interaction.channel;
		const category = interaction.options.getChannel('category');
		await client.connection.query(
			`SELECT * FROM modperms WHERE GuildID = '${guild.id}'`,
			async (e, rows) => {
				if (e) {
					if (client.config.bot.debugMode) {
						console.log(e.stack);
					}
				}
				const roles = [];
				for (const data of rows) {
					roles.push(data?.RoleID);
				}
				if (roles.length === 0) {
					return interaction.reply({
						content: 'No moderation roles found!',
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
						content: 'You don\'t have permissions to do this!',
						ephemeral: true,
					});
				}
				switch (subg) {
				case 'add':
					{
						switch (sub) {
						case 'channel':
							{
								await channel.permissionOverwrites.edit(guild.id, {
									SendMessages: false,
								});
								await client.connection.query(
									'SELECT COUNT(*) as total FROM locks',
									async (er, results) => {
										if (er) {
											if (client.conifg.bot.debugMode) {
												console.log(er.stack);
											}
										}
										const caseid = results[0]?.total + 1;
										await client.connection.query(
											`INSERT INTO locks (GuildID, CaseID, LockType, StaffID, ChannelID, Reason) VALUES ('${guild.id}', '${caseid}', 'Channel', '${member.id}', '${channel.id}', "${reason}")`,
											async (err) => {
												if (err) {
													if (client.config.bot.debugMode) {
														console.log(err.stack);
													}
												}
											},
										);
										await client.connection.query(
											`SELECT * FROM guildlogging WHERE GuildID = '${guild.id}'`,
											async (err, row) => {
												if (err) {
													if (client.config.bot.debugMode) {
														console.log(err.stack);
													}
												}
												if (row[0]?.GuildID) {
													const logchan = await guild.channels.cache.get(
														row[0]?.ModLogs,
													);
													await interaction
														.reply({
															content: 'Channel locked successfully!',
															ephemeral: true,
														})
														.catch(() => {});
													const logembed = new EmbedBuilder()
														.setColor(client.config.theme.color)
														.setAuthor({
															name: 'Action Logs - Channel Locked',
															iconURL: client.user.displayAvatarURL({
																dyanmic: true,
															}),
														})
														.setTitle('Locked Channel')
														.setDescription(
															`**Staff Member:** <@${member.id}> - (${member.id})\n**Channel:** <#${channel.id}> - (${channel.id})\n**Reason:** ${reason}`,
														)
														.setThumbnail(guild.iconURL({ dyanmic: true }))
														.setFooter({
															text: `Case #${results[0]?.total + 1}`,
															iconURL: client.user.displayAvatarURL({
																dyanmic: true,
															}),
														})
														.setTimestamp();
													const m = await interaction.channel
														.send({ embeds: [logembed] })
														.catch(() => {});
													setTimeout(async () => {
														await m.delete();
													}, 10000);
													await logchan
														?.send({ embeds: [logembed] })
														.catch(() => {});
												}
											},
										);
									},
								);
							}

							break;
						case 'category':
							{
								category.children.cache.each((child) =>
									child.permissionOverwrites.edit(guild.id, {
										SendMessages: false,
									}),
								);
								await client.connection.query(
									'SELECT COUNT(*) as total FROM locks',
									async (er, results) => {
										if (er) {
											if (client.conifg.bot.debugMode) {
												console.log(er.stack);
											}
										}
										const caseid = results[0]?.total + 1;
										await client.connection.query(
											`INSERT INTO locks (GuildID, CaseID, LockType, StaffID, ChannelID, Reason) VALUES ('${guild.id}', '${caseid}', 'Category', '${member.id}', '${category.id}', "${reason}")`,
											async (err) => {
												if (err) {
													if (client.config.bot.debugMode) {
														console.log(err.stack);
													}
												}
											},
										);
										await client.connection.query(
											`SELECT * FROM guildlogging WHERE GuildID = '${guild.id}'`,
											async (err, row) => {
												if (err) {
													if (client.config.bot.debugMode) {
														console.log(err.stack);
													}
												}
												if (row[0]?.GuildID) {
													const logchan = await guild.channels.cache.get(
														row[0]?.ModLogs,
													);
													await interaction
														.reply({
															content: `${category.children.cache.size} channel(s) locked successfully!`,
															ephemeral: true,
														})
														.catch(() => {});
													const logembed = new EmbedBuilder()
														.setColor(client.config.theme.color)
														.setAuthor({
															name: 'Action Logs - Category Locked',
															iconURL: client.user.displayAvatarURL({
																dyanmic: true,
															}),
														})
														.setTitle('Locked Category')
														.setDescription(
															`**Staff Member:** <@${member.id}> - (${member.id})\n**Category:** <#${category.id}> - (${category.id})\n**Locked Channel(s):** ${category.children.cache.size}\n**Reason:** ${reason}`,
														)
														.setThumbnail(guild.iconURL({ dyanmic: true }))
														.setFooter({
															text: `Case #${results[0]?.total + 1}`,
															iconURL: client.user.displayAvatarURL({
																dyanmic: true,
															}),
														})
														.setTimestamp();
													const m = await interaction.channel
														.send({ embeds: [logembed] })
														.catch(() => {});
													setTimeout(async () => {
														await m.delete();
													}, 10000);
													await logchan
														?.send({ embeds: [logembed] })
														.catch(() => {});
												}
											},
										);
									},
								);
							}

							break;

						default:
							break;
						}
					}

					break;
				case 'remove':
					{
						switch (sub) {
						case 'channel':
							{
								await channel.permissionOverwrites.edit(guild.id, {
									SendMessages: true,
								});
								await interaction
									.reply({
										content: 'Channel unlocked successfully!',
										ephemeral: true,
									})
									.catch(() => {});
							}

							break;
						case 'category':
							{
								category.children.cache.each((child) =>
									child.permissionOverwrites.edit(guild.id, {
										SendMessages: true,
									}),
								);
								await interaction
									.reply({
										content: `${category.children.cache.size} channel(s) unlocked successfully!`,
										ephemeral: true,
									})
									.catch(() => {});
							}

							break;

						default:
							break;
						}
					}

					break;
				default:
					break;
				}
			},
		);
	},
};

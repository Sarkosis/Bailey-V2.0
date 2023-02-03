const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Setup this guild!")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction, client) {
    let { guild } = interaction;
    await client.connection.query(
      `SELECT * FROM guildlogging WHERE GuildID = '${guild.id}'`,
      async (err, row) => {
        if (err) {
          if (client.config.bot.debugMode == true) {
            console.log(err.stack);
          }
          return interaction.reply({
            content: "`Error has occured.`",
            ephemeral: true,
          });
        }
        if (!row[0]?.GuildID) {
          await client.connection.query(
            `INSERT INTO guildlogging (GuildID, ModLogs, MemberLogs, RoleLogs, ChannelLogs, MessageLogs, WelcomeLogs, LeaveLogs) VALUES ('${guild.id}', '**None Selected**', '**None Selected**', '**None Selected**', '**None Selected**', '**None Selected**', '**None Selected**', '**None Selected**')`,
            async (e) => {
              if (e)
                if (client.config.bot.debugMode == true) {
                  console.log(err.stack);
                }
            }
          );
          let embed = new EmbedBuilder()
            .setColor(client.config.theme.color)
            .setTitle("Getting Started")
            .setDescription(
              "It appears that there is no database setup for this guild.\nPlease start the setup process by selecting start!"
            )
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setFooter({
              text: `${guild.name} settings`,
              iconURL: guild.iconURL({ dynamic: true }),
            })
            .setTimestamp();

          let button = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("start-setup")
              .setLabel("Start")
              .setStyle(ButtonStyle.Success)
          );
          await interaction.reply({
            embeds: [embed],
            components: [button],
            ephemeral: true,
          });
        } else if (row[0]?.GuildID) {
          let embed = new EmbedBuilder()
            .setColor(client.config.theme.color)
            .setTitle("Guild Logging")
            .setDescription(
              `>>> **Mod Logs:** <#${row[0]?.ModLogs}>\n**Role Logs:** <#${row[0]?.RoleLogs}>\n**Channel Logs:** <#${row[0]?.ChannelLogs}>\n**Message Logs:** <#${row[0]?.MessageLogs}>\n**Member Logs:** <#${row[0]?.MemberLogs}>\n**Welcome Logs:** <#${row[0]?.WelcomeLogs}>\n**Leave Logs:** <#${row[0]?.LeaveLogs}>`
            )
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setFooter({
              text: `${guild.name} settings`,
              iconURL: guild.iconURL({ dynamic: true }),
            })
            .setTimestamp();

          let buttonsone = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("mod-logs")
              .setLabel("Mod Logs")
              .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
              .setCustomId("role-logs")
              .setLabel("Role Logs")
              .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
              .setCustomId("channel-logs")
              .setLabel("Channel Logs")
              .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
              .setCustomId("message-logs")
              .setLabel("Message Logs")
              .setStyle(ButtonStyle.Primary)
          );
          let buttonstwo = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("member-logs")
              .setLabel("Member Logs")
              .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
              .setCustomId("welcome-logs")
              .setLabel("Welcome Logs")
              .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
              .setCustomId("leave-logs")
              .setLabel("Leave Logs")
              .setStyle(ButtonStyle.Primary)
          );
          let buttonsthree = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("setup-continue-one")
              .setLabel("Continue")
              .setStyle(ButtonStyle.Danger)
          );
          await interaction.reply({
            embeds: [embed],
            components: [buttonsone, buttonstwo, buttonsthree],
            ephemeral: true,
          });
        }
      }
    );
  },
};

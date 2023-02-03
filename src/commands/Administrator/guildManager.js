const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("manage")
    .setDescription("Guild managing actions")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommandGroup((subg) =>
      subg
        .setName("channels")
        .setDescription("Guild channel manager options")
        .addSubcommand((sub) =>
          sub
            .setName("create")
            .setDescription("Create a channel")
            .addStringOption((option) =>
              option
                .setName("name")
                .setDescription("The channel name")
                .setRequired(true)
            )
            .addStringOption((option) =>
              option
                .setName("type")
                .setDescription("Channel type; default = text")
                .setChoices(
                  { name: "Text", value: "0" },
                  { name: "Voice", value: "2" },
                  { name: "Category", value: "4" },
                  { name: "Forum", value: "15" },
                  { name: "Announcement", value: "5" }
                )
                .setRequired(false)
            )
            .addStringOption((option) =>
              option
                .setName("topic")
                .setDescription("Channel topic; default = none")
                .setRequired(false)
            )
            .addChannelOption((option) =>
              option
                .setName("category")
                .setDescription(
                  "Category channel is created under; default = none"
                )
                .addChannelTypes(ChannelType.GuildCategory)
                .setRequired(false)
            )
        )
        .addSubcommand((sub) =>
          sub
            .setName("delete")
            .setDescription("Create a channel")
            .addChannelOption((option) =>
              option
                .setName("channel")
                .setDescription("Channel to delete; default = current channel")
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(false)
            )
        )
        .addSubcommand((sub) =>
          sub
            .setName("move")
            .setDescription("Move a channel")
            .addChannelOption((option) =>
              option
                .setName("channel")
                .setDescription("Channel to move; default = current channel")
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(false)
            )
            .addChannelOption((option) =>
              option
                .setName("category")
                .setDescription("Category to move channel to; default = none")
                .addChannelTypes(ChannelType.GuildCategory)
                .setRequired(false)
            )
        )
    )
    .addSubcommandGroup((subg) =>
      subg
        .setName("roles")
        .setDescription("Guild role manager options")
        .addSubcommand((sub) =>
          sub
            .setName("create")
            .setDescription("Create a role")
            .addStringOption((option) =>
              option
                .setName("name")
                .setDescription("The role name")
                .setRequired(true)
            )
            .addStringOption((option) =>
              option
                .setName("color")
                .setDescription("Role color; default = white")
                .setRequired(false)
            )
            .addStringOption((option) =>
              option
                .setName("mentionable")
                .setDescription("Should the role be mentionable? default = no")
                .setChoices(
                  { name: "Yes", value: "true" },
                  { name: "No", value: "false" }
                )
                .setRequired(false)
            )
            .addStringOption((option) =>
              option
                .setName("permissions")
                .setDescription("Role permissions; default = Send Messages")
                .setChoices(
                  { name: "Add Reactions", value: "AddReactions" },
                  { name: "Administrator", value: "Administrator" },
                  { name: "Attach Files", value: "AttachFiles" },
                  { name: "Ban Members", value: "BanMembers" },
                  { name: "Change Nickname", value: "ChangeNickname" },
                  {
                    name: "Create Instant Invite",
                    value: "CreateInstantInvite",
                  },
                  { name: "Deafen Members", value: "DeafenMembers" },
                  { name: "Embed Links", value: "EmbedLinks" },
                  { name: "Kick Members", value: "KickMembers" },
                  { name: "Manage Channels", value: "ManageChannels" },
                  {
                    name: "Manage Emojis And Stickers",
                    value: "ManageEmojisAndStickers",
                  },
                  { name: "Manage Events", value: "ManageEvents" },
                  { name: "Manage Guild", value: "ManageGuild" },
                  { name: "Manage Messages", value: "ManageMessages" },
                  { name: "Manage Nicknames", value: "ManageNicknames" },
                  { name: "Manage Roles", value: "ManageRoles" },
                  { name: "Manage Threads", value: "ManageThreads" },
                  { name: "Manage Webhooks", value: "ManageWebhooks" },
                  { name: "Mention Everyone", value: "MentionEveryone" },
                  { name: "Moderate Members", value: "ModerateMembers" },
                  { name: "Move Members", value: "MoveMembers" },
                  { name: "Mute Members", value: "MuteMembers" },
                  { name: "Priority Speaker", value: "PrioritySpeaker" },
                  { name: "Send Messages", value: "SendMessages" },
                  { name: "View Audit Log", value: "ViewAuditLog" }
                )
                .setRequired(false)
            )
        )
        .addSubcommand((sub) =>
          sub
            .setName("delete")
            .setDescription("Delete a role")
            .addRoleOption((option) =>
              option
                .setName("role")
                .setDescription("Select a role")
                .setRequired(true)
            )
        )
    ),

  async execute(interaction, client) {
    let { guild, member, options } = interaction;
    let subg = interaction.options.getSubcommandGroup();
    let sub = interaction.options.getSubcommand();

    switch (subg) {
      case "channels":
        {
          switch (sub) {
            case "create": {
              let name = interaction.options.getString("name");
              let type =
                interaction.options.getString("type") || ChannelType.GuildText;
              let topic = interaction.options.getString("topic") || "";
              let category = interaction.options.getChannel("category") || null;

              await guild.channels
                .create({
                  parent: category,
                  name: name,
                  type: type,
                  topic: topic,
                })
                .then((c) =>
                  c.send({
                    embeds: [
                      new EmbedBuilder()
                        .setColor(client.config.theme.color)
                        .setDescription(
                          "This channel has been initialized!\nGet started by setting up some permissions."
                        ),
                    ],
                  })
                );
              return interaction.reply({
                embeds: [
                  new EmbedBuilder()
                    .setColor(client.config.theme.color)
                    .setDescription("Channel created successfully!"),
                ],
                ephemeral: true,
              });
            }
            case "delete": {
              let channel =
                interaction.options.getChannel("channel") ||
                interaction.channel;
              await channel.delete().catch(() => {});
              return interaction.reply({
                embeds: [
                  new EmbedBuilder()
                    .setColor(client.config.theme.color)
                    .setDescription("Channel was deleted successfully!"),
                ],
                ephemeral: true,
              });
            }

            case "move": {
              let channel =
                interaction.options.getChannel("channel") ||
                interaction.channel;
              let category = interaction.options.getChannel("category") || null;
              await channel.edit({ parent: category });
              return interaction.reply({
                embeds: [
                  new EmbedBuilder()
                    .setColor(client.config.theme.color)
                    .setDescription("Channel was moved successfully!"),
                ],
                ephemeral: true,
              });
            }

            default:
              break;
          }
        }

        break;
      case "roles":
        {
          switch (sub) {
            case "create": {
              let name = interaction.options.getString("name");
              let permission =
                interaction.options.getString("permissions") || "SendMessages";
              let color = interaction.options.getString("color") || "#FFFFFF";
              let mentionable =
                interaction.options.getString("mentionable") || false;
              await guild.roles
                .create({
                  name: name,
                  color: color,
                  permissions: permission,
                  mentionable: mentionable,
                })
                .catch((e) => {});
              return interaction.reply({
                embeds: [
                  new EmbedBuilder()
                    .setColor(client.config.theme.color)
                    .setDescription("Roles created successfully!"),
                ],
                ephemeral: true,
              });
            }
            case "delete": {
              let role = interaction.options.getRole("role");
              await guild.roles.delete(role.id).catch(() => {});
              return interaction.reply({
                embeds: [
                  new EmbedBuilder()
                    .setColor(client.config.theme.color)
                    .setDescription("Roles removed successfully!"),
                ],
                ephemeral: true,
              });
            }

            default:
              break;
          }
        }
        break;

      default:
        break;
    }
  },
};

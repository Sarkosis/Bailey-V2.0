const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("massrole")
    .setDescription("Give or remove a role from everyone in the discord")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((sub) =>
      sub
        .setName("add")
        .setDescription("Add a role to everyone in the discord")
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("Select a role")
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("remove")
        .setDescription("Remove a role from everyone in the discord")
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("Select a role")
            .setRequired(true)
        )
    ),

  async execute(interaction, client) {
    let { guild, options } = interaction;
    let sub = options.getSubcommand();
    let role = options.getRole("role");

    switch (sub) {
      case "add": {
        if (guild.members.me.roles.highest.position < role.position)
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(client.config.theme.color)
                .setDescription("`Missing Permissions`"),
            ],
            ephemeral: true,
          });

        await guild.members.fetch();
        await guild.members.cache.each(async (member) => {
          await member.roles.add(role.id);
        });
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.config.theme.color)
              .setDescription(
                `<@&${role.id}> was added to ${guild.members.cache.size} members!`
              ),
          ],
          ephemeral: true,
        });
      }
      case "remove": {
        if (guild.members.me.roles.highest.position < role.position)
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(client.config.theme.color)
                .setDescription("`Missing Permissions`"),
            ],
            ephemeral: true,
          });
        await guild.members.fetch();
        await guild.members.cache.each(async (member) => {
          await member.roles.remove(role.id);
        });
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.config.theme.color)
              .setDescription(
                `<@&${role.id}> was removed from ${guild.members.cache.size} members!`
              ),
          ],
          ephemeral: true,
        });
      }

      default:
        break;
    }
  },
};

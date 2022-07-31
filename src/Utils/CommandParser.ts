import MajoClient from "../Structures/Client";
import Command from "../Structures/Command";
import { Colors, CommandInteraction, Message, PermissionsBitField } from "discord.js";

export default class CommandParser {
  public client: MajoClient;
  constructor(client: MajoClient) {
    this.client = client;
  }
  parseInteraction(interaction: CommandInteraction, cmd: Command) {
    if (cmd.data.devOnly && !this.client.config?.owners.includes(interaction.user.id)) {
      interaction.reply({
        embeds: [
          {
            color: Colors.Red,
            title: "⚠️ Missing Access",
            description: `${interaction.member}, This command is only available to my developers!`,
          },
        ],
      });
      return false;
    }
    return true;
  }
  parse(message: Message, cmd: Command): Boolean {
    if (cmd.data.disabled) {
      return false;
    }
    if (cmd.data.devOnly && !this.client.config?.owners.includes(message.author.id)) {
      message.channel.send({
        embeds: [
          {
            color: Colors.Red,
            title: "⚠️ Missing Access",
            description: `${message.author}, This command is only available to my developers!`,
          },
        ],
      });
      return false;
    }
    if (cmd.data.userPermissions && message.guild) {
      const neededPermissions: string[] = [];
      cmd.data.userPermissions.forEach((perm) => {
        if (!message.member?.permissions.has(perm)) {
          const bits = new PermissionsBitField(perm);
          neededPermissions.push(bits.toArray()[0] as string);
        }
      });
      if (neededPermissions[0]) {
        message.channel.send({
          embeds: [
            {
              color: Colors.Red,
              title: "⚠️ Missing Permissions",
              description: `${
                message.author
              }, You must have these permissions to run this command.\n\n${neededPermissions.join(
                ", ",
              )}`,
            },
          ],
        });
        return false;
      }
      return true;
    }
    if (cmd.data.clientPermissions && message.guild) {
      const neededPermissions: string[] = [];
      cmd.data.clientPermissions.forEach((perm) => {
        if (!message.guild?.members.me?.permissions.has(perm)) {
          const bits = new PermissionsBitField(perm);
          neededPermissions.push(bits.toArray()[0] as string);
        }
      });
      if (neededPermissions[0]) {
        message.channel.send({
          embeds: [
            {
              color: Colors.Red,
              title: "⚠️ Missing Permissions",
              description: `${
                message.author
              }, I must have these permissions to run this command.\n\n${neededPermissions.join(
                ", ",
              )}`,
            },
          ],
        });
        return false;
      }
      return true;
    }
    return true;
  }
}

import MajoClient from "../Structures/Client";
import Command from "../Structures/Command";
import { CommandInteraction, Message, PermissionsBitField } from "discord.js";
import { ErrorMessages } from "./Messages";

export default class CommandParser {
  public client: MajoClient;
  constructor(client: MajoClient) {
    this.client = client;
  }
  parseInteraction(interaction: CommandInteraction, cmd: Command) {
    if (cmd.data.devOnly && !this.client.config.owners.includes(interaction.user.id)) {
      interaction.reply({
        content: ErrorMessages.developerOnly,
      });
      return false;
    }
    return true;
  }
  parse(message: Message, cmd: Command): Boolean {
    if (cmd.data.disabled) {
      message.channel.send({
        content: ErrorMessages.disabledCommand,
      });
      return false;
    }
    if (cmd.data.devOnly && !this.client.config.owners.includes(message.author.id)) {
      message.channel.send({
        content: ErrorMessages.developerOnly,
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
          content: ErrorMessages.missingUserPermissions(neededPermissions),
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
          content: ErrorMessages.missingClientPermissions(neededPermissions),
        });
        return false;
      }
      return true;
    }
    return true;
  }
}

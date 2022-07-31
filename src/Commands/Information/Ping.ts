import Command, { CommandContext } from "../../Structures/Command";
import MajoClient from "../../Structures/Client";
import { CommandInteraction } from "discord.js";

export default class PingCommand extends Command {
  constructor(client: MajoClient) {
    super(client, {
      name: "ping",
      description: "Simple ping command",
      category: "Information",
      interaction: {
        enabled: true,
      },
      cooldown: 5,
    });
  }
  run(ctx: CommandContext) {
    return ctx.message.channel.send({
      embeds: [
        {
          title: "Ping",
          description: `My ping currently is ${this._client.ws.ping}`,
          author: {
            name: "Discord Bot",
            url: "https://github.com/tovade/discord-bot-base",
          },
          timestamp: new Date().toISOString(),
        },
      ],
    });
  }
  interactionRun(interaction: CommandInteraction) {
    interaction.reply({
      embeds: [
        {
          title: "Ping",
          description: `My ping currently is ${this._client.ws.ping}`,
          author: {
            name: "Discord Bot",
            url: "https://github.com/tovade/discord-bot-base",
          },
          timestamp: new Date().toISOString(),
        },
      ],
    });
  }
}

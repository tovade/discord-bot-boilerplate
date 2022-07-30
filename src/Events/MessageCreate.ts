import Event from "../Structures/Event";
import MajoClient from "../Structures/Client";
import { Message } from "discord.js";
import CommandParser from "../Utils/CommandParser";

export default class MessageCreate extends Event {
  constructor(client: MajoClient) {
    super(client, {
      name: "messageCreate",
      type: "on",
    });
  }
  run(message: Message) {
    const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const mentionRegexPrefix = RegExp(
      `^(<@!?${this.client.user?.id}>|${escapeRegex(this.client.config.prefix)})\\s*`,
    );
    if (
      !mentionRegexPrefix.test(message.content) ||
      message.author.bot ||
      message.author.id === this.client.user?.id
    ) {
      return;
    }
    const prefix = message.content.match(mentionRegexPrefix) as unknown as string[0];
    const [...args] = message.content.slice(prefix.length).trim().split(/ +/g);
    const command =
      this.client.commands.get(args.shift()?.toLowerCase() as string) ||
      this.client.commands.get(
        [...this.client.commands.values()].filter((cmde) =>
          cmde.data.aliases?.includes(args.shift()?.toLowerCase() as string),
        )[0]?.data.name as string,
      );
    if (!command) return;
    const parser = new CommandParser(this.client);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!parser.parse(message, command)) return;
      return command.run({
        message,
        args,
      });
    } catch (err) {
      return message.channel.send({
        content: "An unexpected error has occured",
      });
    }
  }
}

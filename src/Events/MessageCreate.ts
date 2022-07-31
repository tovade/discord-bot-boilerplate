import Event from "../Structures/Event";
import MajoClient from "../Structures/Client";
import { Collection, Colors, Message } from "discord.js";
import CommandParser from "../Utils/CommandParser";

export default class MessageCreate extends Event {
  constructor(client: MajoClient) {
    super(client, {
      name: "messageCreate",
      type: "on",
    });
  }
  async run(message: Message) {
    const escapeRegex = (str: string) => str.replace(/[.*+?!^${}()|[\]\\]/g, "\\$&");
    const mentionRegexPrefix = RegExp(
      `^(<@!?${this.client.user?.id}>|${escapeRegex(this.client.config?.prefix as string)})\\s*`,
    );

    if (
      !mentionRegexPrefix.test(message.content) ||
      message.author.bot ||
      message.author.id === this.client.user?.id
    ) {
      return;
    }
    const [, prefix] = message.content.match(mentionRegexPrefix) as any;
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

    let addCooldown = false;
    const now = Date.now();
    const timestamps = this.getTimestamps(command.data.name);
    const cooldownAmount = command.data.cooldown ? command.data.cooldown * 1000 : 0;
    if (command.data.cooldown) {
      if (timestamps.has(message.author.id)) {
        const currentTime = timestamps.get(message.author.id);
        if (!currentTime) return;

        const expirationTime = currentTime + cooldownAmount;
        if (now < expirationTime) {
          await message.delete();
          const timeLeft = (expirationTime - now) / 1000;
          // eslint-disable-next-line no-return-await
          return await message.channel
            .send({
              embeds: [
                {
                  color: Colors.Orange,
                  title: "⏰ Calm Down",
                  description: `${
                    message.author
                  }, you must wait \`${this.client.utils.formatSeconds(
                    Math.floor(timeLeft),
                  )}\` to run this command.`,
                },
              ],
            })
            .then((msg) =>
              setTimeout(async () => {
                return msg.delete();
              }, 3000),
            );
        }
      }

      addCooldown = true;
    }
    try {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!parser.parse(message, command)) return;

      command.run({
        message,
        args,
      });
      if (addCooldown && !this.client.config?.owners.includes(message.author.id)) {
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
      }
      return;
    } catch (err) {
      return message.channel.send({
        content: "An unexpected error has occured",
      });
    }
  }
  getTimestamps(commandName: string): Collection<string, number> {
    if (!this.client.cooldowns.has(commandName)) {
      this.client.cooldowns.set(commandName, new Collection<string, number>());
    }
    return this.client.cooldowns.get(commandName) as Collection<string, number>;
  }
}

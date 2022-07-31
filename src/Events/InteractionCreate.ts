import Event from "../Structures/Event";
import MajoClient from "../Structures/Client";
import { CommandInteraction, Interaction } from "discord.js";
import CommandParser from "../Utils/CommandParser";
export default class InteractionCreateEvent extends Event {
  constructor(client: MajoClient) {
    super(client, {
      name: "interactionCreate",
      type: "on",
    });
  }
  run(interaction: Interaction) {
    if (interaction.isChatInputCommand()) {
      const cmd = this.client.commands.get(interaction.options.getSubcommand(true));
      if (!cmd) return;
      const parser = new CommandParser(this.client);
      try {
        if (!parser.parseInteraction(interaction as CommandInteraction, cmd)) return;
        cmd.interactionRun(interaction as CommandInteraction);
      } catch (e) {
        return interaction.reply({ content: "Something went wrong" });
      }
    } else if (interaction.isContextMenuCommand()) {
      const int = [...this.client.interactions.values()].filter(
        (inter) => inter.options.name === interaction.commandName,
      );
      if (!int[0]) return;

      const interact = this.client.interactions.get(int[0].options.name);
      if (!interact) return;

      try {
        interact.run(interaction);
      } catch (e) {
        return interaction.reply({ content: "Something went wrong" });
      }
    } else return false;
    return false;
  }
}

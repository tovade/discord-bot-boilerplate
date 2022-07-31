import Interaction from "../../../Structures/Interaction";
import MajoClient from "../../../Structures/Client";
import { ApplicationCommandType } from "discord-api-types/v10";
import { MessageContextMenuCommandInteraction } from "discord.js";

export default class ContentInteraction extends Interaction {
  constructor(client: MajoClient) {
    super(client, {
      name: "content",
      type: ApplicationCommandType.Message,
    });
  }
  run(interaction: MessageContextMenuCommandInteraction) {
    interaction.reply({
      content: `The content of that message is \`${interaction.targetMessage.content}\``,
    });
  }
}

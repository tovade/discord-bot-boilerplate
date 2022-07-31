import MajoClient from "./Client";
import { ApplicationCommandOption, ApplicationCommandType } from "discord.js";

export interface InteractionOptions {
  name: string;
  type: ApplicationCommandType;
  description?: string;
  options?: ApplicationCommandOption[];
}
export default class Interaction {
  public client: MajoClient;
  public options: InteractionOptions;
  constructor(client: MajoClient, options: InteractionOptions) {
    this.client = client;
    this.options = options;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  run(_interaction: any) {
    throw new Error("No run function");
  }
}

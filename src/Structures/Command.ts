import {
  ApplicationCommandOption,
  CommandInteraction,
  Message,
  PermissionResolvable,
} from "discord.js";
import MajoClient from "./Client";

export interface SubCommand {
  name: string;
  description?: string;
  userPermissions?: PermissionResolvable[];
  clientPermissions?: PermissionResolvable[];
  disabled?: boolean;
}
export interface CommandOptions {
  name: string;
  category: string;
  description?: string;
  aliases?: string[];
  subcommands?: SubCommand[];
  userPermissions?: PermissionResolvable[];
  clientPermissions?: PermissionResolvable[];
  devOnly?: boolean;
  disabled?: boolean;
  cooldown?: number;
  interaction?: {
    enabled: boolean;
    options?: ApplicationCommandOption[];
  };
}
export interface CommandContext {
  message: Message;
  args: string[];
}
export default abstract class Command {
  public _client: MajoClient;
  public data: CommandOptions;
  protected constructor(client: MajoClient, options: CommandOptions) {
    this._client = client;
    this.data = options;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  run(_ctx: CommandContext) {
    throw new Error("No run func");
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interactionRun(_interaction: CommandInteraction) {
    throw new Error("No interaction func");
  }
}

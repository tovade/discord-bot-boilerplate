import MajoClient from "../Structures/Client";
import glob from "glob";
import Command from "../Structures/Command";
import path from "node:path";
import {
  ApplicationCommandData,
  ApplicationCommandOption,
  ApplicationCommandOptionType,
  ApplicationCommandType,
} from "discord.js";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";

export default class CommandHandler {
  private readonly _client!: MajoClient;
  constructor(client: MajoClient) {
    this._client = client;
  }
  get directory() {
    return `${path.dirname(<string>require.main?.filename)}${path.sep}`;
  }
  init() {
    return glob.glob(`${this.directory}Commands/**/*.{ts,js}`, (er, files) => {
      if (er) throw new Error(er as unknown as string);
      for (const commandFile of files) {
        // eslint-disable-next-line promise/catch-or-return
        import(commandFile).then((File) => {
          const command = new File.default(this._client);
          if (!(command instanceof Command)) {
            throw new TypeError("[COMMANDS] Invalid command detected");
          }
          return this._client.commands.set(command.data.name.toLowerCase(), command);
        });
      }
    });
  }
  loadInteractions(global: boolean, reload?: boolean) {
    const commands = this.getCommands();
    if (commands.length <= 0) return;
    if (reload) this.deleteAllApplicationCommands();
    const rest = new REST({ version: "10" }).setToken(this._client.token as string);
    global
      ? rest
          .put(Routes.applicationCommands(this._client.user?.id as string), { body: commands })
          .then(() => console.log("Successfully registered application commands."))
          .catch(console.error)
      : rest
          .put(
            Routes.applicationGuildCommands(this._client.user?.id as string, "946079007231836223"),
            {
              body: commands,
            },
          )
          .then(() => console.log("Successfully registered application commands."))
          .catch(console.error);
  }
  getCommands() {
    const groups = [...this._client.commands.values()].map((cmd) => cmd.data.category);
    const commands = [...this._client.commands.values()];
    const ToRegister = [];
    for (const group of groups) {
      const newArr = [];
      for (const cmd of commands) {
        if (cmd.data.interaction?.enabled) {
          newArr.push(cmd);
        }
      }
      const cmds = newArr.filter((cmd) => cmd.data.category === group);
      if (!cmds.length) continue;
      const slashData: ApplicationCommandData = {
        name: group.toLowerCase(),
        description: `${group} category`,
        type: ApplicationCommandType.ChatInput,
        options: [],
      };
      cmds.forEach((commnd) => {
        const d: ApplicationCommandOption = {
          name: commnd.data.name,
          description: commnd.data.description as string,
          type: ApplicationCommandOptionType.Subcommand,
          options: [],
        };
        if (commnd.data.interaction?.options) {
          d.options = commnd.data.interaction.options as any;
          return slashData.options?.push(d);
        }
        return slashData.options?.push(d);
      });
      ToRegister.push(slashData);
    }
    return ToRegister;
  }
  deleteAllApplicationCommands() {
    return this._client.application?.commands.fetch().then((cmds) => {
      for (const cmd of [...cmds.values()]) {
        this._client.application?.commands.delete(cmd.id);
      }
    });
  }
}

import { Client, ClientOptions, Collection } from "discord.js";
import Command from "./Command";
import Event from "./Event";
import EventHandler from "../Handlers/EventHandler";
import CommandHandler from "../Handlers/CommandHandler";
import settings from "../../settings.json";

export default class MajoClient extends Client {
  public commands: Collection<string, Command>;
  public events: Collection<string, Event>;
  public commandHandler: CommandHandler;
  public config: typeof settings;
  constructor(options: ClientOptions) {
    super(options);
    this.config = settings;
    this.commands = new Collection<string, Command>();
    this.events = new Collection<string, Event>();
    this.commandHandler = new CommandHandler(this);
  }
  init(token: string) {
    super.login(token);
    new EventHandler(this).init();
    this.commandHandler.init();
  }
}

import { Client, ClientOptions, Collection } from "discord.js";
import Command from "./Command";
import Event from "./Event";
import EventHandler from "../Handlers/EventHandler";
import CommandHandler from "../Handlers/CommandHandler";
import Config from "../Utils/Config";
import { Settings } from "../Utils/Interfaces";
import ClientUtils from "../Utils/Utils";
import Interaction from "./Interaction";

export default class MajoClient extends Client {
  public commands: Collection<string, Command>;
  public events: Collection<string, Event>;
  public interactions: Collection<string, Interaction>;
  public commandHandler: CommandHandler;
  public config?: Settings;
  public cooldowns: Collection<string, Collection<string, number>>;
  public utils: ClientUtils;
  constructor(options: ClientOptions) {
    super(options);
    this.commands = new Collection<string, Command>();
    this.events = new Collection<string, Event>();
    this.commandHandler = new CommandHandler(this);
    this.interactions = new Collection<string, Interaction>();
    this.cooldowns = new Collection<string, Collection<string, number>>();
    this.utils = new ClientUtils();
    new Config(this).init();
  }
  init(token: string) {
    super.login(token);
    new EventHandler(this).init();
    this.commandHandler.init();
  }
}

import MajoClient from "./Client";

export interface EventOptions {
  name: string;
  type: "on" | "once";
  emitter?: MajoClient;
}
export default class Event {
  readonly client: MajoClient;
  public options: EventOptions;
  constructor(client: MajoClient, options: EventOptions) {
    this.client = client;
    this.options = options;
  }
  run(...args: any[]) {
    throw new Error(JSON.stringify(args));
  }
}

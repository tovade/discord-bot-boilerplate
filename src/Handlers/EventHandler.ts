import MajoClient from "../Structures/Client";
import glob from "glob";
import Event from "../Structures/Event";
import * as path from "node:path";

export default class EventHandler {
  private readonly _client!: MajoClient;
  constructor(client: MajoClient) {
    this._client = client;
  }
  get directory() {
    return `${path.dirname(<string>require.main?.filename)}${path.sep}`;
  }
  init() {
    return glob(`${this.directory}Events/**/*.{ts,js}`, (er, files) => {
      if (er) throw new Error(er as unknown as string);
      for (const eventFile of files) {
        // eslint-disable-next-line promise/catch-or-return
        import(eventFile).then((File) => {
          const event = new File.default(this._client);
          if (!(event instanceof Event)) {
            throw new TypeError("[EVENTS] an event doesn't belong where it should be");
          }
          this._client.events.set(event.options.name, event);
          event.options.emitter
            ? event.options.emitter[event.options.type](event.options.name, (...args: any[]) =>
                event.run(...args),
              )
            : this._client[event.options.type](event.options.name, (...args: any[]) =>
                event.run(...args),
              );
          return true;
        });
      }
    });
  }
}

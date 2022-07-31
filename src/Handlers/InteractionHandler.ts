import MajoClient from "../Structures/Client";
import glob from "glob";
import path from "node:path";
import Interaction from "../Structures/Interaction";

export default class InteractionHandler {
  public client: MajoClient;
  constructor(client: MajoClient) {
    this.client = client;
  }
  get directory() {
    return `${path.dirname(<string>require.main?.filename)}${path.sep}`;
  }
  async loadFiles(): Promise<any> {
    return glob(`${this.directory}Interactions/**/**/*.{ts,js}`, (er, files) => {
      if (er) throw new Error(er as unknown as string);
      for (const interactionFile of files) {
        // eslint-disable-next-line promise/catch-or-return
        import(interactionFile).then((File) => {
          const inter = new File.default(this.client);
          if (!(inter instanceof Interaction)) {
            throw new TypeError("[INTERACTIONS] Invalid interaction detected");
          }
          this.client.commandHandler.registerToApi(
            this.client.config?.interactions.global as boolean,
            [inter.options],
          );
          return this.client.interactions.set(inter.options.name.toLowerCase(), inter);
        });
      }
    });
  }
  init() {
    return this.loadFiles();
  }
}

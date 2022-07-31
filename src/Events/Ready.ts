import Event from "../Structures/Event";
import MajoClient from "../Structures/Client";

export default class ReadyEvent extends Event {
  constructor(client: MajoClient) {
    super(client, {
      name: "ready",
      type: "once",
    });
  }
  run() {
    console.log(`${this.client.user?.username} is ready`);
    if (this.client.config?.interactions.enabled) {
      this.client.commandHandler.loadInteractions(
        this.client.config.interactions.global as boolean,
        this.client.config.interactions.reload,
      );
      console.log("Loaded interactions");
    }
  }
}

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
    this.client.commandHandler.loadInteractions(
      this.client.config.interactions.global,
      this.client.config.interactions.reload,
    );
  }
}

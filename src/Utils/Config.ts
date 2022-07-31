import MajoClient from "../Structures/Client";

export default class Config {
  public _client: MajoClient;
  constructor(client: MajoClient) {
    this._client = client;
  }
  init() {
    return import("../../settings.json")
      .then((file) => {
        this._client.config = file;
      })
      .catch((e) => console.log(e));
  }
}

import MajoClient from "./Structures/Client";
import { GatewayIntentBits } from "discord.js";
import * as dotenv from "dotenv";

dotenv.config();
const client = new MajoClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
});

client.init(process.env["TOKEN"] as string);

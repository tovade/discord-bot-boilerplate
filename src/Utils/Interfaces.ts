export interface Settings {
  prefix: string;
  owners: string[];
  interactions: {
    enabled: boolean;
    reload: boolean;
    global: boolean;
  };
  ids: {
    guildId: string;
    channels: {
      guild_log: string;
    };
  };
}

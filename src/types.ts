export interface ServerInfo {
  name: string;
  motd: string;
  version: string;
  maxPlayers: number;
  onlinePlayers: number;
  health: {
    cpuUsage: number;
    memory: {
      used: number;
      total: number;
    };
  };
  bannedIps: string[];
  bannedPlayers: string[];
}

export interface Player {
  uuid: string;
  displayName: string;
  address: string;
  whitelisted: boolean;
  banned: boolean;
  op: boolean;
  exp: number;
  exhaustion: number;
}

export interface ServerTapResponse<T> {
  data: T;
  error?: string;
}
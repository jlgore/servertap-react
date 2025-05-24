import type { ServerInfo, Player } from '../types';

class ServerTapApi {
  private baseUrl: string = '';
  private apiKey?: string;

  setServer(serverAddress: string, apiKey?: string) {
    this.baseUrl = `http://${serverAddress}`;
    this.apiKey = apiKey;
  }

  private async request<T>(endpoint: string): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.apiKey) {
      headers['key'] = this.apiKey;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers,
      mode: 'cors',
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  async getServerInfo(): Promise<ServerInfo> {
    return this.request<ServerInfo>('/v1/server');
  }

  async getPlayers(): Promise<Player[]> {
    return this.request<Player[]>('/v1/players');
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.getServerInfo();
      return true;
    } catch {
      return false;
    }
  }
}

export const serverTapApi = new ServerTapApi();
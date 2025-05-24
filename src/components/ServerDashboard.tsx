import type { ServerInfo, Player } from '../types';

interface ServerDashboardProps {
  serverInfo: ServerInfo | null;
  players: Player[];
  loading: boolean;
  error: string | null;
}

export function ServerDashboard({ serverInfo, players, loading, error }: ServerDashboardProps) {
  if (loading) {
    return <div className="dashboard loading">Loading server data...</div>;
  }

  if (error) {
    return <div className="dashboard error">Error: {error}</div>;
  }

  if (!serverInfo) {
    return null;
  }

  const formatBytes = (bytes: number) => {
    const gb = bytes / (1024 * 1024 * 1024);
    return `${gb.toFixed(2)} GB`;
  };

  return (
    <div className="dashboard">
      <div className="server-info">
        <h2>{serverInfo.name}</h2>
        <p className="motd">{serverInfo.motd}</p>
        
        <div className="server-stats">
          <div className="stat">
            <label>Version:</label>
            <span>{serverInfo.version}</span>
          </div>
          
          <div className="stat">
            <label>Players:</label>
            <span>{serverInfo.onlinePlayers}/{serverInfo.maxPlayers}</span>
          </div>
          
          <div className="stat">
            <label>CPU Usage:</label>
            <span>{serverInfo.health?.cpuUsage?.toFixed(1)}%</span>
          </div>
          
          <div className="stat">
            <label>Memory:</label>
            <span>
              {formatBytes(serverInfo.health?.memory?.used || 0)} / 
              {formatBytes(serverInfo.health?.memory?.total || 0)}
            </span>
          </div>
        </div>
      </div>

      <div className="players-section">
        <h3>Online Players ({players.length})</h3>
        {players.length === 0 ? (
          <p>No players online</p>
        ) : (
          <div className="players-list">
            {players.map((player) => (
              <div key={player.uuid} className="player-card">
                <div className="player-name">{player.displayName}</div>
                <div className="player-details">
                  <span className={`badge ${player.op ? 'op' : ''}`}>
                    {player.op ? 'OP' : 'Player'}
                  </span>
                  {player.banned && <span className="badge banned">Banned</span>}
                  {player.whitelisted && <span className="badge whitelisted">Whitelisted</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {(serverInfo.bannedIps?.length > 0 || serverInfo.bannedPlayers?.length > 0) && (
        <div className="banned-section">
          <h3>Banned</h3>
          {serverInfo.bannedIps?.length > 0 && (
            <div>
              <h4>IPs ({serverInfo.bannedIps.length})</h4>
              <ul>
                {serverInfo.bannedIps.map((ip, index) => (
                  <li key={index}>{ip}</li>
                ))}
              </ul>
            </div>
          )}
          {serverInfo.bannedPlayers?.length > 0 && (
            <div>
              <h4>Players ({serverInfo.bannedPlayers.length})</h4>
              <ul>
                {serverInfo.bannedPlayers.map((player, index) => (
                  <li key={index}>{player}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
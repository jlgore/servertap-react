import { useState } from 'react';

interface ServerInputProps {
  onServerSubmit: (serverAddress: string, apiKey?: string) => void;
  loading?: boolean;
}

export function ServerInput({ onServerSubmit, loading = false }: ServerInputProps) {
  const [serverAddress, setServerAddress] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [port, setPort] = useState('4567');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (serverAddress.trim()) {
      const fullAddress = serverAddress.includes(':') 
        ? serverAddress 
        : `${serverAddress}:${port}`;
      onServerSubmit(fullAddress, apiKey || undefined);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="server-input-form">
      <div className="input-group">
        <label htmlFor="server-address">Server Address (IP or Domain)</label>
        <input
          id="server-address"
          type="text"
          value={serverAddress}
          onChange={(e) => setServerAddress(e.target.value)}
          placeholder="example.com or 192.168.1.100"
          required
          disabled={loading}
        />
      </div>
      
      <div className="input-group">
        <label htmlFor="port">Port</label>
        <input
          id="port"
          type="number"
          value={port}
          onChange={(e) => setPort(e.target.value)}
          placeholder="4567"
          min="1"
          max="65535"
          disabled={loading}
        />
      </div>

      <div className="input-group">
        <label htmlFor="api-key">API Key (Optional)</label>
        <input
          id="api-key"
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Leave empty if no authentication required"
          disabled={loading}
        />
      </div>

      <button type="submit" disabled={loading || !serverAddress.trim()}>
        {loading ? 'Connecting...' : 'Connect to Server'}
      </button>
    </form>
  );
}
import { useState, useEffect } from 'react'
import { ServerInput } from './components/ServerInput'
import { ServerDashboard } from './components/ServerDashboard'
import { serverTapApi } from './services/serverTapApi'
import type { ServerInfo, Player } from './types'
import './App.css'

function App() {
  const [serverInfo, setServerInfo] = useState<ServerInfo | null>(null)
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [connected, setConnected] = useState(false)

  const fetchServerData = async () => {
    if (!connected) return
    
    try {
      setError(null)
      const [serverData, playersData] = await Promise.all([
        serverTapApi.getServerInfo(),
        serverTapApi.getPlayers()
      ])
      setServerInfo(serverData)
      setPlayers(playersData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch server data')
    }
  }

  const handleServerSubmit = async (serverAddress: string, apiKey?: string) => {
    setLoading(true)
    setError(null)
    
    try {
      serverTapApi.setServer(serverAddress, apiKey)
      await fetchServerData()
      setConnected(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to server')
      setConnected(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!connected) return

    const interval = setInterval(fetchServerData, 5000)
    return () => clearInterval(interval)
  }, [connected])

  return (
    <div className="app">
      <header>
        <h1>ServerTap Monitor</h1>
        <p>Real-time Minecraft server monitoring</p>
      </header>

      <main>
        {!connected ? (
          <ServerInput onServerSubmit={handleServerSubmit} loading={loading} />
        ) : (
          <div>
            <button 
              onClick={() => {
                setConnected(false)
                setServerInfo(null)
                setPlayers([])
                setError(null)
              }}
              className="disconnect-btn"
            >
              Disconnect
            </button>
            <ServerDashboard 
              serverInfo={serverInfo}
              players={players}
              loading={loading}
              error={error}
            />
          </div>
        )}
      </main>
    </div>
  )
}

export default App
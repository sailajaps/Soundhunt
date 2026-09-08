import { useState } from 'react'
import FloatingNotes from '../components/FloatingNotes'

export default function Home({ onAdmin, onPlayer }) {
  const [roomCode, setRoomCode] = useState('')
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState('🎸')
  const [adminCode, setAdminCode] = useState('')
  const [mode, setMode] = useState(null) // 'admin' | 'player'
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const AVATARS = ['🎸', '🥁', '🎤', '🎹', '🎷', '🎺', '🎻', '🪗', '🎵', '🎶']
  const ADMIN_PASSWORD = 'soundhunt2024'

  const handleAdmin = async () => {
    if (adminCode !== ADMIN_PASSWORD) {
      setError('Wrong password')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create' })
      })
      const data = await res.json()
      onAdmin(data.room)
    } catch {
      setError('Failed to create game. Check your connection.')
    }
    setLoading(false)
  }

  const handleJoin = async () => {
    if (!name.trim()) { setError('Enter your name'); return }
    if (!roomCode.trim()) { setError('Enter the room code'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ room: roomCode.toUpperCase(), name: name.trim(), avatar })
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Failed to join'); setLoading(false); return }
      onPlayer(roomCode.toUpperCase(), data.playerId, name.trim(), avatar)
    } catch {
      setError('Failed to join game. Check the room code.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
      <FloatingNotes />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="text-6xl mb-3">🎯</div>
          <h1 className="text-5xl font-bold mb-2" style={{
            background: 'linear-gradient(90deg, #7c3aed, #ec4899, #06b6d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            SoundHunt
          </h1>
          <p className="text-gray-400 text-sm">Music & Human Psychology</p>
        </div>

        {!mode && (
          <div className="space-y-4">
            <button
              onClick={() => setMode('player')}
              className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-3"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}
            >
              🎮 Join a Game
            </button>
            <button
              onClick={() => setMode('admin')}
              className="w-full btn-secondary py-4 text-lg flex items-center justify-center gap-3"
            >
              👑 Admin — Start a Game
            </button>
          </div>
        )}

        {mode === 'player' && (
          <div className="card space-y-4">
            <h2 className="text-xl font-bold">Join SoundHunt</h2>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Your Name</label>
              <input
                className="input"
                placeholder="Enter your name..."
                value={name}
                onChange={e => setName(e.target.value)}
                maxLength={20}
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Pick your avatar</label>
              <div className="flex flex-wrap gap-2">
                {AVATARS.map(a => (
                  <button
                    key={a}
                    onClick={() => setAvatar(a)}
                    className="text-2xl p-2 rounded-xl transition-all"
                    style={{
                      background: avatar === a ? '#7c3aed12' : '#ffffff',
                      border: avatar === a ? '2px solid #7c3aed' : '2px solid #1e1e4a'
                    }}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Room Code</label>
              <input
                className="input font-mono text-2xl tracking-widest uppercase text-center"
                placeholder="XXXX"
                value={roomCode}
                onChange={e => setRoomCode(e.target.value.toUpperCase())}
                maxLength={4}
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              onClick={handleJoin}
              disabled={loading}
              className="w-full btn-primary"
            >
              {loading ? 'Joining...' : 'Join Game →'}
            </button>
            <button onClick={() => { setMode(null); setError('') }} className="w-full text-gray-500 text-sm">← Back</button>
          </div>
        )}

        {mode === 'admin' && (
          <div className="card space-y-4">
            <h2 className="text-xl font-bold">Admin Access</h2>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Admin Password</label>
              <input
                className="input"
                type="password"
                placeholder="Enter password..."
                value={adminCode}
                onChange={e => setAdminCode(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAdmin()}
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              onClick={handleAdmin}
              disabled={loading}
              className="w-full btn-primary"
            >
              {loading ? 'Creating Game...' : 'Create Game →'}
            </button>
            <button onClick={() => { setMode(null); setError('') }} className="w-full text-gray-500 text-sm">← Back</button>
          </div>
        )}
      </div>
    </div>
  )
}

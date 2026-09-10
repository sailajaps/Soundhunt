import { useState, useEffect } from 'react'
import { Target } from 'lucide-react'
import { useGameState } from './hooks/useGameState'
import FloatingNotes from './components/FloatingNotes'
import Home from './views/Home'
import AdminPanel from './views/AdminPanel'
import PlayerLobby from './views/PlayerLobby'
import InstrumentRound from './views/InstrumentRound'
import EmojiRound from './views/EmojiRound'
import Winner from './views/Winner'
import { INSTRUMENT_ROUND_COUNT } from './data/gameData'

export default function App() {
  const [role, setRole] = useState(null) // 'admin' | 'player'
  const [roomCode, setRoomCode] = useState(null)
  const [playerId, setPlayerId] = useState(null)
  const [playerName, setPlayerName] = useState('')
  const [playerAvatar, setPlayerAvatar] = useState('🎸')

  const { gameState, updateState } = useGameState(roomCode, role)

  // Check URL params for direct join link
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const room = params.get('room')
    if (room) setRoomCode(room.toUpperCase())
  }, [])

  const handleAdminStart = (room) => {
    setRole('admin')
    setRoomCode(room)
  }

  const handlePlayerJoin = (room, pid, name, avatar) => {
    setRole('player')
    setRoomCode(room)
    setPlayerId(pid)
    setPlayerName(name)
    setPlayerAvatar(avatar)
  }

  const handleAnswer = async (answerData) => {
    await fetch('/api/answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        room: roomCode,
        playerId,
        playerName,
        playerAvatar,
        roundIndex: gameState.currentRound,
        ...answerData
      })
    })
  }

  const handlePreference = (preference) => handleAnswer({ preference })

  const handleRoundExpire = () => {
    updateState({ action: 'reveal' })
  }

  const handlePlayAgain = () => {
    updateState({ action: 'reset' })
  }

  // Admin view
  if (role === 'admin' && roomCode) {
    const phase = gameState?.phase
    if (phase === 'ended') {
      return <Winner players={gameState?.players || []} isAdmin onPlayAgain={handlePlayAgain} />
    }
    return <AdminPanel roomCode={roomCode} />
  }

  // Player view — route based on game phase
  if (role === 'player' && roomCode && gameState) {
    const phase = gameState.phase
    const currentRound = gameState.currentRound || 0
    const players = gameState.players || []

    if (phase === 'lobby') {
      return (
        <PlayerLobby
          name={playerName}
          avatar={playerAvatar}
          players={players}
          roomCode={roomCode}
          preferenceAnswered={Boolean(gameState.preferences?.[playerId])}
          onPreference={handlePreference}
        />
      )
    }

    if (phase === 'ended') {
      return <Winner players={players} isAdmin={false} />
    }

    if (phase === 'playing' || phase === 'reveal') {
      if (currentRound < INSTRUMENT_ROUND_COUNT) {
        return (
          <InstrumentRound
            roundIndex={currentRound}
            playerId={playerId}
            playerName={playerName}
            playerAvatar={playerAvatar}
            onAnswer={handleAnswer}
            onRoundExpire={handleRoundExpire}
            gameState={gameState}
          />
        )
      } else {
        return (
          <EmojiRound
            roundIndex={currentRound}
            playerId={playerId}
            playerName={playerName}
            onAnswer={handleAnswer}
            onRoundExpire={handleRoundExpire}
            gameState={gameState}
          />
        )
      }
    }
  }

  // Waiting for game state to load
  if (role === 'player' && roomCode && !gameState) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FloatingNotes />
        <div className="text-center relative z-10">
          <Target className="mx-auto mb-4 animate-pulse text-hunt-purple" size={40} />
          <p className="text-gray-400">Connecting to SoundHunt...</p>
        </div>
      </div>
    )
  }

  // Home screen
  return <Home onAdmin={handleAdminStart} onPlayer={handlePlayerJoin} />
}

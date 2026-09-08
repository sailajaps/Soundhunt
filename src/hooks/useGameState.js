import { useState, useEffect, useRef, useCallback } from 'react'

export function useGameState(roomCode, role) {
  const [gameState, setGameState] = useState(null)
  const [error, setError] = useState(null)
  const intervalRef = useRef(null)

  const fetchState = useCallback(async () => {
    if (!roomCode) return
    try {
      const res = await fetch(`/api/game?room=${roomCode}`)
      if (!res.ok) throw new Error('Room not found')
      const data = await res.json()
      setGameState(data)
      setError(null)
    } catch (e) {
      setError(e.message)
    }
  }, [roomCode])

  useEffect(() => {
    if (!roomCode) return
    fetchState()
    intervalRef.current = setInterval(fetchState, 2000)
    return () => clearInterval(intervalRef.current)
  }, [roomCode, fetchState])

  const updateState = useCallback(async (updates) => {
    if (!roomCode) return
    const res = await fetch('/api/game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ room: roomCode, ...updates })
    })
    const data = await res.json()
    setGameState(data)
    return data
  }, [roomCode])

  return { gameState, error, updateState, refetch: fetchState }
}

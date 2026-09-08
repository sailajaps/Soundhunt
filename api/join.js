import { kv } from '@vercel/kv'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { room, name, avatar } = req.body

  if (!room || !name) return res.status(400).json({ error: 'Room and name required' })

  const state = await kv.get(`game:${room}`)
  if (!state) return res.status(404).json({ error: 'Room not found. Check your room code.' })
  if (state.phase !== 'lobby') return res.status(400).json({ error: 'Game already started!' })
  if (state.players.length >= 15) return res.status(400).json({ error: 'Room is full (15 players max)' })

  // Check name not taken
  const nameTaken = state.players.some(p => p.name.toLowerCase() === name.toLowerCase())
  if (nameTaken) return res.status(400).json({ error: 'Name already taken — choose another!' })

  const playerId = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
  const player = {
    id: playerId,
    name,
    avatar: avatar || '🎵',
    score: 0,
    streak: 0,
    joinedAt: Date.now()
  }

  const updated = {
    ...state,
    players: [...state.players, player]
  }

  await kv.set(`game:${room}`, updated, { ex: 3600 })

  return res.status(200).json({ playerId, player })
}

import { kv } from '@vercel/kv'

function generateRoomCode() {
  return Math.random().toString(36).substring(2, 6).toUpperCase()
}

async function clearPreviousGames() {
  const keys = await kv.keys('game:*')
  if (keys.length > 0) await Promise.all(keys.map(key => kv.del(key)))
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()

  // GET - fetch game state
  if (req.method === 'GET') {
    const { room } = req.query
    if (!room) return res.status(400).json({ error: 'Room code required' })

    const state = await kv.get(`game:${room}`)
    if (!state) return res.status(404).json({ error: 'Room not found' })

    return res.status(200).json(state)
  }

  // POST - update game state
  if (req.method === 'POST') {
    const body = req.body
    const { action, room } = body

    // Create new game
    if (action === 'create') {
      await clearPreviousGames()

      let code = generateRoomCode()
      // Ensure unique code
      let existing = await kv.get(`game:${code}`)
      while (existing) {
        code = generateRoomCode()
        existing = await kv.get(`game:${code}`)
      }

      const initialState = {
        room: code,
        phase: 'lobby',
        currentRound: 0,
        players: [],
        answers: {},
        preferences: {},
        foundInstruments: {},
        createdAt: Date.now()
      }

      await kv.set(`game:${code}`, initialState, { ex: 3600 }) // 1 hour TTL
      return res.status(200).json(initialState)
    }

    const state = await kv.get(`game:${room}`)
    if (!state) return res.status(404).json({ error: 'Room not found' })

    let updated = { ...state }

    if (action === 'start') {
      updated.phase = 'playing'
      updated.currentRound = 0
      updated.startedAt = Date.now()
      updated.roundStartedAt = updated.startedAt
    }

    if (action === 'nextRound') {
      const next = (state.currentRound || 0) + 1
      if (next >= 8) {
        updated.phase = 'ended'
      } else {
        updated.phase = 'playing'
        updated.currentRound = next
        updated.roundStartedAt = Date.now()
      }
    }

    if (action === 'reveal') {
      updated.phase = 'reveal'
    }

    if (action === 'end') {
      updated.phase = 'ended'
    }

    if (action === 'reset') {
      updated = {
        room,
        phase: 'lobby',
        currentRound: 0,
        players: state.players.map(p => ({ ...p, score: 0, streak: 0 })),
        answers: {},
        preferences: {},
        foundInstruments: {},
        createdAt: Date.now()
      }
    }

    await kv.set(`game:${room}`, updated, { ex: 3600 })
    return res.status(200).json(updated)
  }

  return res.status(405).json({ error: 'Method not allowed' })
}

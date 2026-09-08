import { kv } from '@vercel/kv'

const INSTRUMENT_POINTS = 200
const EMOJI_POINTS = 300

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { room, playerId, playerName, playerAvatar, roundIndex, instrumentId, guess, correct } = req.body
  const { preference } = req.body

  if (!room || !playerId) return res.status(400).json({ error: 'Missing fields' })

  const state = await kv.get(`game:${room}`)
  if (!state) return res.status(404).json({ error: 'Room not found' })

  const updated = { ...state }
  if (!updated.preferences) updated.preferences = {}
  if (!updated.answers) updated.answers = {}
  if (!updated.foundInstruments) updated.foundInstruments = {}

  let pointsEarned = 0

  if (preference) {
    if (updated.preferences[playerId]) {
      return res.status(200).json({ success: false, message: 'Preference already saved', points: 0 })
    }

    updated.preferences[playerId] = { name: playerName, preference, points: 100 }
    pointsEarned = 100
  }

  if (roundIndex !== undefined && !updated.answers[roundIndex]) {
    updated.answers[roundIndex] = {}
  }

  // Instrument round (rounds 0-2)
  if (instrumentId) {
    // Check if instrument already claimed
    if (updated.foundInstruments[instrumentId]) {
      return res.status(200).json({ success: false, message: 'Already found!', points: 0 })
    }

    // Mark instrument as found
    updated.foundInstruments[instrumentId] = { playerId, playerName }
    pointsEarned = INSTRUMENT_POINTS

    updated.answers[roundIndex][playerId] = {
      name: playerName,
      avatar: playerAvatar,
      answer: instrumentId,
      correct: true,
      points: pointsEarned,
      time: Date.now()
    }
  }

  // Emoji round (rounds 3-5)
  if (guess !== undefined) {
    // Check if this player already answered this round
    if (updated.answers[roundIndex][playerId]) {
      return res.status(200).json({ success: false, message: 'Already answered', points: 0 })
    }

    // Check if someone already got it right
    const alreadyCorrect = Object.values(updated.answers[roundIndex]).some(a => a.correct)

    if (correct && !alreadyCorrect) {
      pointsEarned = EMOJI_POINTS
    }

    updated.answers[roundIndex][playerId] = {
      name: playerName,
      avatar: playerAvatar,
      answer: guess,
      correct: correct && !alreadyCorrect,
      points: pointsEarned,
      time: Date.now()
    }
  }

  // Update player score
  if (pointsEarned > 0) {
    updated.players = updated.players.map(p => {
      if (p.id === playerId) {
        return {
          ...p,
          score: (p.score || 0) + pointsEarned,
          streak: pointsEarned > 0 ? (p.streak || 0) + 1 : 0
        }
      }
      return p
    })
  }

  await kv.set(`game:${room}`, updated, { ex: 3600 })

  return res.status(200).json({
    success: true,
    points: pointsEarned,
    correct: pointsEarned > 0
  })
}

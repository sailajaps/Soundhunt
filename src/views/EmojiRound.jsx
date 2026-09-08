import { useState } from 'react'
import { emojiRounds } from '../data/gameData'
import TimerBar from '../components/TimerBar'

export default function EmojiRound({ roundIndex, playerId, onAnswer, gameState }) {
  const emojiIndex = roundIndex - 3 // rounds 3,4,5 map to emojiRounds 0,1,2
  const round = emojiRounds[emojiIndex]
  const [guess, setGuess] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState(null)

  const phase = gameState?.phase
  const revealed = phase === 'reveal' || phase === 'ended'
  const myScore = gameState?.players?.find(p => p.id === playerId)?.score || 0

  const handleSubmit = () => {
    if (!guess.trim() || submitted) return
    const correct = round.acceptedAnswers.some(
      a => a.toLowerCase() === guess.trim().toLowerCase()
    )
    setSubmitted(true)
    setResult(correct)
    onAnswer({ guess: guess.trim(), correct })
  }

  if (!round) return null

  return (
    <div className="min-h-screen p-4 max-w-lg mx-auto">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-400">Round {roundIndex + 1} of 6</div>
            <h2 className="text-xl font-bold">Decode the Emojis 🎵</h2>
          </div>
          <div className="card py-1 px-3 text-center">
            <div className="text-xs text-gray-400">Score</div>
            <div className="text-lg font-mono font-bold text-hunt-yellow">{myScore}</div>
          </div>
        </div>

        <TimerBar duration={45} running={phase === 'playing'} />

        <p className="text-gray-400 text-sm">{round.description}</p>

        {/* Emoji display */}
        <div
          className="card text-center py-8"
          style={{ background: 'linear-gradient(135deg, #7c3aed11, #ec489911)' }}
        >
          <div className="text-6xl mb-3 tracking-wider">{round.emoji}</div>
          {!revealed && (
            <p className="text-gray-500 text-xs">What music psychology effect does this describe?</p>
          )}
          {revealed && (
            <div className="mt-3">
              <div className="text-sm text-gray-400 mb-1">The answer was:</div>
              <div className="text-2xl font-bold text-hunt-cyan">{round.answer}</div>
            </div>
          )}
        </div>

        {/* Input */}
        {!submitted && !revealed && (
          <div className="space-y-3">
            <input
              className="input text-lg text-center"
              placeholder="Type your answer..."
              value={guess}
              onChange={e => setGuess(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              autoFocus
            />
            <button
              onClick={handleSubmit}
              disabled={!guess.trim()}
              className="w-full btn-primary py-3 text-lg"
            >
              Submit Answer 🎯
            </button>
            <p className="text-center text-gray-500 text-xs">First correct answer = 300 pts!</p>
          </div>
        )}

        {/* Result */}
        {submitted && !revealed && (
          <div
            className="card text-center"
            style={{
              border: result ? '1px solid #10b98144' : '1px solid #ef444444',
              background: result ? '#10b98111' : '#ef444411'
            }}
          >
            <div className="text-4xl mb-2">{result ? '✅' : '❌'}</div>
            <div className="font-bold text-lg">{result ? 'Correct!' : 'Not quite...'}</div>
            <div className="text-gray-400 text-sm mt-1">
              {result ? '+300 pts added to your score!' : `Your answer: "${guess}"`}
            </div>
            <div className="text-gray-500 text-xs mt-2">Waiting for admin to reveal the answer...</div>
          </div>
        )}

        {/* Psych Fact on reveal */}
        {revealed && (
          <div className="card" style={{ border: '1px solid #7c3aed44', background: '#7c3aed11' }}>
            <div className="text-xs text-hunt-purple font-semibold mb-2">🧠 Psychology Fact</div>
            <p className="text-sm text-gray-300">{round.psychFact}</p>
          </div>
        )}

        {/* Hint */}
        {!submitted && !revealed && (
          <div className="text-center">
            <p className="text-gray-600 text-xs">Hint: {round.hint}</p>
          </div>
        )}
      </div>
    </div>
  )
}

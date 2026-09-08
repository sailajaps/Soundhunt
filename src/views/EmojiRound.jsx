import { useState } from 'react'
import { emojiRounds } from '../data/gameData'
import TimerBar from '../components/TimerBar'
import TimeOutNotice from '../components/TimeOutNotice'
import { Brain, CheckCircle2, CircleX, ListMusic, Sparkles, Target, Zap } from 'lucide-react'

export default function EmojiRound({ roundIndex, playerId, onAnswer, gameState }) {
  const emojiIndex = roundIndex - 3 // rounds 3,4,5 map to emojiRounds 0,1,2
  const round = emojiRounds[emojiIndex]
  const [guess, setGuess] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState(null)
  const [timeoutPassed, setTimeoutPassed] = useState(null)

  const phase = gameState?.phase
  const revealed = phase === 'reveal' || phase === 'ended'
  const myScore = gameState?.players?.find(p => p.id === playerId)?.score || 0

  const handleExpire = () => {
    setTimeoutPassed(result === true)
    setTimeout(() => setTimeoutPassed(null), 4000)
  }

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
            <h2 className="text-xl font-bold flex items-center gap-2"><ListMusic className="text-hunt-cyan" size={20} /> Decode the Emojis</h2>
          </div>
          <div className="card py-1 px-3 text-center">
            <div className="text-xs text-gray-400">Score</div>
            <div className="text-lg font-mono font-bold text-hunt-yellow">{myScore}</div>
          </div>
        </div>

        <TimerBar duration={45} resetKey={roundIndex} onExpire={handleExpire} running={phase === 'playing'} />

        {timeoutPassed !== null && <TimeOutNotice passed={timeoutPassed} />}

        <p className="text-gray-400 text-sm">{round.question || round.description}</p>

        {/* Emoji display */}
        <div
          className="card text-center py-8"
          style={{ background: 'linear-gradient(135deg, #7c3aed11, #ec489911)' }}
        >
          <div className="text-6xl mb-3 tracking-wider">{round.emoji}</div>
          <audio className="w-full max-w-sm mx-auto" controls preload="metadata" src={round.audioUrl}>
            Your browser does not support audio playback.
          </audio>
          {!revealed && (
            <p className="text-gray-500 text-xs mt-3">Listen to the music clue, then choose an answer.</p>
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
            <div className="grid gap-2">
              {round.options.map(option => (
                <button
                  key={option}
                  onClick={() => setGuess(option)}
                  className="w-full text-left px-4 py-3 rounded-xl transition-all"
                  style={{
                    background: guess === option ? '#7c3aed12' : '#ffffff',
                    border: guess === option ? '2px solid #7c3aed' : '2px solid #1e1e4a'
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
            <button
              onClick={handleSubmit}
              disabled={!guess.trim()}
              className="w-full btn-primary py-3 text-lg"
            >
              <span className="inline-flex items-center gap-2"><Target size={18} /> Submit Answer</span>
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
            {result ? <CheckCircle2 className="mx-auto mb-2 text-hunt-green" size={40} /> : <CircleX className="mx-auto mb-2 text-hunt-red" size={40} />}
            <div className="font-bold text-lg">{result ? 'Correct!' : 'Not quite...'}</div>
            <div className="text-gray-400 text-sm mt-1">
              {result ? '+300 pts added to your score!' : `Your answer: "${guess}"`}
            </div>
            <div className="text-gray-500 text-xs mt-2">Waiting for admin to reveal the answer...</div>
          </div>
        )}

        {/* Psych Fact on reveal */}
        {revealed && (
          <div className="space-y-3">
            <div className="card" style={{ border: '1px solid #7c3aed44', background: '#7c3aed11' }}>
              <div className="text-xs text-hunt-purple font-semibold mb-2 flex items-center gap-1"><Brain size={14} /> Psychology Fact</div>
              <p className="text-sm text-gray-300">{round.psychFact}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="card" style={{ border: '1px solid #fbbf2444', background: '#fbbf2411' }}>
                <div className="text-xs text-hunt-yellow font-semibold mb-2 flex items-center gap-1"><Sparkles size={14} /> Fun Fact</div>
                <p className="text-sm text-gray-300">{round.funFact}</p>
              </div>
              <div className="card" style={{ border: '1px solid #06b6d444', background: '#06b6d411' }}>
                <div className="text-xs text-hunt-cyan font-semibold mb-2 flex items-center gap-1"><Zap size={14} /> Surprising Fact</div>
                <p className="text-sm text-gray-300">{round.surprisingFact}</p>
              </div>
            </div>
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

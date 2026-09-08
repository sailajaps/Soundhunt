import { useEffect, useState, useRef } from 'react'
import { instrumentRounds } from '../data/gameData'
import TimerBar from '../components/TimerBar'
import TimeOutNotice from '../components/TimeOutNotice'
import { Brain, Check, Music2, Sparkles, Zap } from 'lucide-react'

export default function InstrumentRound({ roundIndex, playerId, playerAvatar, playerName, onAnswer, onRoundExpire, gameState, isAdmin }) {
  const round = instrumentRounds[roundIndex]
  const [taps, setTaps] = useState([])
  const [submitted, setSubmitted] = useState(null)
  const [showResult, setShowResult] = useState(null)
  const [timeoutPassed, setTimeoutPassed] = useState(null)
  const imgRef = useRef(null)

  const phase = gameState?.phase
  const revealed = phase === 'reveal' || phase === 'ended'
  const myAnswer = gameState?.answers?.[gameState.currentRound]?.[playerId]
  const foundInstruments = gameState?.foundInstruments || {}

  useEffect(() => {
    setTaps([])
    setSubmitted(null)
    setShowResult(null)
    setTimeoutPassed(null)
  }, [roundIndex])

  const handleExpire = () => {
    setTimeoutPassed(Boolean(submitted))
    setTimeout(() => setTimeoutPassed(null), 4000)
    onRoundExpire()
  }

  const handleTap = (e) => {
    if (submitted || revealed) return
    const rect = imgRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    // Check proximity to any hotspot (within 10% radius)
    for (const inst of round.instruments) {
      const dist = Math.sqrt((x - inst.x) ** 2 + (y - inst.y) ** 2)
      if (dist < 12) {
        if (foundInstruments[inst.id]) {
          setShowResult({ text: `Already found by someone!`, correct: false })
          setTimeout(() => setShowResult(null), 1500)
          return
        }
        // Correct!
        setSubmitted(inst.id)
        setTaps(t => [...t, { x, y, correct: true }])
        onAnswer({ instrumentId: inst.id, name: inst.name, x, y })
        setShowResult({ text: `Found the ${inst.name}! +200pts`, correct: true })
        setTimeout(() => setShowResult(null), 2000)
        return
      }
    }

    // Miss
    setTaps(t => [...t, { x, y, correct: false }])
    setShowResult({ text: 'Nothing there... keep looking!', correct: false })
    setTimeout(() => setShowResult(null), 1000)
  }

  if (!round) return null

  return (
    <div className="min-h-screen p-4 max-w-lg mx-auto">
      <div className="space-y-4">
        {/* Round header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-400">Round {roundIndex + 1} of 6</div>
            <h2 className="text-xl font-bold">{round.title}</h2>
          </div>
          <div className="card py-1 px-3 text-center">
            <div className="text-xs text-gray-400">Your score</div>
            <div className="text-lg font-mono font-bold text-hunt-yellow">
              {gameState?.players?.find(p => p.id === playerId)?.score || 0}
            </div>
          </div>
        </div>

        <TimerBar duration={45} resetKey={roundIndex} onExpire={handleExpire} running={phase === 'playing'} />

        {timeoutPassed !== null && <TimeOutNotice passed={timeoutPassed} />}

        <p className="text-gray-400 text-sm">{round.description}</p>

        {/* Image with hotspots */}
        <div className="relative rounded-2xl overflow-hidden cursor-crosshair" style={{ aspectRatio: '16/10' }}>
          <img
            ref={imgRef}
            src={round.image}
            alt={round.title}
            className="w-full h-full object-cover"
            onClick={handleTap}
            draggable={false}
          />

          {/* Tap markers */}
          {taps.map((tap, i) => (
            <div
              key={i}
              className="absolute pointer-events-none"
              style={{
                left: `${tap.x}%`,
                top: `${tap.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div
                className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs"
                style={{
                  borderColor: tap.correct ? '#10b981' : '#ef4444',
                  backgroundColor: tap.correct ? '#10b98133' : '#ef444433',
                }}
              >
                {tap.correct ? '✓' : '×'}
              </div>
            </div>
          ))}

          {/* Reveal hotspots */}
          {revealed && round.instruments.map(inst => (
            <div
              key={inst.id}
              className="absolute pointer-events-none animate-bounce"
              style={{
                left: `${inst.x}%`,
                top: `${inst.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="bg-hunt-purple text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 whitespace-nowrap shadow-lg">
                <Music2 size={14} />
                <span>{inst.name}</span>
                {foundInstruments[inst.id] && <span className="text-green-300">✓</span>}
              </div>
            </div>
          ))}

          {/* Result flash */}
          {showResult && (
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div
                className="px-4 py-2 rounded-xl font-bold text-white text-center animate-bounce"
                style={{ background: showResult.correct ? '#10b981' : '#ef4444' }}
              >
                {showResult.text}
              </div>
            </div>
          )}
        </div>

        {/* Found instruments */}
        <div className="card">
          <div className="text-xs text-gray-400 mb-2">Instruments in this image</div>
          <div className="flex flex-wrap gap-3">
            {round.instruments.map(inst => (
              <div key={inst.id} className="flex items-center gap-1 text-sm">
                <Music2 size={14} />
                <span className={foundInstruments[inst.id] ? 'line-through text-gray-500' : 'text-slate-800'}>
                  {inst.name}
                </span>
                {foundInstruments[inst.id] && <span className="text-green-400">✓</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Psych fact on reveal */}
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

        {submitted && (
          <div className="card text-center text-green-400 font-semibold">
            <span className="inline-flex items-center gap-2"><Check size={18} /> You found an instrument! Watch for more...</span>
          </div>
        )}
      </div>
    </div>
  )
}

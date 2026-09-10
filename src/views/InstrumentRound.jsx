import { useEffect, useState, useRef } from 'react'
import { INSTRUMENT_ROUND_TIMER, instrumentRounds } from '../data/gameData'
import TimerBar from '../components/TimerBar'
import TimeOutNotice from '../components/TimeOutNotice'
import { Brain, Check, Music2, Sparkles, Zap } from 'lucide-react'

export default function InstrumentRound({ roundIndex, playerId, playerAvatar, playerName, onAnswer, onRoundExpire, gameState, isAdmin }) {
  const round = instrumentRounds[roundIndex]
  const [taps, setTaps] = useState([])
  const [submitted, setSubmitted] = useState([])
  const [showResult, setShowResult] = useState(null)
  const [timeoutPassed, setTimeoutPassed] = useState(null)
  const imgRef = useRef(null)
  const imageFrameRef = useRef(null)
  const claimedInstrumentsRef = useRef(new Set())

  const phase = gameState?.phase
  const revealed = phase === 'reveal' || phase === 'ended'
  const myAnswer = gameState?.answers?.[gameState.currentRound]?.[playerId]
  const foundInstruments = gameState?.foundInstruments || {}

  useEffect(() => {
    setTaps([])
    setSubmitted([])
    setShowResult(null)
    setTimeoutPassed(null)
    claimedInstrumentsRef.current.clear()
  }, [roundIndex])

  const handleExpire = () => {
    setTimeoutPassed(submitted.length > 0)
    setTimeout(() => setTimeoutPassed(null), 4000)
    onRoundExpire()
  }

  const handleTap = (e) => {
    if (phase !== 'playing' || revealed || !imgRef.current) return
    const rect = imageFrameRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    // Check proximity to any hotspot (within 10% radius)
    for (const inst of round.instruments) {
      const dist = Math.sqrt((x - inst.x) ** 2 + (y - inst.y) ** 2)
      if (dist < 12) {
        if (foundInstruments[inst.id] || claimedInstrumentsRef.current.has(inst.id)) {
          setShowResult({ text: `Already found by someone!`, correct: false })
          setTimeout(() => setShowResult(null), 1500)
          return
        }
        // Correct!
        claimedInstrumentsRef.current.add(inst.id)
        setSubmitted(found => found.includes(inst.id) ? found : [...found, inst.id])
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
    <div className="min-h-screen p-4 max-w-4xl mx-auto">
      <div className="space-y-4">
        {/* Round header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-400">Question {roundIndex + 1} of 5</div>
            <h2 className="text-xl font-bold">{round.title}</h2>
          </div>
          <div className="card py-1 px-3 text-center">
            <div className="text-xs text-gray-400">Your score</div>
            <div className="text-lg font-mono font-bold text-hunt-yellow">
              {gameState?.players?.find(p => p.id === playerId)?.score || 0}
            </div>
          </div>
        </div>

        <TimerBar duration={INSTRUMENT_ROUND_TIMER} resetKey={roundIndex} startTime={gameState?.roundStartedAt} onExpire={handleExpire} running={phase === 'playing'} />

        {timeoutPassed !== null && <TimeOutNotice passed={timeoutPassed} />}

        <p className="text-gray-400 text-sm">{round.description}</p>

        {/* Image with hotspots */}
        <div
          ref={imageFrameRef}
          className="relative w-full max-w-6xl mx-auto rounded-2xl overflow-hidden cursor-crosshair shadow-lg select-none"
          style={{ aspectRatio: '4/3', touchAction: 'none' }}
        >
          <img
            ref={imgRef}
            src={round.image}
            alt={round.title}
            className="w-full h-full object-cover select-none"
            onPointerDown={handleTap}
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
          {false && revealed && round.instruments.map(inst => (
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
        {submitted.length > 0 && (
          <div className="card text-center text-green-400 font-semibold">
            <span className="inline-flex items-center gap-2"><Check size={18} /> You found {submitted.length} instrument{submitted.length === 1 ? '' : 's'}! Keep looking...</span>
          </div>
        )}

        {revealed && (
          <div className="card text-center">
            <div className="font-semibold text-slate-900">Round complete</div>
            <p className="mt-1 text-sm text-slate-600">Waiting for the host to start the next question.</p>
          </div>
        )}
      </div>
    </div>
  )
}

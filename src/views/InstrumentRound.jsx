import { useEffect, useState, useRef } from 'react'
import { INSTRUMENT_ROUND_TIMER, instrumentRounds } from '../data/gameData'
import TimerBar from '../components/TimerBar'
import TimeOutNotice from '../components/TimeOutNotice'
import { Brain, Check, Maximize2, Minus, Music2, Plus, Sparkles, Zap } from 'lucide-react'

export default function InstrumentRound({ roundIndex, playerId, playerAvatar, playerName, onAnswer, onRoundExpire, gameState, isAdmin }) {
  const round = instrumentRounds[roundIndex]
  const [taps, setTaps] = useState([])
  const [submitted, setSubmitted] = useState([])
  const [showResult, setShowResult] = useState(null)
  const [timeoutPassed, setTimeoutPassed] = useState(null)
  const [zoom, setZoom] = useState(1)
  const imgRef = useRef(null)
  const imageFrameRef = useRef(null)

  const phase = gameState?.phase
  const revealed = phase === 'reveal' || phase === 'ended'
  const myAnswer = gameState?.answers?.[gameState.currentRound]?.[playerId]
  const foundInstruments = gameState?.foundInstruments || {}

  useEffect(() => {
    setTaps([])
    setSubmitted([])
    setShowResult(null)
    setTimeoutPassed(null)
    setZoom(1)
  }, [roundIndex])

  const handleExpire = () => {
    setTimeoutPassed(submitted.length > 0)
    setTimeout(() => setTimeoutPassed(null), 4000)
    onRoundExpire()
  }

  const handleTap = (e) => {
    if (phase !== 'playing' || revealed || !imgRef.current) return
    const rect = imageFrameRef.current.getBoundingClientRect()
    const x = (((e.clientX - rect.left - rect.width / 2) / zoom) + rect.width / 2) / rect.width * 100
    const y = (((e.clientY - rect.top - rect.height / 2) / zoom) + rect.height / 2) / rect.height * 100

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

        <TimerBar duration={INSTRUMENT_ROUND_TIMER} resetKey={roundIndex} onExpire={handleExpire} running={phase === 'playing'} />

        {timeoutPassed !== null && <TimeOutNotice passed={timeoutPassed} />}

        <p className="text-gray-400 text-sm">{round.description}</p>

        <div className="flex items-center justify-end gap-2" aria-label="Image zoom controls">
          <button
            type="button"
            onClick={() => setZoom(value => Math.max(1, value - 0.25))}
            disabled={zoom <= 1}
            className="btn-secondary p-2 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Zoom out"
            title="Zoom out"
          >
            <Minus size={17} />
          </button>
          <span className="min-w-14 text-center text-sm font-mono text-slate-600">{Math.round(zoom * 100)}%</span>
          <button
            type="button"
            onClick={() => setZoom(value => Math.min(2.5, value + 0.25))}
            disabled={zoom >= 2.5}
            className="btn-secondary p-2 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Zoom in"
            title="Zoom in"
          >
            <Plus size={17} />
          </button>
          <button
            type="button"
            onClick={() => setZoom(1)}
            disabled={zoom === 1}
            className="btn-secondary p-2 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Reset image zoom"
            title="Reset zoom"
          >
            <Maximize2 size={17} />
          </button>
        </div>

        {/* Image with hotspots */}
        <div
          ref={imageFrameRef}
          className="relative w-full rounded-2xl overflow-hidden cursor-crosshair shadow-lg select-none"
          style={{ aspectRatio: '16/9', touchAction: 'none' }}
        >
          <img
            ref={imgRef}
            src={round.image}
            alt={round.title}
            className="w-full h-full object-cover select-none"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'center', transition: 'transform 180ms ease-out' }}
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
      </div>
    </div>
  )
}

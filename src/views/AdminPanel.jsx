import { useEffect, useState, useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { useGameState } from '../hooks/useGameState'
import Leaderboard from '../components/Leaderboard'
import Confetti from '../components/Confetti'
import { emojiRounds, INSTRUMENT_ROUND_COUNT, INSTRUMENT_ROUND_TIMER, instrumentRounds, ROUND_TIMER, TOTAL_ROUND_COUNT } from '../data/gameData'
import TimerBar from '../components/TimerBar'
import { ArrowRight, Clipboard, Crown, Lightbulb, ListMusic, Play, RotateCcw, Search, Trophy } from 'lucide-react'

export default function AdminPanel({ roomCode }) {
  const { gameState, updateState } = useGameState(roomCode, 'admin')
  const [tab, setTab] = useState('lobby')
  const [copied, setCopied] = useState(false)
  const gameUrl = `${window.location.origin}?room=${roomCode}`

  const players = gameState?.players || []
  const phase = gameState?.phase || 'lobby'
  const currentRound = gameState?.currentRound || 0

  useEffect(() => {
    if (phase === 'lobby') setTab('lobby')
    else if (phase === 'ended') setTab('winner')
    else setTab('game')
  }, [phase])

  const startGame = () => updateState({ action: 'start' })
  const nextRound = () => updateState({ action: 'nextRound' })
  const revealAnswer = () => updateState({ action: 'reveal' })
  const revealWhenTimerEnds = () => updateState({ action: 'reveal' })
  const endGame = () => updateState({ action: 'end' })
  const resetGame = () => updateState({ action: 'reset' })

  const copyRoomCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  const revealedRound = currentRound < INSTRUMENT_ROUND_COUNT
    ? instrumentRounds[currentRound]
    : emojiRounds[currentRound - 3]
  const revealedAnswer = currentRound < INSTRUMENT_ROUND_COUNT
    ? revealedRound?.instruments.map(instrument => instrument.name).join(' · ')
    : revealedRound?.answer

  return (
    <div className="min-h-screen p-4 max-w-2xl mx-auto">
      {phase === 'ended' && <Confetti />}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Crown className="text-hunt-yellow" size={24} /> Admin Panel</h1>
          <p className="text-gray-400 text-sm">SoundHunt</p>
        </div>
        <div className="card py-2 px-3 text-center">
          <div className="text-xs text-gray-400">Join code for newcomers</div>
          <div className="mt-1 flex items-center justify-center gap-2">
            <div className="text-2xl font-mono font-bold tracking-widest text-hunt-cyan">{roomCode}</div>
            <button
              type="button"
              onClick={copyRoomCode}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-hunt-purple"
              aria-label="Copy room code"
              title={copied ? 'Copied' : 'Copy room code'}
            >
              <Clipboard size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Lobby Phase */}
      {phase === 'lobby' && (
        <div className="space-y-6">
          <div className="card text-center">
            <p className="text-gray-400 text-sm mb-3">Players join by scanning this QR code</p>
            <div className="flex justify-center mb-3">
              <div className="bg-white p-3 rounded-xl">
                <QRCodeSVG value={gameUrl} size={180} />
              </div>
            </div>
            <p className="font-mono text-hunt-cyan text-sm break-all">{gameUrl}</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Players Joined</h3>
              <span className="text-hunt-cyan font-mono">{players.length}/20</span>
            </div>
            {players.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">Waiting for players to join...</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {players.map(p => (
                  <div key={p.id} className="flex items-center gap-2 bg-hunt-bg px-3 py-2 rounded-xl">
                    <span>{p.avatar}</span>
                    <span className="text-sm font-medium">{p.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={startGame}
            disabled={players.length < 1}
            className="w-full btn-primary py-4 text-xl"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}
          >
            <><Play size={18} /> Start SoundHunt</>
          </button>
          <p className="text-center text-gray-500 text-xs">Need at least 1 player to start</p>
        </div>
      )}

      {/* Game Phase */}
      {phase === 'playing' && (
        <div className="space-y-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400">Current Round</div>
                <div className="text-2xl font-bold">
                  Question {currentRound + 1} / {TOTAL_ROUND_COUNT}
                  <span className="text-sm font-normal text-gray-400 ml-2">
                    {currentRound < INSTRUMENT_ROUND_COUNT ? 'Hidden Instrument' : 'Music Psychology'}
                  </span>
                </div>
              </div>
              <div className="text-4xl">
                {currentRound < INSTRUMENT_ROUND_COUNT ? <Search className="text-hunt-purple" /> : <ListMusic className="text-hunt-cyan" />}
              </div>
            </div>
          </div>

          <TimerBar
            duration={currentRound < INSTRUMENT_ROUND_COUNT ? INSTRUMENT_ROUND_TIMER : ROUND_TIMER}
            resetKey={currentRound}
            startTime={gameState?.roundStartedAt}
            running={phase === 'playing'}
            onExpire={revealWhenTimerEnds}
          />

          <div className="card space-y-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-hunt-cyan">
              Question {currentRound + 1}
            </div>
            {currentRound < INSTRUMENT_ROUND_COUNT ? (
              <>
                <h2 className="text-2xl font-bold text-slate-900">{revealedRound?.title}</h2>
                <p className="text-slate-600">{revealedRound?.description}</p>
                <img
                  src={revealedRound?.image}
                  alt={revealedRound?.title}
                  className="w-full rounded-2xl object-cover shadow-sm"
                  style={{ aspectRatio: '4/3' }}
                />
                <p className="text-center text-sm font-medium text-slate-600">
                  Click the instruments you can find before time runs out.
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-slate-900">{revealedRound?.question}</h2>
                <div className="rounded-2xl bg-slate-50 py-6 text-center text-5xl tracking-wider">
                  {revealedRound?.emoji}
                </div>
                <audio className="w-full" controls preload="metadata" src={revealedRound?.audioUrl} />
                <div className="grid gap-2 sm:grid-cols-2">
                  {revealedRound?.options?.map(option => (
                    <div key={option} className="rounded-xl border border-hunt-border bg-white px-4 py-3 text-slate-800">
                      {option}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Leaderboard */}
          <div className="card">
            <Leaderboard players={players} title="Current Scores" />
          </div>

          {/* Controls */}
          <div className="grid grid-cols-2 gap-3">
            <button onClick={revealAnswer} className="btn-secondary py-3">
              <><Lightbulb size={18} /> Reveal Answer</>
            </button>
            {currentRound < TOTAL_ROUND_COUNT - 1 ? (
              <button onClick={nextRound} className="btn-primary py-3">
                <><span>Next Round</span><ArrowRight size={18} /></>
              </button>
            ) : (
              <button
                onClick={endGame}
                className="py-3 font-semibold rounded-xl text-white"
                style={{ background: 'linear-gradient(135deg, #fbbf24, #f97316)' }}
              >
                <><Trophy size={18} /> Reveal Winner</>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Reveal Phase */}
      {phase === 'reveal' && (
        <div className="space-y-6">
          <div className="card">
            <div>
              <div className="text-xs text-hunt-purple font-semibold mb-1">CORRECT ANSWER</div>
              <p className="text-lg font-bold text-slate-800">{revealedAnswer}</p>
            </div>
          </div>
          <div className="card">
            <Leaderboard players={players} title={`Scores After Round ${currentRound + 1}`} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {currentRound < TOTAL_ROUND_COUNT - 1 ? (
              <button onClick={nextRound} className="col-span-2 btn-primary py-3">
                <><span>Next Round</span><ArrowRight size={18} /></>
              </button>
            ) : (
              <button
                onClick={endGame}
                className="col-span-2 py-3 font-semibold rounded-xl text-white"
                style={{ background: 'linear-gradient(135deg, #fbbf24, #f97316)' }}
              >
                <><Trophy size={18} /> Reveal Winner</>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Ended Phase */}
      {phase === 'ended' && (
        <div className="space-y-6">
          <div className="card text-center" style={{
            background: 'linear-gradient(135deg, #7c3aed22, #ec489922)',
            border: '1px solid #7c3aed44'
          }}>
            <Trophy className="mx-auto mb-3 text-hunt-yellow" size={56} />
            <h2 className="text-3xl font-bold mb-1">Game Over!</h2>
            <p className="text-gray-400">SoundHunt complete</p>
          </div>
          <Leaderboard players={players} title="Final Standings" final />
          <button onClick={resetGame} className="w-full btn-secondary py-3">
            <><RotateCcw size={18} /> Play Again</>
          </button>
        </div>
      )}
    </div>
  )
}

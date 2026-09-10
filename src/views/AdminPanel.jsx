import { useEffect, useState, useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { useGameState } from '../hooks/useGameState'
import Leaderboard from '../components/Leaderboard'
import Confetti from '../components/Confetti'
import { emojiRounds, INSTRUMENT_ROUND_COUNT, INSTRUMENT_ROUND_TIMER, instrumentRounds, ROUND_TIMER, TOTAL_ROUND_COUNT } from '../data/gameData'
import TimerBar from '../components/TimerBar'
import { ArrowRight, Crown, Lightbulb, ListMusic, Play, RotateCcw, Search, Trophy } from 'lucide-react'

export default function AdminPanel({ roomCode }) {
  const { gameState, updateState } = useGameState(roomCode, 'admin')
  const [tab, setTab] = useState('lobby')
  const gameUrl = `${window.location.origin}?room=${roomCode}`

  const players = gameState?.players || []
  const phase = gameState?.phase || 'lobby'
  const currentRound = gameState?.currentRound || 0
  const answers = gameState?.answers || {}

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

  const roundAnswers = answers[currentRound] || {}
  const answerList = Object.values(roundAnswers)
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
        <div className="card py-2 px-4 text-center">
          <div className="text-xs text-gray-400">Room Code</div>
          <div className="text-2xl font-mono font-bold text-hunt-cyan">{roomCode}</div>
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
            running={phase === 'playing'}
            onExpire={revealWhenTimerEnds}
          />

          {/* Player Answers Live */}
          <div className="card">
            <h3 className="font-semibold mb-3">
              Live Answers
              <span className="text-gray-400 text-sm ml-2">({answerList.length}/{players.length})</span>
            </h3>
            {answerList.length === 0 ? (
              <p className="text-gray-500 text-sm">Waiting for answers...</p>
            ) : (
              <div className="space-y-2">
                {answerList.map((a, i) => (
                  <div key={i} className="flex items-center gap-3 bg-hunt-bg px-3 py-2 rounded-xl">
                    <span>{a.avatar}</span>
                    <span className="font-medium flex-1">{a.name}</span>
                    <span className="text-sm text-gray-400">{a.answer}</span>
                    {a.correct && <span className="text-green-400">✓</span>}
                    {a.points > 0 && <span className="text-hunt-yellow font-mono text-sm">+{a.points}</span>}
                  </div>
                ))}
              </div>
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
          <div className="card text-center">
            <Lightbulb className="mx-auto mb-3 text-hunt-yellow" size={40} />
            <h2 className="text-xl font-bold mb-2">Answer Revealed!</h2>
            <p className="text-gray-400 text-sm">Host-only reveal: share the answer and facts when ready.</p>
          </div>
          <div className="card space-y-4">
            <div>
              <div className="text-xs text-hunt-purple font-semibold mb-1">CORRECT ANSWER</div>
              <p className="text-lg font-bold text-slate-800">{revealedAnswer}</p>
            </div>
            <div className="card" style={{ border: '1px solid #7c3aed44', background: '#7c3aed11' }}>
              <div className="text-xs text-hunt-purple font-semibold mb-2">Psychology Fact</div>
              <p className="text-sm text-slate-700">{revealedRound?.psychFact}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="card" style={{ border: '1px solid #fbbf2444', background: '#fbbf2411' }}>
                <div className="text-xs text-hunt-yellow font-semibold mb-2">Fun Fact</div>
                <p className="text-sm text-slate-700">{revealedRound?.funFact}</p>
              </div>
              <div className="card" style={{ border: '1px solid #06b6d444', background: '#06b6d411' }}>
                <div className="text-xs text-hunt-cyan font-semibold mb-2">Surprising Fact</div>
                <p className="text-sm text-slate-700">{revealedRound?.surprisingFact}</p>
              </div>
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

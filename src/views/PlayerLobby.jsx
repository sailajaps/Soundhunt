import MusicPreference from '../components/MusicPreference'
import { ListMusic, Search, Target } from 'lucide-react'

export default function PlayerLobby({ name, avatar, players = [], roomCode, preferenceAnswered, onPreference }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <div className="text-6xl mb-3 animate-bounce">{avatar}</div>
          <h2 className="text-2xl font-bold">{name}</h2>
          <p className="text-gray-400 text-sm mt-1">You're in! Wait for the admin to start.</p>
        </div>

        <div className="card text-center">
          <div className="text-xs text-gray-400 mb-1">Room Code</div>
          <div className="text-4xl font-mono font-bold text-hunt-cyan">{roomCode}</div>
        </div>

        <MusicPreference answered={preferenceAnswered} onAnswer={onPreference} />

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">In the room</h3>
            <span className="text-hunt-cyan font-mono text-sm">{players.length}/20</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {players.map(p => (
              <div key={p.id} className="flex items-center gap-2 bg-hunt-bg px-3 py-2 rounded-xl">
                <span>{p.avatar}</span>
                <span className="text-sm">{p.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <div className="flex justify-center gap-1 mb-2">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-hunt-purple"
                style={{ animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite` }}
              />
            ))}
          </div>
          <p className="text-gray-500 text-sm">Waiting for admin to start...</p>
        </div>

        <div className="card text-center">
          <Target className="mx-auto mb-2 text-hunt-purple" size={28} />
          <p className="text-sm text-gray-300 font-medium">How to play</p>
          <div className="mt-3 space-y-2 text-left">
            <div className="flex gap-2 text-sm text-gray-400">
              <Search size={17} className="shrink-0 text-hunt-purple" />
              <span>Questions 1–5: Spot as many hidden instruments as you can in 30 seconds. Every find earns 200 pts!</span>
            </div>
            <div className="flex gap-2 text-sm text-gray-400">
              <ListMusic size={17} className="shrink-0 text-hunt-cyan" />
              <span>Questions 6–8: Decode music psychology clues. The first correct answer earns 300 pts!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

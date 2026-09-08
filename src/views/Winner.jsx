import Confetti from '../components/Confetti'
import Leaderboard from '../components/Leaderboard'

export default function Winner({ players, isAdmin, onPlayAgain }) {
  const sorted = [...players].sort((a, b) => (b.score || 0) - (a.score || 0))
  const winner = sorted[0]

  return (
    <div className="min-h-screen p-4 max-w-lg mx-auto">
      <Confetti />
      <div className="space-y-6 relative z-10">
        <div
          className="card text-center py-10"
          style={{
            background: 'linear-gradient(135deg, #7c3aed33, #ec489933)',
            border: '1px solid #7c3aed66'
          }}
        >
          <div className="text-7xl mb-4 animate-bounce">🏆</div>
          <div className="text-5xl mb-3">{winner?.avatar}</div>
          <h1 className="text-3xl font-bold mb-1">{winner?.name}</h1>
          <p className="text-gray-400 mb-3">wins SoundHunt!</p>
          <div
            className="inline-block text-3xl font-mono font-bold px-6 py-2 rounded-xl"
            style={{ background: 'linear-gradient(90deg, #fbbf24, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            {winner?.score} pts
          </div>
        </div>

        <Leaderboard players={players} title="Final Standings" final />

        <div className="card" style={{ border: '1px solid #06b6d444', background: '#06b6d411' }}>
          <div className="text-sm font-semibold text-hunt-cyan mb-2">🎓 What you learned today</div>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>🔍 Music therapy reduces anxiety by up to 65%</li>
            <li>🧠 Playing music is the most whole-brain activity humans do</li>
            <li>❤️ Live music releases oxytocin — the bonding hormone</li>
            <li>😴 Binaural beats can shift your brain from alert to relaxed</li>
            <li>🏃 Music during exercise can boost endurance by 15%</li>
            <li>😢 Minor keys mimic the acoustics of human crying</li>
          </ul>
        </div>

        {isAdmin && (
          <button onClick={onPlayAgain} className="w-full btn-secondary py-3">
            🔄 Play Again
          </button>
        )}
      </div>
    </div>
  )
}

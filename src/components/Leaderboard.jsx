const RANK_COLORS = ['#fbbf24', '#9ca3af', '#f97316']

export default function Leaderboard({ players, title = "Leaderboard", final = false }) {
  const sorted = [...players].sort((a, b) => (b.score || 0) - (a.score || 0))

  return (
    <div className="w-full max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6" style={{
        background: 'linear-gradient(90deg, #7c3aed, #ec4899)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        {title}
      </h2>

      <div className="space-y-3">
        {sorted.map((player, i) => (
          <div
            key={player.id}
            className="card flex items-center gap-4 transition-all duration-500"
            style={{
              borderColor: i < 3 ? RANK_COLORS[i] + '44' : undefined,
              background: i === 0 && final
                ? 'linear-gradient(135deg, #7c3aed22, #ec489922)'
                : undefined
            }}
          >
            <div className="text-2xl w-8 text-center">
              {i < 3 ? <span className="text-sm font-bold" style={{ color: RANK_COLORS[i] }}><span className="sr-only">Rank </span>{i + 1}</span> : <span className="text-gray-500 font-mono text-sm">#{i + 1}</span>}
            </div>
            <div className="text-2xl">{player.avatar}</div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold truncate">{player.name}</div>
            </div>
            <div
              className="text-xl font-mono font-bold"
              style={{ color: i < 3 ? RANK_COLORS[i] : '#fff' }}
            >
              {player.score || 0}
            </div>
          </div>
        ))}
      </div>

      {sorted.length === 0 && (
        <div className="text-center text-gray-500 py-8">No players yet...</div>
      )}
    </div>
  )
}

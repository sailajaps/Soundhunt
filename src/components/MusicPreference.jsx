import { useState } from 'react'
import { Music2 } from 'lucide-react'

const OPTIONS = [
  'I love music and listen every day',
  'I enjoy music, but I am still learning',
  'I mostly listen to music casually',
  'I am curious to discover new music'
]

export default function MusicPreference({ answered, onAnswer }) {
  const [selected, setSelected] = useState('')

  if (answered) {
    return (
      <div className="card text-center" style={{ border: '1px solid #10b98144', background: '#10b98111' }}>
        <Music2 className="mx-auto mb-2 text-hunt-cyan" size={28} />
        <p className="font-semibold text-green-300">Music profile complete!</p>
        <p className="text-gray-400 text-sm mt-1">+100 starter points added</p>
      </div>
    )
  }

  return (
    <div className="card space-y-3">
      <div>
        <div className="text-xs text-hunt-cyan font-semibold mb-1">STARTING QUESTION · +100 POINTS</div>
        <h3 className="font-semibold">What kind of music listener are you?</h3>
        <p className="text-gray-400 text-sm mt-1">There are no wrong answers. Pick the one that feels most like you.</p>
      </div>
      <div className="grid gap-2">
        {OPTIONS.map(option => (
          <button
            key={option}
            onClick={() => setSelected(option)}
            className="w-full text-left px-3 py-2 rounded-xl text-sm transition-all"
            style={{
              background: selected === option ? '#7c3aed12' : '#ffffff',
              border: selected === option ? '2px solid #7c3aed' : '2px solid #1e1e4a'
            }}
          >
            {option}
          </button>
        ))}
      </div>
      <button
        onClick={() => selected && onAnswer(selected)}
        disabled={!selected}
        className="w-full btn-primary py-3"
      >
        Save My Answer
      </button>
    </div>
  )
}
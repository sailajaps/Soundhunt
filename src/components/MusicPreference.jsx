import { useState } from 'react'
import { Music2 } from 'lucide-react'

const OPTIONS = [
  { title: 'Music is part of my everyday life', description: 'I listen to music every day.' },
  { title: 'I am exploring my music taste', description: 'I enjoy music and am still learning.' },
  { title: 'I listen when the mood strikes', description: 'Music is a casual part of my day.' },
  { title: 'I love discovering new sounds', description: 'I am curious about different music.' }
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
        <div className="text-xs font-semibold uppercase tracking-wider text-hunt-cyan">Starting question · +100 points</div>
        <h3 className="mt-1 text-xl font-bold tracking-tight text-slate-900">What kind of music listener are you?</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">There are no wrong answers. Pick the one that feels most like you.</p>
      </div>
      <div className="grid gap-3">
        {OPTIONS.map(option => (
          <button
            key={option.title}
            onClick={() => setSelected(option.title)}
            className="w-full rounded-2xl px-4 py-3 text-left transition-all"
            style={{
              background: selected === option.title ? '#7c3aed0d' : '#ffffff',
              border: selected === option.title ? '2px solid #7c3aed' : '1px solid #dbe2ee',
              boxShadow: selected === option.title ? '0 8px 20px rgba(124, 58, 237, 0.10)' : 'none'
            }}
          >
            <span className="flex items-start gap-3">
              <span
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2"
                style={{ borderColor: selected === option.title ? '#7c3aed' : '#cbd5e1' }}
              >
                {selected === option.title && <span className="h-2.5 w-2.5 rounded-full bg-hunt-purple" />}
              </span>
              <span>
                <span className="block font-semibold text-slate-900">{option.title}</span>
                <span className="mt-0.5 block text-sm leading-5 text-slate-600">{option.description}</span>
              </span>
            </span>
          </button>
        ))}
      </div>
      <button
        onClick={() => selected && onAnswer(selected)}
        disabled={!selected}
        className="w-full btn-primary py-3.5"
      >
        Save My Answer
      </button>
    </div>
  )
}
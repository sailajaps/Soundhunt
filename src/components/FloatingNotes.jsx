import { useMemo } from 'react'
import { Drum, Guitar, Mic2, Music2, Piano } from 'lucide-react'

const NOTES = [Music2, Music2, Guitar, Piano, Mic2, Drum]

export default function FloatingNotes() {
  const notes = useMemo(() => Array.from({ length: 12 }, (_, i) => ({
    id: i,
    Icon: NOTES[i % NOTES.length],
    left: `${(i * 8.3) % 100}%`,
    duration: `${8 + (i % 6)}s`,
    delay: `${(i * 0.7) % 5}s`,
    size: `${1 + (i % 3) * 0.4}rem`,
  })), [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {notes.map(n => (
        <div
          key={n.id}
          className="float-note"
          style={{
            left: n.left,
            animationDuration: n.duration,
            animationDelay: n.delay,
            fontSize: n.size,
            opacity: 0.15,
          }}
        >
          <n.Icon size={24} strokeWidth={1.5} />
        </div>
      ))}
    </div>
  )
}

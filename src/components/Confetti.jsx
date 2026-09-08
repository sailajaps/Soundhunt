import { useMemo } from 'react'

const COLORS = ['#7c3aed', '#ec4899', '#06b6d4', '#fbbf24', '#10b981', '#f97316']

export default function Confetti() {
  const pieces = useMemo(() => Array.from({ length: 80 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    color: COLORS[i % COLORS.length],
    duration: `${2 + Math.random() * 2}s`,
    delay: `${Math.random() * 1.5}s`,
    width: `${6 + Math.random() * 8}px`,
    height: `${8 + Math.random() * 12}px`,
    rotation: `${Math.random() * 360}deg`,
  })), [])

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map(p => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: p.left,
            top: '-20px',
            backgroundColor: p.color,
            width: p.width,
            height: p.height,
            transform: `rotate(${p.rotation})`,
            animationDuration: p.duration,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  )
}

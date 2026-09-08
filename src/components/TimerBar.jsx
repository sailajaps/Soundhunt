import { useEffect, useState } from 'react'

export default function TimerBar({ duration, onExpire, running }) {
  const [timeLeft, setTimeLeft] = useState(duration)

  useEffect(() => {
    setTimeLeft(duration)
  }, [duration])

  useEffect(() => {
    if (!running) return
    if (timeLeft <= 0) {
      onExpire?.()
      return
    }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(t)
  }, [timeLeft, running, onExpire])

  const pct = (timeLeft / duration) * 100
  const color = pct > 50 ? '#10b981' : pct > 25 ? '#fbbf24' : '#ef4444'

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-400 font-mono">Time left</span>
        <span
          className="text-2xl font-mono font-bold"
          style={{ color }}
        >
          {timeLeft}s
        </span>
      </div>
      <div className="w-full h-3 bg-hunt-border rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}

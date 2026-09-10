import { useEffect, useRef, useState } from 'react'

export default function TimerBar({ duration, onExpire, running, resetKey, startTime }) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const expiredRef = useRef(false)
  const onExpireRef = useRef(onExpire)
  const localStartRef = useRef(null)

  useEffect(() => {
    onExpireRef.current = onExpire
  }, [onExpire])

  useEffect(() => {
    setTimeLeft(duration)
    expiredRef.current = false
    localStartRef.current = startTime || Date.now()
    if (!running) return

    const update = () => {
      const elapsed = Math.floor((Date.now() - localStartRef.current) / 1000)
      const remaining = Math.max(0, duration - elapsed)
      setTimeLeft(remaining)
      if (remaining === 0 && !expiredRef.current) {
        expiredRef.current = true
        onExpireRef.current?.()
      }
    }

    update()
    const interval = setInterval(update, 250)
    return () => clearInterval(interval)
  }, [duration, resetKey, running, startTime])

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

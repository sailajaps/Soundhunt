import { CheckCircle2, XCircle } from 'lucide-react'

export default function TimeOutNotice({ passed }) {
  return (
    <div className="fixed inset-x-4 top-6 z-50 mx-auto max-w-sm animate-bounce-in">
      <div
        className="flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 shadow-xl"
        style={{ borderColor: passed ? '#10b98166' : '#ef444466' }}
      >
        {passed ? (
          <CheckCircle2 className="shrink-0 text-hunt-green" size={28} />
        ) : (
          <XCircle className="shrink-0 text-hunt-red" size={28} />
        )}
        <div>
          <p className="font-bold text-slate-900">Time Ran Out!</p>
          
        </div>
      </div>
    </div>
  )
}

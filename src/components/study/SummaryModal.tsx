import { useEffect, useState } from "react"
import { X, Sparkles, Loader2 } from "lucide-react"
import { aiService } from "../../services/ai.service"

export default function SummaryModal({ courseTitle, onClose }: { courseTitle: string; onClose: () => void }) {
  const [loading, setLoading] = useState(true)
  const [text, setText] = useState("")

  useEffect(() => {
    aiService.summarize(courseTitle).then(t => { setText(t); setLoading(false) })
  }, [courseTitle])

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#6C3EF4] to-indigo-500 flex items-center justify-center text-white">
            <Sparkles size={18} />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-slate-900">AI Summary</h2>
            <p className="text-xs text-slate-500">{courseTitle}</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg"><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center gap-2 text-slate-500"><Loader2 size={18} className="animate-spin" /> Generating summary…</div>
          ) : (
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-800">{text}</pre>
          )}
        </div>
      </div>
    </div>
  )
}
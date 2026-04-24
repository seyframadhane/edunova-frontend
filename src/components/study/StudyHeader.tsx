import { ArrowLeft, FileText, Video, Mic } from "lucide-react"
import { useNavigate } from "react-router-dom"

type Mode = "pdf" | "video" | "voice"

const modeMeta: Record<Mode, { label: string; icon: React.JSX.Element; color: string }> = {
  pdf: { label: "PDF study", icon: <FileText size={16} />, color: "bg-indigo-100 text-indigo-700" },
  video: { label: "Video study", icon: <Video size={16} />, color: "bg-purple-100 text-purple-700" },
  voice: { label: "Voice study", icon: <Mic size={16} />, color: "bg-emerald-100 text-emerald-700" },
}

export default function StudyHeader({
  courseTitle,
  mode,
  progress,
}: { courseTitle: string; mode: Mode; progress?: number }) {
  const m = modeMeta[mode]
  const navigate = useNavigate()

  const handleBack = () => {
    // Go back to previous page; if there is no history, fall back to home
    if (window.history.length > 1) navigate(-1)
    else navigate("/")
  }

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-[1400px] mx-auto px-4 h-14 flex items-center gap-4">
        <button
          onClick={handleBack}
          className="flex items-center gap-1 text-slate-600 hover:text-[#6C3EF4] text-sm"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <div className="h-5 w-px bg-slate-200" />
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${m.color}`}>
          {m.icon} {m.label}
        </span>
        <h1 className="text-sm font-semibold text-slate-900 truncate">{courseTitle}</h1>
        {typeof progress === "number" && (
          <div className="ml-auto flex items-center gap-2">
            <div className="w-40 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#6C3EF4] to-indigo-500" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-xs text-slate-500 tabular-nums">{progress}%</span>
          </div>
        )}
      </div>
    </header>
  )
}
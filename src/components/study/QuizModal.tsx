import { useEffect, useState } from "react"
import { X, FileQuestion, Loader2, Check, XCircle, RotateCcw } from "lucide-react"
import { aiService, type QuizQuestion } from "../../services/ai.service"

export default function QuizModal({
  courseId, courseTitle, onClose,
}: { courseId: string; courseTitle: string; onClose: () => void }) {
  const [loading, setLoading] = useState(true)
  const [qs, setQs] = useState<QuizQuestion[]>([])
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    aiService.quiz(courseId)
      .then(q => setQs(q))
      .catch(() => setQs([]))
      .finally(() => setLoading(false))
  }, [courseId])

  function choose(i: number) {
    const next = [...answers, i]
    setAnswers(next)
    if (idx + 1 < qs.length) setIdx(idx + 1)
    else setShowResult(true)
  }

  function restart() { setIdx(0); setAnswers([]); setShowResult(false) }

  const score = answers.reduce((s, a, i) => s + (a === qs[i]?.correctIndex ? 1 : 0), 0)

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#6C3EF4] to-indigo-500 flex items-center justify-center text-white">
            <FileQuestion size={18} />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-slate-900">Course quiz</h2>
            <p className="text-xs text-slate-500">
              {loading ? "Preparing…" : showResult ? "Results" : `Question ${idx + 1} of ${qs.length}`}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg"><X size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading && <div className="flex items-center gap-2 text-slate-500"><Loader2 size={18} className="animate-spin" /> Generating quiz…</div>}

          {!loading && qs.length === 0 && (
            <p className="text-slate-500 text-sm">Couldn't generate a quiz for {courseTitle}. Please try again.</p>
          )}

          {!loading && !showResult && qs[idx] && (
            <div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-5">
                <div className="h-full bg-gradient-to-r from-[#6C3EF4] to-indigo-500" style={{ width: `${(idx / qs.length) * 100}%` }} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">{qs[idx].question}</h3>
              <div className="space-y-2">
                {qs[idx].options.map((opt, i) => (
                  <button key={i} onClick={() => choose(i)}
                    className="w-full text-left px-4 py-3 rounded-xl border border-slate-200 hover:border-[#6C3EF4] hover:bg-[#6C3EF4]/5 text-sm text-slate-800">
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!loading && showResult && (
            <div>
              <div className="text-center mb-6">
                <div className="text-5xl font-bold bg-gradient-to-br from-[#6C3EF4] to-indigo-500 bg-clip-text text-transparent">
                  {score}/{qs.length}
                </div>
                <p className="text-slate-600 text-sm mt-2">
                  {score === qs.length ? "Perfect score! 🎉" : score >= qs.length / 2 ? "Great work!" : "Keep practicing — you'll get there."}
                </p>
              </div>
              <div className="space-y-3">
                {qs.map((q, i) => {
                  const ok = answers[i] === q.correctIndex
                  return (
                    <div key={i} className={`rounded-xl p-4 border ${ok ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50"}`}>
                      <div className="flex items-start gap-2">
                        {ok ? <Check size={18} className="text-emerald-600 mt-0.5" /> : <XCircle size={18} className="text-rose-600 mt-0.5" />}
                        <div className="flex-1">
                          <div className="text-sm font-medium text-slate-900">{q.question}</div>
                          <div className="text-xs text-slate-600 mt-1">
                            Your answer: <span className="font-medium">{q.options[answers[i]]}</span>
                            {!ok && <> · Correct: <span className="font-medium">{q.options[q.correctIndex]}</span></>}
                          </div>
                          <div className="text-xs text-slate-500 mt-1 italic">{q.explanation}</div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              <button onClick={restart} className="mt-6 inline-flex items-center gap-2 text-sm px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50">
                <RotateCcw size={14} /> Retry quiz
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
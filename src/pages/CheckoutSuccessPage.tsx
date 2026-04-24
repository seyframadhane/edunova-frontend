import { useEffect } from "react"
import { useLocation, useNavigate, Link } from "react-router-dom"
import { CheckCircle2, BookOpen, ArrowRight, Sparkles } from "lucide-react"

export default function CheckoutSuccessPage() {
  const navigate = useNavigate()
  const { state } = useLocation() as { state?: {
    total: number; pointsUsed?: number; pointsBalance?: number;
    courses: { id: string; title: string; image: string }[]
  } }

  // If someone lands here without state (refresh/bookmark), redirect
  useEffect(() => { if (!state) navigate("/my-learning") }, [state, navigate])
  if (!state) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-10 text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={44} className="text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Payment successful 🎉</h1>
          <p className="text-slate-600 mt-2">
            You're enrolled in {state.courses.length} {state.courses.length === 1 ? "course" : "courses"}.
            A receipt has been sent to your email.
          </p>

          <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-5 text-left">
            <div className="flex justify-between text-sm text-slate-700">
              <span>Amount paid</span><span className="font-semibold">₹{state.total}</span>
            </div>
            {!!state.pointsUsed && (
              <div className="flex justify-between text-sm text-slate-700 mt-1">
                <span>Points redeemed</span><span className="font-semibold">{state.pointsUsed}</span>
              </div>
            )}
            {typeof state.pointsBalance === "number" && (
              <div className="flex justify-between text-sm text-[#6C3EF4] mt-1 flex items-center gap-1">
                <span className="flex items-center gap-1"><Sparkles size={13} /> New points balance</span>
                <span className="font-semibold">{state.pointsBalance}</span>
              </div>
            )}
          </div>

          <div className="mt-6 space-y-3">
            {state.courses.map(c => (
              <div key={c.id} className="flex items-center gap-3 text-left p-3 rounded-xl border border-slate-100">
                <img src={c.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1 text-sm font-medium text-slate-900 line-clamp-1">{c.title}</div>
                <Link to={`/courses/${c.id}/study/video`} className="text-xs text-[#6C3EF4] font-semibold hover:underline flex items-center gap-1">
                  Start <ArrowRight size={12} />
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => navigate("/my-learning")}
              className="px-6 py-3 rounded-xl bg-[#6C3EF4] text-white font-semibold hover:bg-[#5a32d6] flex items-center justify-center gap-2">
              <BookOpen size={16} /> Go to My Learning
            </button>
            <button onClick={() => navigate("/courses")}
              className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50">
              Browse more courses
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
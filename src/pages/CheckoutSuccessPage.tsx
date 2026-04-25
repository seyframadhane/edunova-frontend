import { useEffect } from "react"
import { useLocation, useNavigate, Link } from "react-router-dom"
import {
  CheckCircle2, ArrowRight, Sparkles, Mail, Award, Play,
  Download, Check, Calendar,
} from "lucide-react"

export default function CheckoutSuccessPage() {
  const navigate = useNavigate()
  const { state } = useLocation() as {
    state?: {
      total: number
      pointsUsed?: number
      pointsBalance?: number
      courses: { id: string; title: string; image: string }[]
    }
  }

  useEffect(() => {
    if (!state) navigate("/my-learning")
  }, [state, navigate])

  if (!state) return null

  const orderId = `EDU-${Date.now().toString().slice(-8)}`
  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  })

  return (
    <div className="min-h-screen bg-white">
      {/* ─── HEADER ─── */}
      <header className="border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-6">
            <p className="text-xs font-semibold tracking-[0.15em] text-emerald-600 uppercase mb-2">
              Order complete
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Confirmation
            </h1>
            <p className="text-slate-500 mt-2 text-sm flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              A receipt has been sent to your email
            </p>
          </div>

          <Steps current={3} />
        </div>
      </header>

      {/* ─── BODY ─── */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Success hero */}
        <div className="text-center mb-10">
          <div className="relative w-20 h-20 mx-auto mb-5">
            <div className="absolute inset-0 bg-emerald-100 rounded-full blur-xl opacity-60" />
            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <CheckCircle2 className="w-10 h-10 text-white" strokeWidth={2.5} />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
            Payment successful 🎉
          </h2>
          <p className="text-slate-500 max-w-md mx-auto">
            You're now enrolled in {state.courses.length}{" "}
            {state.courses.length === 1 ? "course" : "courses"}. Start learning whenever you're ready.
          </p>
        </div>

        {/* Receipt card */}
        <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
          {/* Receipt header */}
          <div className="px-6 py-5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Order receipt
              </p>
              <p className="text-lg font-bold text-slate-900 font-mono mt-0.5">
                #{orderId}
              </p>
            </div>
            <button onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:border-slate-400 transition">
              <Download className="w-4 h-4" />
              Receipt
            </button>
          </div>

          {/* Order info */}
          <div className="px-6 py-5 grid grid-cols-2 sm:grid-cols-4 gap-4 border-b border-slate-200">
            <Info label="Date" value={dateStr} icon={Calendar} />
            <Info label="Status"
              value={<span className="text-emerald-600 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" strokeWidth={3} /> Paid
              </span>} />
            <Info label="Amount" value={`₹${state.total.toLocaleString()}`} />
            {!!state.pointsUsed && (
              <Info label="Points used" value={`${state.pointsUsed} pts`} />
            )}
          </div>

          {/* Courses */}
          <div className="px-6 py-5">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Your courses ({state.courses.length})
            </p>
            <ul className="divide-y divide-slate-200">
              {state.courses.map((c) => (
                <li key={c.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                  <img src={c.image} alt={c.title}
                    className="w-16 h-16 rounded-lg object-cover bg-slate-100 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 line-clamp-2">{c.title}</p>
                    <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                      <Check className="w-3 h-3" strokeWidth={3} /> Enrolled
                    </p>
                  </div>
                  <Link to={`/learn/course/${c.id}`}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-[#6C3EF4] hover:bg-[#5a32d6] text-white rounded-lg text-sm font-semibold transition shrink-0">
                    <Play className="w-3.5 h-3.5 fill-white" />
                    Start
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Points earned strip */}
        {typeof state.pointsBalance === "number" && (
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-[#6C3EF4]/5 to-pink-50 border border-[#6C3EF4]/20 rounded-xl mb-6">
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-sm">
              <Sparkles className="w-5 h-5 text-[#6C3EF4]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-900">Your points balance</p>
              <p className="text-xs text-slate-500">Use them on your next purchase</p>
            </div>
            <p className="text-2xl font-bold text-[#6C3EF4]">{state.pointsBalance}</p>
          </div>
        )}

        {/* Next steps */}
        <div className="border border-slate-200 rounded-xl p-6 mb-8">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
            What's next
          </h3>
          <ul className="space-y-3">
            <Step icon={Play} title="Start your first course"
              desc="Jump in and begin learning at your own pace." />
            <Step icon={Award} title="Earn your certificate"
              desc="Complete each course to unlock a verified certificate." />
            <Step icon={Mail} title="Check your inbox"
              desc="We've sent you a receipt and getting-started guide." />
          </ul>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button onClick={() => navigate("/my-learning")}
            className="flex items-center gap-1.5 px-6 py-3 bg-slate-900 text-white rounded-lg font-semibold text-sm hover:bg-slate-800 transition">
            Go to My Learning <ArrowRight className="w-4 h-4" />
          </button>
          <button onClick={() => navigate("/courses")}
            className="px-6 py-3 bg-white border border-slate-300 text-slate-700 rounded-lg font-semibold text-sm hover:border-slate-400 transition">
            Browse more courses
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Step indicator (shared) ───────────────────────────────── */
function Steps({ current }: { current: 1 | 2 | 3 }) {
  const steps = [
    { n: 1, label: "Cart" },
    { n: 2, label: "Checkout" },
    { n: 3, label: "Confirmation" },
  ]
  return (
    <ol className="flex items-center gap-2 sm:gap-4">
      {steps.map((s, i) => {
        const isActive = s.n === current
        const isDone = s.n < current
        return (
          <li key={s.n} className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                isDone ? "bg-emerald-500 text-white"
                  : isActive ? "bg-[#6C3EF4] text-white"
                  : "bg-slate-100 text-slate-400"
              }`}>
                {isDone ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : s.n}
              </span>
              <span className={`text-sm font-semibold ${
                isActive ? "text-slate-900"
                  : isDone ? "text-slate-700"
                  : "text-slate-400"
              }`}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <span className={`w-8 sm:w-16 h-px ${isDone ? "bg-emerald-500" : "bg-slate-200"}`} />
            )}
          </li>
        )
      })}
    </ol>
  )
}

/* ─── Atoms ────────────────────────────────────────────────── */
function Info({ label, value, icon: Icon }:
  { label: string; value: React.ReactNode; icon?: any }) {
  return (
    <div>
      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
        {Icon && <Icon className="w-3 h-3" />}
        {label}
      </p>
      <p className="text-sm font-bold text-slate-900">{value}</p>
    </div>
  )
}

function Step({ icon: Icon, title, desc }:
  { icon: any; title: string; desc: string }) {
  return (
    <li className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-lg bg-[#6C3EF4]/10 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-[#6C3EF4]" />
      </div>
      <div>
        <p className="text-sm font-bold text-slate-900">{title}</p>
        <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
      </div>
    </li>
  )
}
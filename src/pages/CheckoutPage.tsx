import { useEffect, useState } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import {
  Lock, CreditCard, Smartphone, Wallet, ShieldCheck, Tag, Sparkles,
  Check, ArrowLeft, ArrowRight, Award, RefreshCw, Infinity as InfinityIcon,
} from "lucide-react"
import { toast } from "sonner"
import { cartService } from "../services/cart.service"

interface CartItem {
  _id: string
  course: {
    _id: string
    title: string
    price: number
    oldPrice?: number
    image: string
    level?: string
    category?: string
  }
}

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { state } = useLocation() as {
    state?: { couponCode?: string | null; redeemPoints?: number }
  }

  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  const [couponCode, setCouponCode] = useState(state?.couponCode || "")
  const [redeemPoints, setRedeemPoints] = useState(state?.redeemPoints || 0)
  const [payMethod, setPayMethod] = useState<"card" | "upi" | "paypal">("card")
  const [card, setCard] = useState({ name: "", number: "", expiry: "", cvc: "" })
  const [billing, setBilling] = useState({ email: "", country: "India" })

  useEffect(() => {
    cartService.get()
      .then(({ data }: any) => setItems(data.data || []))
      .catch(() => toast.error("Could not load cart"))
      .finally(() => setLoading(false))
  }, [])

  // ─── totals ─────────────────────────────────────────────────
  const subtotal = items.reduce((s, i) => s + (i.course.price || 0), 0)
  const couponDiscount = couponCode ? Math.round(subtotal * 0.1) : 0
  const pointsDiscount = Math.min(redeemPoints, subtotal - couponDiscount)
  const taxableBase = Math.max(0, subtotal - couponDiscount - pointsDiscount)
  const tax = Math.round(taxableBase * 0.05)
  const total = taxableBase + tax

  // ─── pay handler ────────────────────────────────────────────
  // const handlePay = async () => {
  //   if (payMethod === "card") {
  //     if (!card.name || card.number.replace(/\s/g, "").length < 12 || !card.expiry || card.cvc.length < 3) {
  //       toast.error("Please fill in all card details"); return
  //     }
  //   }
  //   if (!billing.email) {
  //     toast.error("Please enter your email"); return
  //   }
  //   setProcessing(true)
  //   try {
  //     await new Promise((r) => setTimeout(r, 1500))
  //     const { data }: any = await cartService.checkout({ couponCode, redeemPoints })
  //     navigate("/checkout/success", {
  //       state: {
  //         total: data.data.total,
  //         pointsUsed: data.data.pointsUsed,
  //         pointsBalance: data.data.pointsBalance,
  //         courses: items.map((i) => ({
  //           id: i.course._id, title: i.course.title, image: i.course.image,
  //         })),
  //       },
  //     })
  //   } catch (e: any) {
  //     toast.error(e?.response?.data?.message || "Payment failed")
  //   } finally {
  //     setProcessing(false)
  //   }
  // }

  const handlePay = async () => {
    setProcessing(true)
    // ─── STATIC DEMO — skip API, jump straight to confirmation ───
    await new Promise((r) => setTimeout(r, 800))
    navigate("/checkout/success", {
      state: {
        total,
        pointsUsed: redeemPoints || 0,
        pointsBalance: 1250, // fake balance for preview
        courses: items.map((i) => ({
          id: i.course._id,
          title: i.course.title,
          image: i.course.image,
        })),
      },
    })
  }

  if (loading) return <SkeletonPage />

  if (!items.length) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h1>
          <p className="text-slate-500 mb-6">Add courses to your cart before checking out.</p>
          <button onClick={() => navigate("/courses")}
            className="px-5 py-3 bg-slate-900 text-white rounded-lg font-semibold text-sm hover:bg-slate-800">
            Browse courses
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ─── HEADER ─── */}
      <header className="border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
            <div>
              <p className="text-xs font-semibold tracking-[0.15em] text-[#6C3EF4] uppercase mb-2">
                Secure checkout
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                Checkout
              </h1>
              <p className="text-slate-500 mt-2 text-sm flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                256-bit SSL · Your details are encrypted
              </p>
            </div>

            <Link to="/cart"
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition">
              <ArrowLeft className="w-4 h-4" />
              Back to cart
            </Link>
          </div>

          <Steps current={2} />
        </div>
      </header>

      {/* ─── BODY ─── */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          {/* ─── LEFT: Forms ─── */}
          <main className="space-y-6">
            {/* Billing details */}
            <section className="border border-slate-200 rounded-xl p-6">
              <SectionHeader number={1} title="Billing details" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                <Field label="Email" value={billing.email}
                  onChange={(v) => setBilling({ ...billing, email: v })}
                  placeholder="you@example.com" type="email" />
                <Field label="Country" value={billing.country}
                  onChange={(v) => setBilling({ ...billing, country: v })}
                  placeholder="India" />
              </div>
            </section>

            {/* Payment method */}
            <section className="border border-slate-200 rounded-xl p-6">
              <SectionHeader number={2} title="Payment method" />

              <div className="grid grid-cols-3 gap-3 mt-5">
                {([
                  { key: "card", label: "Card", icon: CreditCard },
                  { key: "upi", label: "UPI", icon: Smartphone },
                  { key: "paypal", label: "PayPal", icon: Wallet },
                ] as const).map(({ key, label, icon: Icon }) => {
                  const active = payMethod === key
                  return (
                    <button key={key}
                      onClick={() => setPayMethod(key)}
                      className={`relative flex flex-col items-center gap-2 py-4 rounded-lg border-2 text-sm font-semibold transition ${active
                          ? "border-[#6C3EF4] bg-[#6C3EF4]/5 text-[#6C3EF4]"
                          : "border-slate-200 text-slate-700 hover:border-slate-300"
                        }`}>
                      <Icon className="w-5 h-5" />
                      {label}
                      {active && (
                        <span className="absolute top-2 right-2 w-4 h-4 bg-[#6C3EF4] rounded-full flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>

              {payMethod === "card" && (
                <div className="mt-5 space-y-4">
                  <Field label="Cardholder name" value={card.name}
                    onChange={(v) => setCard({ ...card, name: v })} placeholder="John Doe" />
                  <Field label="Card number" value={card.number}
                    icon={<CreditCard className="w-4 h-4 text-slate-400" />}
                    onChange={(v) => {
                      const digits = v.replace(/\D/g, "").slice(0, 16)
                      const grouped = digits.replace(/(\d{4})(?=\d)/g, "$1 ")
                      setCard({ ...card, number: grouped })
                    }} placeholder="1234 5678 9012 3456" />
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Expiry" value={card.expiry}
                      onChange={(v) => {
                        const digits = v.replace(/\D/g, "").slice(0, 4)
                        const formatted = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
                        setCard({ ...card, expiry: formatted })
                      }} placeholder="MM/YY" />
                    <Field label="CVC" value={card.cvc}
                      icon={<Lock className="w-4 h-4 text-slate-400" />}
                      onChange={(v) => setCard({ ...card, cvc: v.replace(/\D/g, "").slice(0, 4) })}
                      placeholder="123" />
                  </div>
                </div>
              )}

              {payMethod === "upi" && (
                <div className="mt-5">
                  <Field label="UPI ID" value="" onChange={() => { }}
                    placeholder="yourname@bank" />
                </div>
              )}

              {payMethod === "paypal" && (
                <div className="mt-5 p-4 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-600">
                  You'll be redirected to PayPal to complete your payment.
                  <span className="text-xs text-slate-400 block mt-1">(Demo — no real redirect.)</span>
                </div>
              )}
            </section>

            {/* Discounts */}
            <section className="border border-slate-200 rounded-xl p-6">
              <SectionHeader number={3} title="Discounts (optional)" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                <Field label="Coupon code" value={couponCode}
                  icon={<Tag className="w-4 h-4 text-slate-400" />}
                  onChange={setCouponCode} placeholder="WELCOME10" />
                <Field label="Redeem points" value={redeemPoints ? String(redeemPoints) : ""}
                  icon={<Sparkles className="w-4 h-4 text-slate-400" />}
                  onChange={(v) => setRedeemPoints(Number(v) || 0)} placeholder="0" />
              </div>
            </section>

            {/* Trust */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Trust icon={ShieldCheck} title="Secure" desc="SSL encrypted" />
              <Trust icon={RefreshCw} title="30-day refund" desc="Full guarantee" />
              <Trust icon={InfinityIcon} title="Lifetime access" desc="Forever yours" />
            </div>
          </main>

          {/* ─── RIGHT: Order summary (sticky) ─── */}
          <aside>
            <div className="lg:sticky lg:top-6 space-y-4">
              <div className="border border-slate-200 rounded-xl p-5">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                  Order summary
                </h3>

                {/* Items list (compact) */}
                <ul className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {items.map((i) => (
                    <li key={i.course._id} className="flex gap-3">
                      <img src={i.course.image} alt={i.course.title}
                        className="w-14 h-14 rounded-lg object-cover bg-slate-100 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 line-clamp-2">{i.course.title}</p>
                        {i.course.level && (
                          <p className="text-[11px] text-slate-500 mt-0.5">{i.course.level}</p>
                        )}
                      </div>
                      <p className="text-xs font-bold text-slate-900 shrink-0">
                        ₹{i.course.price.toLocaleString()}
                      </p>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-slate-200 mt-4 pt-4 space-y-2.5 text-sm">
                  <Row label={`Subtotal (${items.length})`} value={`₹${subtotal.toLocaleString()}`} />
                  {couponDiscount > 0 && (
                    <Row label="Coupon" value={`−₹${couponDiscount.toLocaleString()}`} accent="emerald" />
                  )}
                  {pointsDiscount > 0 && (
                    <Row label="Points" value={`−₹${pointsDiscount.toLocaleString()}`} accent="emerald" />
                  )}
                  <Row label="Tax (5%)" value={`₹${tax.toLocaleString()}`} muted />
                </div>

                <div className="border-t border-slate-200 mt-4 pt-4 flex items-baseline justify-between">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                    Total due
                  </p>
                  <p className="text-2xl font-bold text-slate-900">
                    ₹{total.toLocaleString()}
                  </p>
                </div>

                <button onClick={handlePay} disabled={processing}
                  className="w-full mt-5 flex items-center justify-center gap-2 py-3.5 bg-[#6C3EF4] hover:bg-[#5a32d6] text-white rounded-lg font-semibold text-sm shadow-lg shadow-[#6C3EF4]/20 transition disabled:opacity-60 disabled:cursor-wait">
                  {processing ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Processing…
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Pay ₹{total.toLocaleString()}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-[11px] text-slate-400 text-center mt-3">
                  By paying you agree to our Terms of Service.
                </p>
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <Award className="w-5 h-5 text-[#6C3EF4] shrink-0" />
                <p className="text-xs text-slate-600">
                  <span className="font-bold text-slate-900">Earn certificate</span> on every course you complete.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

/* ─── Step indicator (same as CartPage) ─────────────────────── */
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
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${isDone ? "bg-emerald-500 text-white"
                  : isActive ? "bg-[#6C3EF4] text-white"
                    : "bg-slate-100 text-slate-400"
                }`}>
                {isDone ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : s.n}
              </span>
              <span className={`text-sm font-semibold ${isActive ? "text-slate-900"
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
function SectionHeader({ number, title }: { number: number; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-7 h-7 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
        {number}
      </span>
      <h2 className="text-base font-bold text-slate-900">{title}</h2>
    </div>
  )
}

function Field({
  label, value, onChange, placeholder, type = "text", icon,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  icon?: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">{label}</span>
      <div className="relative mt-1.5">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full bg-white border border-slate-300 rounded-lg ${icon ? "pl-9" : "pl-3.5"} pr-3.5 py-2.5 text-sm focus:outline-none focus:border-[#6C3EF4] focus:ring-2 focus:ring-[#6C3EF4]/15 transition`}
        />
      </div>
    </label>
  )
}

function Row({ label, value, accent, muted }: {
  label: string; value: string; accent?: "emerald"; muted?: boolean
}) {
  return (
    <div className="flex items-center justify-between">
      <span className={muted ? "text-slate-400" : "text-slate-600"}>{label}</span>
      <span className={`font-semibold ${accent === "emerald" ? "text-emerald-600" : muted ? "text-slate-500" : "text-slate-900"
        }`}>{value}</span>
    </div>
  )
}

function Trust({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <div className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl bg-white">
      <div className="w-10 h-10 rounded-lg bg-[#6C3EF4]/10 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-[#6C3EF4]" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold text-slate-900">{title}</p>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
    </div>
  )
}

/* ─── Skeleton ─────────────────────────────────────────────── */
function SkeletonPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="h-3 w-32 bg-slate-100 rounded mb-3 animate-pulse" />
          <div className="h-9 w-48 bg-slate-100 rounded animate-pulse" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
        <div className="space-y-4">
          <div className="h-32 bg-slate-50 border border-slate-200 rounded-xl animate-pulse" />
          <div className="h-64 bg-slate-50 border border-slate-200 rounded-xl animate-pulse" />
        </div>
        <div className="h-96 bg-slate-50 border border-slate-200 rounded-xl animate-pulse" />
      </div>
    </div>
  )
}
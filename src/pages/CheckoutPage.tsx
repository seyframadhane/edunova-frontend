import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Lock, CreditCard, ShieldCheck, Tag, Sparkles, Check } from "lucide-react"
import { toast } from "sonner"
import { cartService } from "../services/cart.service"

interface CartItem {
  _id: string
  course: { _id: string; title: string; price: number; image: string; level?: string }
}

export default function CheckoutPage() {
  const navigate = useNavigate()
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  const [couponCode, setCouponCode] = useState("")
  const [redeemPoints, setRedeemPoints] = useState(0)
  const [payMethod, setPayMethod] = useState<"card" | "upi" | "paypal">("card")
  const [card, setCard] = useState({ name: "", number: "", expiry: "", cvc: "" })

  useEffect(() => {
    cartService.get()
      .then(({ data }: any) => setItems(data.data))
      .catch(() => toast.error("Could not load cart"))
      .finally(() => setLoading(false))
  }, [])

  const subtotal = items.reduce((s, i) => s + i.course.price, 0)
  const tax = Math.round(subtotal * 0.05)
  const total = subtotal + tax

  const handlePay = async () => {
    if (payMethod === "card") {
      if (!card.name || card.number.replace(/\s/g, "").length < 12 || !card.expiry || card.cvc.length < 3) {
        toast.error("Please fill in all card details")
        return
      }
    }
    setProcessing(true)
    try {
      // Fake ~1.5s payment gateway delay
      await new Promise(r => setTimeout(r, 1500))
      const { data }: any = await cartService.checkout({ couponCode, redeemPoints })
      navigate("/checkout/success", {
        state: {
          total: data.data.total,
          pointsUsed: data.data.pointsUsed,
          pointsBalance: data.data.pointsBalance,
          courses: items.map(i => ({ id: i.course._id, title: i.course.title, image: i.course.image })),
        },
      })
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Payment failed")
    } finally {
      setProcessing(false)
    }
  }

  if (loading) return <div className="p-10 text-center text-gray-500">Loading…</div>

  if (!items.length) {
    return (
      <div className="max-w-xl mx-auto text-center py-20">
        <h2 className="text-2xl font-bold text-slate-900">Your cart is empty</h2>
        <button onClick={() => navigate("/courses")}
          className="mt-4 px-6 py-3 bg-[#6C3EF4] text-white rounded-xl font-semibold">Browse courses</button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Checkout</h1>
          <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
            <Lock size={14} /> Secure payment · Your details are encrypted
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
          {/* LEFT: Payment */}
          <div className="space-y-6">
            {/* Payment method */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Payment method</h2>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {([
                  { key: "card", label: "Card", icon: <CreditCard size={18} /> },
                  { key: "upi", label: "UPI", icon: <Sparkles size={18} /> },
                  { key: "paypal", label: "PayPal", icon: <ShieldCheck size={18} /> },
                ] as const).map(p => (
                  <button key={p.key} onClick={() => setPayMethod(p.key)}
                    className={`flex items-center gap-2 justify-center py-3 rounded-xl border text-sm font-medium transition
                      ${payMethod === p.key ? "border-[#6C3EF4] bg-[#6C3EF4]/5 text-[#6C3EF4]" : "border-slate-200 text-slate-700 hover:border-slate-300"}`}>
                    {p.icon} {p.label}
                  </button>
                ))}
              </div>

              {payMethod === "card" && (
                <div className="space-y-4">
                  <Field label="Cardholder name" value={card.name} onChange={v => setCard({ ...card, name: v })} placeholder="John Doe" />
                  <Field label="Card number" value={card.number} onChange={v => setCard({ ...card, number: v.replace(/[^\d ]/g, "").slice(0, 19) })} placeholder="1234 5678 9012 3456" />
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Expiry" value={card.expiry} onChange={v => setCard({ ...card, expiry: v })} placeholder="MM/YY" />
                    <Field label="CVC" value={card.cvc} onChange={v => setCard({ ...card, cvc: v.replace(/\D/g, "").slice(0, 4) })} placeholder="123" />
                  </div>
                </div>
              )}
              {payMethod === "upi" && (
                <Field label="UPI ID" value="" onChange={() => {}} placeholder="yourname@bank" />
              )}
              {payMethod === "paypal" && (
                <p className="text-sm text-slate-600 bg-slate-50 rounded-xl p-4">
                  You'll be redirected to PayPal to complete the payment. (Demo — no real redirect.)
                </p>
              )}
            </section>

            {/* Discounts */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2"><Tag size={18} /> Discounts</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Coupon code" value={couponCode} onChange={setCouponCode} placeholder="EDU10" />
                <Field label="Redeem points" value={String(redeemPoints)} onChange={v => setRedeemPoints(Number(v) || 0)} placeholder="0" />
              </div>
            </section>
          </div>

          {/* RIGHT: Order summary */}
          <aside className="bg-white rounded-2xl border border-slate-200 p-6 h-fit sticky top-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Order summary</h2>
            <div className="space-y-3 mb-5 max-h-64 overflow-y-auto">
              {items.map(i => (
                <div key={i._id} className="flex gap-3">
                  <img src={i.course.image} alt="" className="w-14 h-14 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-900 line-clamp-2">{i.course.title}</div>
                    <div className="text-xs text-slate-500">{i.course.level}</div>
                  </div>
                  <div className="text-sm font-semibold text-slate-900">₹{i.course.price}</div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-2 text-sm">
              <Row label="Subtotal" value={`₹${subtotal}`} />
              <Row label="Tax (5%)" value={`₹${tax}`} />
              {couponCode && <Row label={`Coupon: ${couponCode}`} value="— applied on confirm" muted />}
              <div className="border-t border-slate-100 pt-2 flex justify-between text-base font-semibold text-slate-900">
                <span>Total</span><span>₹{total}</span>
              </div>
            </div>

            <button
              onClick={handlePay}
              disabled={processing}
              className="mt-6 w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-[#6C3EF4] to-indigo-500 hover:opacity-95 disabled:opacity-60 flex items-center justify-center gap-2">
              {processing ? "Processing…" : <><Lock size={16} /> Pay ₹{total}</>}
            </button>

            <ul className="mt-5 space-y-1.5 text-xs text-slate-500">
              <li className="flex items-center gap-1.5"><Check size={12} className="text-emerald-500" /> Lifetime access to all purchased courses</li>
              <li className="flex items-center gap-1.5"><Check size={12} className="text-emerald-500" /> 30-day money-back guarantee</li>
              <li className="flex items-center gap-1.5"><Check size={12} className="text-emerald-500" /> Certificate on completion</li>
            </ul>
          </aside>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-slate-600">{label}</span>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="mt-1 w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6C3EF4]/30 focus:border-[#6C3EF4]" />
    </label>
  )
}
function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return <div className={`flex justify-between ${muted ? "text-slate-400" : "text-slate-600"}`}><span>{label}</span><span>{value}</span></div>
}
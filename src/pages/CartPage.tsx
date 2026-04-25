import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import {
  ShoppingCart, Trash2, Heart, Tag, Sparkles, Shield, RefreshCw,
  ArrowRight, ArrowLeft, Lock, Check, X, Star, Award, Infinity as InfinityIcon,
} from "lucide-react"
import { cartService } from "../services/cart.service"
import { wishlistService } from "../services/wishlist.service"
import { courseService } from "../services/course.service"
import { CourseCard, type CourseProps } from "../components/ui/CourseCard"

interface CartItem {
  _id: string
  course: {
    _id: string
    title: string
    category?: string
    level?: string
    price: number
    oldPrice?: number
    rating?: number
    image: string
    instructor?: { name?: string }
    durationHours?: number
  }
}

export default function CartPage() {
  const navigate = useNavigate()
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState<Set<string>>(new Set())
  const [coupon, setCoupon] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
  const [points, setPoints] = useState<number>(0)
  const [recommended, setRecommended] = useState<CourseProps[]>([])
  const [submitting, setSubmitting] = useState(false)

  // ─── load cart ──────────────────────────────────────────────
  useEffect(() => {
    setLoading(true)
    cartService.get()
      .then(({ data }: any) => setItems(data.data || []))
      .catch(() => toast.error("Failed to load cart"))
      .finally(() => setLoading(false))
  }, [])

  // ─── recommended (when empty) ───────────────────────────────
  useEffect(() => {
    if (loading || items.length > 0) return
    courseService.recommended({ limit: 4 })
      .then(({ data }: any) => {
        setRecommended((data.data || []).map((c: any) => ({
          id: c._id, title: c.title, category: c.category, level: c.level,
          instructor: c.instructor?.name || "EduNova",
          price: c.price, oldPrice: c.oldPrice, rating: c.rating, image: c.image,
        })))
      })
      .catch(() => {})
  }, [loading, items.length])

  // ─── totals ─────────────────────────────────────────────────
  const totals = useMemo(() => {
    const subtotal = items.reduce((s, i) => s + (i.course.price || 0), 0)
    const originalTotal = items.reduce(
      (s, i) => s + (i.course.oldPrice || i.course.price || 0), 0
    )
    const courseSavings = Math.max(0, originalTotal - subtotal)
    const couponDiscount = appliedCoupon ? Math.round(subtotal * 0.1) : 0
    const pointsDiscount = Math.min(points, subtotal - couponDiscount)
    const total = Math.max(0, subtotal - couponDiscount - pointsDiscount)
    return { subtotal, originalTotal, courseSavings, couponDiscount, pointsDiscount, total }
  }, [items, appliedCoupon, points])

  // ─── actions ────────────────────────────────────────────────
  const setBusyOn = (id: string, on: boolean) => {
    setBusy((prev) => {
      const next = new Set(prev)
      on ? next.add(id) : next.delete(id)
      return next
    })
  }

  const handleRemove = async (courseId: string) => {
    setBusyOn(courseId, true)
    try {
      await cartService.remove(courseId)
      setItems((prev) => prev.filter((i) => i.course._id !== courseId))
      toast.success("Removed from cart")
    } catch {
      toast.error("Failed to remove")
    } finally {
      setBusyOn(courseId, false)
    }
  }

  const handleSaveForLater = async (courseId: string) => {
    setBusyOn(courseId, true)
    try {
      await wishlistService.toggle(courseId)
      await cartService.remove(courseId)
      setItems((prev) => prev.filter((i) => i.course._id !== courseId))
      toast.success("Saved for later")
    } catch {
      toast.error("Failed to save")
    } finally {
      setBusyOn(courseId, false)
    }
  }

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    if (!coupon.trim()) return
    // Optimistic UI; real validation happens at checkout
    setAppliedCoupon(coupon.trim().toUpperCase())
    toast.success(`Coupon "${coupon.trim().toUpperCase()}" applied`)
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCoupon("")
  }

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error("Your cart is empty"); return
    }
    setSubmitting(true)
    // Pass through to checkout page; final validation happens server-side there.
    navigate("/checkout", {
      state: { couponCode: appliedCoupon, redeemPoints: points },
    })
  }

  // ─── states ─────────────────────────────────────────────────
  if (loading) return <SkeletonPage />

  if (items.length === 0) {
    return <EmptyCart recommended={recommended} navigate={navigate} />
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ─── HEADER ─── */}
      <header className="border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="text-xs font-semibold tracking-[0.15em] text-[#6C3EF4] uppercase mb-2">
                  Checkout
                </p>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                  Your cart
                </h1>
                <p className="text-slate-500 mt-2 text-sm">
                  {items.length} course{items.length > 1 ? "s" : ""} ready to enroll
                </p>
              </div>

              <Link to="/courses"
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition">
                <ArrowLeft className="w-4 h-4" />
                Continue shopping
              </Link>
            </div>

            {/* Step indicator */}
            <Steps current={1} />
          </div>
        </div>
      </header>

      {/* ─── BODY ─── */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          {/* ─── ITEMS ─── */}
          <main>
            <div className="border border-slate-200 rounded-xl">
              <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Items
                </h2>
                <span className="text-xs text-slate-500">
                  {items.length} course{items.length > 1 ? "s" : ""}
                </span>
              </div>

              <ul className="divide-y divide-slate-200">
                {items.map((item) => (
                  <CartRow key={item.course._id}
                    item={item}
                    busy={busy.has(item.course._id)}
                    onRemove={() => handleRemove(item.course._id)}
                    onSaveForLater={() => handleSaveForLater(item.course._id)}
                    onOpen={() => navigate(`/course/${item.course._id}`)}
                  />
                ))}
              </ul>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
              <Trust icon={Shield} title="Secure checkout"
                desc="256-bit SSL encryption" />
              <Trust icon={RefreshCw} title="30-day refund"
                desc="No questions asked" />
              <Trust icon={InfinityIcon} title="Lifetime access"
                desc="Learn at your own pace" />
            </div>
          </main>

          {/* ─── SUMMARY (sticky) ─── */}
          <aside>
            <div className="lg:sticky lg:top-6 space-y-4">
              {/* Coupon */}
              <div className="border border-slate-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-4 h-4 text-[#6C3EF4]" />
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Coupon
                  </h3>
                </div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-emerald-900">{appliedCoupon}</p>
                        <p className="text-xs text-emerald-700">10% off applied</p>
                      </div>
                    </div>
                    <button onClick={handleRemoveCoupon}
                      className="p-1 rounded hover:bg-emerald-100">
                      <X className="w-4 h-4 text-emerald-700" />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:border-[#6C3EF4] focus:ring-2 focus:ring-[#6C3EF4]/15 focus:outline-none transition"
                    />
                    <button type="submit" disabled={!coupon.trim()}
                      className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition">
                      Apply
                    </button>
                  </form>
                )}
              </div>

              {/* Points */}
              <div className="border border-slate-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-[#6C3EF4]" />
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Redeem points
                  </h3>
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={0}
                    value={points || ""}
                    onChange={(e) => setPoints(Math.max(0, Number(e.target.value) || 0))}
                    placeholder="0"
                    className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:border-[#6C3EF4] focus:ring-2 focus:ring-[#6C3EF4]/15 focus:outline-none transition"
                  />
                  <span className="px-3 py-2 text-sm font-semibold text-slate-500 bg-slate-50 border border-slate-200 rounded-lg">
                    pts
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  1 point = ₹1 off your order
                </p>
              </div>

              {/* Order summary */}
              <div className="border border-slate-200 rounded-xl p-5">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                  Order summary
                </h3>

                <div className="space-y-2.5 text-sm">
                  <Row label={`Subtotal (${items.length})`} value={`₹${totals.subtotal.toLocaleString()}`} />
                  {totals.courseSavings > 0 && (
                    <Row label="Course savings" value={`−₹${totals.courseSavings.toLocaleString()}`} accent="emerald" />
                  )}
                  {totals.couponDiscount > 0 && (
                    <Row label="Coupon" value={`−₹${totals.couponDiscount.toLocaleString()}`} accent="emerald" />
                  )}
                  {totals.pointsDiscount > 0 && (
                    <Row label="Points" value={`−₹${totals.pointsDiscount.toLocaleString()}`} accent="emerald" />
                  )}
                </div>

                <div className="border-t border-slate-200 mt-4 pt-4 flex items-baseline justify-between">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total</p>
                    {totals.originalTotal > totals.total && (
                      <p className="text-xs text-slate-400 line-through">
                        ₹{totals.originalTotal.toLocaleString()}
                      </p>
                    )}
                  </div>
                  <p className="text-2xl font-bold text-slate-900">
                    ₹{totals.total.toLocaleString()}
                  </p>
                </div>

                <button onClick={handleCheckout} disabled={submitting}
                  className="w-full mt-5 flex items-center justify-center gap-2 py-3.5 bg-[#6C3EF4] hover:bg-[#5a32d6] text-white rounded-lg font-semibold text-sm shadow-lg shadow-[#6C3EF4]/20 transition disabled:opacity-60">
                  <Lock className="w-4 h-4" />
                  Secure checkout
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[11px] text-slate-400 text-center mt-3">
                  By completing your purchase you agree to our Terms of Service.
                </p>
              </div>

              {/* Reassurance */}
              <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <Award className="w-5 h-5 text-[#6C3EF4] shrink-0" />
                <p className="text-xs text-slate-600">
                  <span className="font-bold text-slate-900">Earn certificate</span> on completion of every course.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

/* ─── Cart row ──────────────────────────────────────────────── */
function CartRow({
  item, busy, onRemove, onSaveForLater, onOpen,
}: {
  item: CartItem
  busy: boolean
  onRemove: () => void
  onSaveForLater: () => void
  onOpen: () => void
}) {
  const c = item.course
  const discount = c.oldPrice && c.oldPrice > c.price
    ? Math.round(((c.oldPrice - c.price) / c.oldPrice) * 100) : 0

  return (
    <li className={`p-5 transition ${busy ? "opacity-50 pointer-events-none" : ""}`}>
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Thumbnail */}
        <button onClick={onOpen}
          className="relative w-full sm:w-44 aspect-video rounded-lg overflow-hidden bg-slate-100 shrink-0 hover:opacity-90 transition">
          {c.image ? (
            <img src={c.image} alt={c.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#6C3EF4]/20 to-pink-100" />
          )}
          {discount > 0 && (
            <span className="absolute top-2 left-2 px-2 py-0.5 bg-rose-500 text-white text-[11px] font-bold rounded">
              -{discount}%
            </span>
          )}
        </button>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold mb-1.5">
            {c.category && <span>{c.category}</span>}
            {c.category && c.level && <span>·</span>}
            {c.level && <span>{c.level}</span>}
          </div>
          <button onClick={onOpen}
            className="text-sm sm:text-base font-bold text-slate-900 hover:text-[#6C3EF4] text-left line-clamp-2">
            {c.title}
          </button>
          {c.instructor?.name && (
            <p className="text-xs text-slate-500 mt-1">by {c.instructor.name}</p>
          )}
          <div className="flex items-center gap-3 mt-2">
            {c.rating ? (
              <span className="flex items-center gap-1 text-xs">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-slate-900">{c.rating.toFixed(1)}</span>
              </span>
            ) : null}
            {c.durationHours ? (
              <span className="text-xs text-slate-500">
                {c.durationHours}h total
              </span>
            ) : null}
          </div>

          {/* Action links */}
          <div className="flex items-center gap-4 mt-3">
            <button onClick={onSaveForLater}
              disabled={busy}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#6C3EF4] transition">
              <Heart className="w-3.5 h-3.5" />
              Save for later
            </button>
            <span className="text-slate-300">·</span>
            <button onClick={onRemove}
              disabled={busy}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-rose-600 transition">
              <Trash2 className="w-3.5 h-3.5" />
              Remove
            </button>
          </div>
        </div>

        {/* Price */}
        <div className="flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-start gap-2 sm:min-w-[100px] sm:text-right">
          <p className="text-lg font-bold text-slate-900">₹{c.price.toLocaleString()}</p>
          {c.oldPrice && c.oldPrice > c.price && (
            <p className="text-xs text-slate-400 line-through">₹{c.oldPrice.toLocaleString()}</p>
          )}
        </div>
      </div>
    </li>
  )
}

/* ─── Step indicator ───────────────────────────────────────── */
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
function Row({ label, value, accent }:
  { label: string; value: string; accent?: "emerald" }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-600">{label}</span>
      <span className={`font-semibold ${accent === "emerald" ? "text-emerald-600" : "text-slate-900"}`}>
        {value}
      </span>
    </div>
  )
}

function Trust({ icon: Icon, title, desc }:
  { icon: any; title: string; desc: string }) {
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

/* ─── Loading skeleton ──────────────────────────────────────── */
function SkeletonPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="h-3 w-24 bg-slate-100 rounded mb-3 animate-pulse" />
          <div className="h-9 w-48 bg-slate-100 rounded animate-pulse" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
        <div className="border border-slate-200 rounded-xl divide-y divide-slate-200">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-4 p-5 animate-pulse">
              <div className="w-44 aspect-video bg-slate-100 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-24 bg-slate-100 rounded" />
                <div className="h-5 w-3/4 bg-slate-100 rounded" />
                <div className="h-4 w-32 bg-slate-100 rounded" />
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <div className="h-32 bg-slate-50 rounded-xl animate-pulse" />
          <div className="h-64 bg-slate-50 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  )
}

/* ─── Empty state ────────────────────────────────────────────── */
function EmptyCart({
  recommended, navigate,
}: { recommended: CourseProps[]; navigate: (path: string) => void }) {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-[#6C3EF4]/15 to-pink-200 rounded-full blur-xl" />
          <div className="relative w-full h-full rounded-full bg-gradient-to-br from-[#6C3EF4] to-pink-500 flex items-center justify-center shadow-lg">
            <ShoppingCart className="w-10 h-10 text-white" />
          </div>
        </div>

        <p className="text-xs font-semibold tracking-[0.15em] text-[#6C3EF4] uppercase mb-2">
          Your cart
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
          Your cart is empty
        </h1>
        <p className="text-slate-500 mb-8 max-w-md mx-auto">
          Start filling it with courses you love. Add to cart from the catalog and check out when you're ready.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button onClick={() => navigate("/courses")}
            className="flex items-center gap-1.5 px-6 py-3 bg-slate-900 text-white rounded-lg font-semibold text-sm hover:bg-slate-800 transition">
            Browse courses <ArrowRight className="w-4 h-4" />
          </button>
          <button onClick={() => navigate("/wishlist")}
            className="flex items-center gap-1.5 px-6 py-3 bg-white border border-slate-300 text-slate-700 rounded-lg font-semibold text-sm hover:border-slate-400 transition">
            <Heart className="w-4 h-4" />
            View wishlist
          </button>
        </div>
      </div>

      {recommended.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 pb-20">
          <div className="flex items-center gap-2 mb-5">
            <Sparkles className="w-5 h-5 text-[#6C3EF4]" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">Recommended for you</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {recommended.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
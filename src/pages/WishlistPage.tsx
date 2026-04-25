import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import {
  Heart, ShoppingCart, Trash2, ChevronDown, ArrowRight,
  Sparkles, Search, Star,
} from "lucide-react"
import { wishlistService } from "../services/wishlist.service"
import { cartService } from "../services/cart.service"
import { courseService } from "../services/course.service"
import { CourseCard, type CourseProps } from "../components/ui/CourseCard"

type WishItem = {
  _id?: string
  course: {
    _id: string
    title: string
    category: string
    level?: string
    price: number
    oldPrice?: number
    rating?: number
    image?: string
    instructor?: { name?: string }
  }
  addedAt?: string
}

const SORTS = [
  { key: "newest", label: "Recently added" },
  { key: "price_asc", label: "Price: Low to High" },
  { key: "price_desc", label: "Price: High to Low" },
  { key: "rating", label: "Highest rated" },
  { key: "title", label: "Title A–Z" },
] as const

export default function WishlistPage() {
  const navigate = useNavigate()
  const [items, setItems] = useState<WishItem[]>([])
  const [loading, setLoading] = useState(true)
  const [recommended, setRecommended] = useState<CourseProps[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [busy, setBusy] = useState<Set<string>>(new Set())
  const [sort, setSort] = useState<(typeof SORTS)[number]["key"]>("newest")
  const [showSort, setShowSort] = useState(false)
  const [query, setQuery] = useState("")

  // ─── load wishlist ──────────────────────────────────────────
  useEffect(() => {
    setLoading(true)
    wishlistService.get()
      .then(({ data }: any) => setItems(data.data || []))
      .catch(() => toast.error("Failed to load wishlist"))
      .finally(() => setLoading(false))
  }, [])

  // ─── recommended (only when wishlist is empty) ──────────────
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

  // ─── derived ────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...items]
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter((i) =>
        i.course.title.toLowerCase().includes(q) ||
        i.course.category.toLowerCase().includes(q)
      )
    }
    list.sort((a, b) => {
      switch (sort) {
        case "price_asc":  return a.course.price - b.course.price
        case "price_desc": return b.course.price - a.course.price
        case "rating":     return (b.course.rating || 0) - (a.course.rating || 0)
        case "title":      return a.course.title.localeCompare(b.course.title)
        default: // newest
          return new Date(b.addedAt || 0).getTime() - new Date(a.addedAt || 0).getTime()
      }
    })
    return list
  }, [items, sort, query])

  const totalValue = items.reduce((s, i) => s + (i.course.price || 0), 0)
  const totalSaved = items.reduce(
    (s, i) => s + Math.max(0, (i.course.oldPrice || 0) - (i.course.price || 0)), 0
  )

  // ─── selection ──────────────────────────────────────────────
  const allChecked = filtered.length > 0 && filtered.every((i) => selected.has(i.course._id))
  const toggleAll = () => {
    if (allChecked) setSelected(new Set())
    else setSelected(new Set(filtered.map((i) => i.course._id)))
  }
  const toggleOne = (id: string) => {
    const next = new Set(selected)
    next.has(id) ? next.delete(id) : next.add(id)
    setSelected(next)
  }

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
      await wishlistService.toggle(courseId)
      setItems((prev) => prev.filter((i) => i.course._id !== courseId))
      setSelected((prev) => {
        const next = new Set(prev); next.delete(courseId); return next
      })
      toast.success("Removed from wishlist")
    } catch {
      toast.error("Failed to remove")
    } finally {
      setBusyOn(courseId, false)
    }
  }

  const handleMoveToCart = async (courseId: string) => {
    setBusyOn(courseId, true)
    try {
      await cartService.add(courseId)
      await wishlistService.toggle(courseId)
      setItems((prev) => prev.filter((i) => i.course._id !== courseId))
      setSelected((prev) => {
        const next = new Set(prev); next.delete(courseId); return next
      })
      toast.success("Moved to cart")
    } catch {
      toast.error("Failed to move to cart")
    } finally {
      setBusyOn(courseId, false)
    }
  }

  const handleBulkRemove = async () => {
    if (selected.size === 0) return
    if (!confirm(`Remove ${selected.size} course${selected.size > 1 ? "s" : ""} from your wishlist?`)) return
    const ids = Array.from(selected)
    await Promise.all(ids.map((id) => wishlistService.toggle(id).catch(() => {})))
    setItems((prev) => prev.filter((i) => !selected.has(i.course._id)))
    setSelected(new Set())
    toast.success(`Removed ${ids.length} course${ids.length > 1 ? "s" : ""}`)
  }

  const handleBulkAddToCart = async () => {
    if (selected.size === 0) return
    const ids = Array.from(selected)
    await Promise.all(ids.map((id) => cartService.add(id).catch(() => {})))
    await Promise.all(ids.map((id) => wishlistService.toggle(id).catch(() => {})))
    setItems((prev) => prev.filter((i) => !selected.has(i.course._id)))
    setSelected(new Set())
    toast.success(`Moved ${ids.length} to cart`)
  }

  // ─── states ─────────────────────────────────────────────────
  if (loading) return <SkeletonPage />

  if (items.length === 0) return <EmptyState recommended={recommended} navigate={navigate} />

  return (
    <div className="min-h-screen bg-white">
      {/* ─── HEADER ─── */}
      <header className="border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <p className="text-xs font-semibold tracking-[0.15em] text-[#6C3EF4] uppercase mb-2">
                Your collection
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                Wishlist
              </h1>
              <p className="text-slate-500 mt-2 text-sm sm:text-base">
                Courses you've saved for later. Move them to your cart when you're ready.
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-stretch gap-3 sm:gap-5">
              <Stat label="Items" value={items.length.toString()} />
              <div className="w-px bg-slate-200" />
              <Stat label="Total value" value={`₹${totalValue.toLocaleString()}`} />
              {totalSaved > 0 && (
                <>
                  <div className="w-px bg-slate-200" />
                  <Stat label="You save" value={`₹${totalSaved.toLocaleString()}`} accent />
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ─── BODY ─── */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <span className={`w-[18px] h-[18px] rounded border-[1.5px] flex items-center justify-center transition ${
              allChecked ? "bg-[#6C3EF4] border-[#6C3EF4]" : "bg-white border-slate-300"
            }`}>
              {allChecked && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                  <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            <input type="checkbox" className="sr-only" checked={allChecked} onChange={toggleAll} />
            <span className="text-sm text-slate-700 font-medium">
              {selected.size > 0
                ? <><span className="font-bold text-slate-900">{selected.size}</span> selected</>
                : "Select all"}
            </span>
          </label>

          <div className="flex items-center gap-2 ml-auto">
            {/* Search */}
            <div className="hidden sm:flex items-center bg-white border border-slate-300 rounded-lg w-64 focus-within:border-[#6C3EF4] focus-within:ring-2 focus-within:ring-[#6C3EF4]/15 transition">
              <Search className="w-4 h-4 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search wishlist…"
                className="flex-1 px-2.5 py-2 bg-transparent focus:outline-none text-sm text-slate-900 placeholder-slate-400"
              />
            </div>

            {/* Sort */}
            <div className="relative">
              <button onClick={() => setShowSort((s) => !s)}
                className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:border-slate-400 transition">
                <span className="text-slate-500 font-normal hidden sm:inline">Sort:</span>
                <span>{SORTS.find((s) => s.key === sort)?.label}</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
              {showSort && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowSort(false)} />
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-20">
                    {SORTS.map((s) => (
                      <button key={s.key}
                        onClick={() => { setSort(s.key); setShowSort(false) }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${
                          sort === s.key ? "text-[#6C3EF4] font-semibold" : "text-slate-700"
                        }`}>
                        {s.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bulk action bar (slides in when selected > 0) */}
        {selected.size > 0 && (
          <div className="flex flex-wrap items-center gap-3 mb-5 px-4 py-3 bg-slate-900 rounded-lg">
            <p className="text-sm font-semibold text-white">
              {selected.size} course{selected.size > 1 ? "s" : ""} selected
            </p>
            <div className="flex-1" />
            <button onClick={handleBulkAddToCart}
              className="flex items-center gap-2 px-4 py-2 bg-[#6C3EF4] hover:bg-[#5a32d6] text-white rounded-md text-sm font-semibold transition">
              <ShoppingCart className="w-4 h-4" />
              Move to cart
            </button>
            <button onClick={handleBulkRemove}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-md text-sm font-semibold transition">
              <Trash2 className="w-4 h-4" />
              Remove
            </button>
            <button onClick={() => setSelected(new Set())}
              className="text-sm text-white/70 hover:text-white">
              Cancel
            </button>
          </div>
        )}

        {/* List */}
        {filtered.length === 0 ? (
          <div className="border border-slate-200 rounded-xl p-14 text-center">
            <p className="text-slate-500">No matches for "<span className="font-semibold text-slate-700">{query}</span>"</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-200 border-y border-slate-200">
            {filtered.map((item) => (
              <WishRow key={item.course._id}
                item={item}
                checked={selected.has(item.course._id)}
                busy={busy.has(item.course._id)}
                onToggle={() => toggleOne(item.course._id)}
                onRemove={() => handleRemove(item.course._id)}
                onMoveToCart={() => handleMoveToCart(item.course._id)}
                onOpen={() => navigate(`/course/${item.course._id}`)}
              />
            ))}
          </ul>
        )}

        {/* Footer CTA */}
        <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-slate-50 border border-slate-200 rounded-xl">
          <div>
            <p className="text-sm font-bold text-slate-900">Looking for more?</p>
            <p className="text-sm text-slate-500 mt-0.5">
              Browse our full catalog of expert-led courses.
            </p>
          </div>
          <Link to="/courses"
            className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-900 text-white rounded-lg font-semibold text-sm hover:bg-slate-800 transition">
            Explore courses <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

/* ─── Wishlist row ──────────────────────────────────────────── */
function WishRow({
  item, checked, busy, onToggle, onRemove, onMoveToCart, onOpen,
}: {
  item: WishItem
  checked: boolean
  busy: boolean
  onToggle: () => void
  onRemove: () => void
  onMoveToCart: () => void
  onOpen: () => void
}) {
  const c = item.course
  const discount = c.oldPrice && c.oldPrice > c.price
    ? Math.round(((c.oldPrice - c.price) / c.oldPrice) * 100) : 0

  return (
    <li className={`group py-5 transition ${busy ? "opacity-50 pointer-events-none" : ""}`}>
      <div className="flex flex-col sm:flex-row gap-5 items-start">
        {/* Checkbox */}
        <label className="hidden sm:flex pt-1 cursor-pointer shrink-0">
          <span className={`w-[18px] h-[18px] rounded border-[1.5px] flex items-center justify-center transition ${
            checked ? "bg-[#6C3EF4] border-[#6C3EF4]" : "bg-white border-slate-300 group-hover:border-slate-400"
          }`}>
            {checked && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
          <input type="checkbox" className="sr-only" checked={checked} onChange={onToggle} />
        </label>

        {/* Thumbnail */}
        <button onClick={onOpen}
          className="relative w-full sm:w-56 aspect-video rounded-lg overflow-hidden bg-slate-100 shrink-0 hover:opacity-90 transition">
          {c.image ? (
            <img src={c.image} alt={c.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#6C3EF4]/20 to-pink-100 flex items-center justify-center">
              <Heart className="w-8 h-8 text-[#6C3EF4]/40" />
            </div>
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
            <span>{c.category}</span>
            {c.level && (<><span>·</span><span>{c.level}</span></>)}
          </div>
          <button onClick={onOpen}
            className="text-base sm:text-lg font-bold text-slate-900 hover:text-[#6C3EF4] text-left line-clamp-2">
            {c.title}
          </button>
          {c.instructor?.name && (
            <p className="text-sm text-slate-500 mt-1">by {c.instructor.name}</p>
          )}
          {c.rating ? (
            <div className="flex items-center gap-1 mt-2">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-sm font-semibold text-slate-900">{c.rating.toFixed(1)}</span>
            </div>
          ) : null}
        </div>

        {/* Price + actions */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 w-full sm:w-auto sm:min-w-[150px]">
          <div className="text-right">
            <p className="text-lg font-bold text-[#6C3EF4]">₹{c.price.toLocaleString()}</p>
            {c.oldPrice && c.oldPrice > c.price && (
              <p className="text-xs text-slate-400 line-through">₹{c.oldPrice.toLocaleString()}</p>
            )}
          </div>
          <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
            <button onClick={onMoveToCart}
              disabled={busy}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold transition whitespace-nowrap">
              <ShoppingCart className="w-4 h-4" />
              <span>Move to cart</span>
            </button>
            <button onClick={onRemove}
              disabled={busy}
              aria-label="Remove from wishlist"
              className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white border border-slate-300 hover:border-rose-400 hover:text-rose-600 text-slate-600 rounded-lg text-sm font-semibold transition">
              <Trash2 className="w-4 h-4" />
              <span className="sm:hidden">Remove</span>
            </button>
          </div>
        </div>
      </div>
    </li>
  )
}

/* ─── Atoms ──────────────────────────────────────────────────── */
function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="text-right sm:text-left">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
      <p className={`text-xl sm:text-2xl font-bold mt-0.5 ${accent ? "text-emerald-600" : "text-slate-900"}`}>
        {value}
      </p>
    </div>
  )
}

/* ─── Loading skeleton ───────────────────────────────────────── */
function SkeletonPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="h-3 w-24 bg-slate-100 rounded mb-3 animate-pulse" />
          <div className="h-9 w-48 bg-slate-100 rounded animate-pulse" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex gap-5 py-5 border-b border-slate-200 animate-pulse">
            <div className="w-56 aspect-video bg-slate-100 rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-20 bg-slate-100 rounded" />
              <div className="h-5 w-3/4 bg-slate-100 rounded" />
              <div className="h-4 w-32 bg-slate-100 rounded" />
            </div>
            <div className="w-32 space-y-2">
              <div className="h-6 w-20 bg-slate-100 rounded ml-auto" />
              <div className="h-9 w-32 bg-slate-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Empty state ────────────────────────────────────────────── */
function EmptyState({
  recommended, navigate,
}: { recommended: CourseProps[]; navigate: (path: string) => void }) {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-[#6C3EF4]/15 to-pink-200 rounded-full blur-xl" />
          <div className="relative w-full h-full rounded-full bg-gradient-to-br from-[#6C3EF4] to-pink-500 flex items-center justify-center shadow-lg">
            <Heart className="w-10 h-10 text-white" fill="currentColor" />
          </div>
        </div>

        <p className="text-xs font-semibold tracking-[0.15em] text-[#6C3EF4] uppercase mb-2">
          Your wishlist
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
          Your wishlist is empty
        </h1>
        <p className="text-slate-500 mb-8 max-w-md mx-auto">
          Save courses you're interested in by tapping the heart icon. They'll appear here for easy access later.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button onClick={() => navigate("/courses")}
            className="flex items-center gap-1.5 px-6 py-3 bg-slate-900 text-white rounded-lg font-semibold text-sm hover:bg-slate-800 transition">
            Browse courses <ArrowRight className="w-4 h-4" />
          </button>
          <button onClick={() => navigate("/my-learning")}
            className="px-6 py-3 bg-white border border-slate-300 text-slate-700 rounded-lg font-semibold text-sm hover:border-slate-400 transition">
            My learning
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
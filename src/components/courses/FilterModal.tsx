import { useEffect, useState } from "react"
import { X, Star } from "lucide-react"

export interface FilterState {
  topics: string[]
  levels: string[]
  price: "All" | "Free" | "Paid"
  minRating: number | null
  duration: string | null
}

const TOPICS = [
  "Cyber Security", "Front-end Development", "Back-end Development",
  "Data Science", "Cloud Computing", "Design", "Business", "Marketing",
]
const LEVELS = ["Beginner", "Intermediate", "Advanced"]
const DURATIONS = [
  { key: "0-2 Hours", label: "0–2 hours" },
  { key: "3-6 Hours", label: "3–6 hours" },
  { key: "7-12 Hours", label: "7–12 hours" },
  { key: "13+ Hours", label: "13+ hours" },
]
const RATINGS = [4.5, 4.0, 3.5, 3.0]

interface Props {
  mode: "sidebar" | "modal"
  isOpen?: boolean
  onClose?: () => void
  initial?: Partial<FilterState>
  onApply: (filters: FilterState) => void
}

export default function FilterModal({ mode, isOpen = false, onClose, initial, onApply }: Props) {
  const [topics, setTopics] = useState<string[]>(initial?.topics || [])
  const [levels, setLevels] = useState<string[]>(initial?.levels || [])
  const [price, setPrice] = useState<FilterState["price"]>(initial?.price || "All")
  const [minRating, setMinRating] = useState<number | null>(initial?.minRating ?? null)
  const [duration, setDuration] = useState<string | null>(initial?.duration ?? null)

  // In sidebar mode we apply immediately on each change for a snappier feel.
  // In modal mode the user confirms with the Apply button.
  const liveApply = mode === "sidebar"

  useEffect(() => {
    if (!liveApply) return
    onApply({ topics, levels, price, minRating, duration })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topics, levels, price, minRating, duration])

  useEffect(() => {
    if (mode !== "modal") return
    document.body.style.overflow = isOpen ? "hidden" : "unset"
    return () => { document.body.style.overflow = "unset" }
  }, [isOpen, mode])

  // Sync local state when initial changes (e.g. Clear All from page toolbar)
  useEffect(() => {
    setTopics(initial?.topics || [])
    setLevels(initial?.levels || [])
    setPrice(initial?.price || "All")
    setMinRating(initial?.minRating ?? null)
    setDuration(initial?.duration ?? null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(initial)])

  const toggle = (list: string[], setter: (v: string[]) => void, item: string) => {
    setter(list.includes(item) ? list.filter((i) => i !== item) : [...list, item])
  }

  const resetAll = () => {
    setTopics([]); setLevels([]); setPrice("All"); setMinRating(null); setDuration(null)
  }

  const confirm = () => {
    onApply({ topics, levels, price, minRating, duration })
    onClose?.()
  }

  const countActive =
    topics.length + levels.length +
    (price !== "All" ? 1 : 0) + (minRating ? 1 : 0) + (duration ? 1 : 0)

  /* ─── shared filter sections ─────────────────────────────────── */
  const sections = (
    <>
      {/* CATEGORY */}
      <Section title="Category">
        <div className="space-y-2">
          {TOPICS.map((t) => (
            <Checkbox key={t} label={t}
              checked={topics.includes(t)}
              onChange={() => toggle(topics, setTopics, t)} />
          ))}
        </div>
      </Section>

      {/* LEVEL */}
      <Section title="Level">
        <div className="space-y-2">
          {LEVELS.map((l) => (
            <Checkbox key={l} label={l}
              checked={levels.includes(l)}
              onChange={() => toggle(levels, setLevels, l)} />
          ))}
        </div>
      </Section>

      {/* PRICE */}
      <Section title="Price">
        <div className="space-y-2">
          {(["All", "Paid", "Free"] as const).map((p) => (
            <Radio key={p} label={p}
              checked={price === p}
              onChange={() => setPrice(p)} />
          ))}
        </div>
      </Section>

      {/* RATING */}
      <Section title="Rating">
        <div className="space-y-2">
          {RATINGS.map((r) => (
            <button key={r}
              onClick={() => setMinRating(minRating === r ? null : r)}
              className="w-full flex items-center gap-3 group">
              <span className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center shrink-0 transition ${
                minRating === r ? "border-[#6C3EF4]" : "border-slate-300 group-hover:border-slate-400"
              }`}>
                {minRating === r && <span className="w-2.5 h-2.5 rounded-full bg-[#6C3EF4]" />}
              </span>
              <span className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className={`w-3.5 h-3.5 ${
                    i <= Math.floor(r) ? "fill-amber-400 text-amber-400" : "text-slate-300"
                  }`} />
                ))}
              </span>
              <span className="text-sm text-slate-600 group-hover:text-slate-900">
                {r.toFixed(1)} & up
              </span>
            </button>
          ))}
        </div>
      </Section>

      {/* DURATION */}
      <Section title="Duration">
        <div className="space-y-2">
          {DURATIONS.map((d) => (
            <Checkbox key={d.key} label={d.label}
              checked={duration === d.key}
              onChange={() => setDuration(duration === d.key ? null : d.key)} />
          ))}
        </div>
      </Section>
    </>
  )

  /* ─── sidebar variant ────────────────────────────────────────── */
  if (mode === "sidebar") {
    return (
      <div className="bg-white border border-slate-200 rounded-lg">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Filter
          </h2>
          {countActive > 0 && (
            <button onClick={resetAll}
              className="text-xs font-semibold text-[#6C3EF4] hover:underline">
              Clear all
            </button>
          )}
        </div>
        <div className="px-5 py-5 max-h-[calc(100vh-11rem)] overflow-y-auto">
          {sections}
        </div>
      </div>
    )
  }

  /* ─── modal variant ──────────────────────────────────────────── */
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-base font-bold text-slate-900">Filter courses</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {sections}
        </div>
        <div className="px-6 py-3.5 border-t border-slate-200 flex gap-2">
          <button onClick={resetAll}
            className="flex-1 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition">
            Reset
          </button>
          <button onClick={confirm}
            className="flex-[2] py-2.5 rounded-lg bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition">
            Show results {countActive > 0 && `(${countActive})`}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── atoms ──────────────────────────────────────────────────── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="py-5 first:pt-0 last:pb-0 border-b border-slate-100 last:border-0">
      <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-[0.1em] mb-3">
        {title}
      </h3>
      {children}
    </div>
  )
}

function Checkbox({ label, checked, onChange }:
  { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group py-0.5">
      <span className={`w-[18px] h-[18px] rounded border-[1.5px] flex items-center justify-center shrink-0 transition ${
        checked
          ? "bg-[#6C3EF4] border-[#6C3EF4]"
          : "bg-white border-slate-300 group-hover:border-slate-400"
      }`}>
        {checked && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
            <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span className="text-sm text-slate-700 group-hover:text-slate-900">{label}</span>
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
    </label>
  )
}

function Radio({ label, checked, onChange }:
  { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group py-0.5">
      <span className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center shrink-0 transition ${
        checked ? "border-[#6C3EF4]" : "border-slate-300 group-hover:border-slate-400"
      }`}>
        {checked && <span className="w-2.5 h-2.5 rounded-full bg-[#6C3EF4]" />}
      </span>
      <span className="text-sm text-slate-700 group-hover:text-slate-900">{label}</span>
      <input type="radio" checked={checked} onChange={onChange} className="sr-only" />
    </label>
  )
}
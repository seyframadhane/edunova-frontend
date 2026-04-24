import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import {
  Search, SlidersHorizontal, ChevronDown, ChevronLeft, ChevronRight,
  X, LayoutGrid, List as ListIcon,
} from "lucide-react"
import { CourseCard, type CourseProps } from "../components/ui/CourseCard"
import FilterModal, { type FilterState } from "../components/courses/FilterModal"
import { courseService } from "../services/course.service"

const CATEGORIES = [
  "All", "Cyber Security", "Front-end Development", "Back-end Development",
  "Data Science", "Cloud Computing", "Design", "Business",
]

const SORTS = [
  { key: "popular", label: "Most Popular" },
  { key: "rating", label: "Highest Rated" },
  { key: "newest", label: "Newest" },
  { key: "price_asc", label: "Price: Low to High" },
  { key: "price_desc", label: "Price: High to Low" },
] as const

export default function CoursesPage() {
  const [params, setParams] = useSearchParams()
  const [courses, setCourses] = useState<CourseProps[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showFilter, setShowFilter] = useState(false)
  const [showSort, setShowSort] = useState(false)
  const [view, setView] = useState<"grid" | "list">("grid")
  const [searchValue, setSearchValue] = useState(params.get("q") || "")

  const page = Number(params.get("page") || 1)
  const limit = 12

  const currentFilters: FilterState = useMemo(() => ({
    topics: (params.get("topic")?.split(",") || []).filter(Boolean),
    levels: (params.get("level")?.split(",") || []).filter(Boolean),
    price: (params.get("price") as FilterState["price"]) || "All",
    minRating: params.get("minRating") ? Number(params.get("minRating")) : null,
    duration: params.get("duration"),
  }), [params])

  const activeSort = params.get("sort") || "popular"
  const activeCategory = params.get("topic")?.split(",")[0] || "All"

  useEffect(() => {
    setLoading(true)
    const q: Record<string, any> = { page, limit }
    ;["q", "topic", "level", "price", "minRating", "sort", "duration"].forEach((k) => {
      const v = params.get(k); if (v) q[k] = v
    })
    courseService.list(q)
      .then(({ data }: any) => {
        const mapped: CourseProps[] = data.data.map((c: any) => ({
          id: c._id,
          title: c.title,
          category: c.category,
          level: c.level,
          instructor: c.instructor?.name || "EduNova",
          price: c.price,
          oldPrice: c.oldPrice,
          rating: c.rating,
          image: c.image,
        }))
        setCourses(mapped)
        setTotal(data.meta?.total || mapped.length)
      })
      .catch(() => setCourses([]))
      .finally(() => setLoading(false))
  }, [params])

  const updateParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params)
    if (value === null || value === "") next.delete(key); else next.set(key, value)
    next.set("page", "1")
    setParams(next)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateParam("q", searchValue.trim() || null)
  }

  const handleCategory = (cat: string) => {
    updateParam("topic", cat === "All" ? null : cat)
  }

  const handleSort = (key: string) => {
    updateParam("sort", key === "popular" ? null : key)
    setShowSort(false)
  }

  const handleApplyFilters = (f: FilterState) => {
    const next = new URLSearchParams(params)
    f.topics.length ? next.set("topic", f.topics.join(",")) : next.delete("topic")
    f.levels.length ? next.set("level", f.levels.join(",")) : next.delete("level")
    f.price !== "All" ? next.set("price", f.price) : next.delete("price")
    f.minRating !== null ? next.set("minRating", String(f.minRating)) : next.delete("minRating")
    f.duration ? next.set("duration", f.duration) : next.delete("duration")
    next.set("page", "1")
    setParams(next)
  }

  const clearAll = () => {
    setParams(new URLSearchParams())
    setSearchValue("")
  }

  const removeFilter = (key: string, value?: string) => {
    const next = new URLSearchParams(params)
    if (value && (key === "topic" || key === "level")) {
      const current = next.get(key)?.split(",").filter((v) => v !== value) || []
      current.length ? next.set(key, current.join(",")) : next.delete(key)
    } else next.delete(key)
    next.set("page", "1")
    setParams(next)
  }

  const activeChips: Array<{ key: string; value: string; label: string }> = []
  if (params.get("q")) activeChips.push({ key: "q", value: "", label: `"${params.get("q")}"` })
  currentFilters.topics.forEach((t) => activeChips.push({ key: "topic", value: t, label: t }))
  currentFilters.levels.forEach((l) => activeChips.push({ key: "level", value: l, label: l }))
  if (currentFilters.price !== "All") activeChips.push({ key: "price", value: "", label: currentFilters.price })
  if (currentFilters.minRating) activeChips.push({ key: "minRating", value: "", label: `${currentFilters.minRating}★ & up` })
  if (currentFilters.duration) activeChips.push({ key: "duration", value: "", label: currentFilters.duration })

  const totalPages = Math.max(1, Math.ceil(total / limit))
  const changePage = (p: number) => {
    const next = new URLSearchParams(params)
    next.set("page", String(p))
    setParams(next)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ───────────── HEADER ───────────── */}
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <p className="text-xs font-semibold tracking-[0.15em] text-[#6C3EF4] uppercase mb-2">
                Catalog
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                All courses
              </h1>
              <p className="text-slate-500 mt-2 text-sm sm:text-base">
                Expert-led courses across tech, design, and business.
              </p>
            </div>

            <form onSubmit={handleSearch} className="w-full lg:w-96">
              <div className="flex items-center bg-white border border-slate-300 rounded-lg focus-within:border-[#6C3EF4] focus-within:ring-2 focus-within:ring-[#6C3EF4]/15 transition">
                <Search className="w-4 h-4 text-slate-400 ml-3.5 shrink-0" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search for anything"
                  className="flex-1 px-3 py-2.5 bg-transparent focus:outline-none text-sm text-slate-900 placeholder-slate-400"
                />
                {searchValue && (
                  <button type="button" onClick={() => { setSearchValue(""); updateParam("q", null) }}
                    className="p-1 mr-1 rounded hover:bg-slate-100">
                    <X className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Category tabs */}
          {/* <nav className="mt-8 -mb-[11px]">
            <div className="flex gap-1 overflow-x-auto scrollbar-none">
              {CATEGORIES.map((c) => {
                const active = activeCategory === c
                return (
                  <button key={c}
                    onClick={() => handleCategory(c)}
                    className={`shrink-0 px-4 py-3 text-sm font-semibold border-b-2 transition whitespace-nowrap ${
                      active
                        ? "border-[#6C3EF4] text-[#6C3EF4]"
                        : "border-transparent text-slate-600 hover:text-slate-900"
                    }`}>
                    {c}
                  </button>
                )
              })}
            </div>
          </nav> */}
        </div>
      </header>

      {/* ───────────── BODY ───────────── */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-6">
              <FilterModal mode="sidebar" initial={currentFilters} onApply={handleApplyFilters} />
            </div>
          </aside>

          {/* Main */}
          <main className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <p className="text-sm text-slate-600">
                {loading ? "Loading results…" : (
                  <>
                    <span className="font-bold text-slate-900">{total.toLocaleString()}</span>{" "}
                    result{total !== 1 ? "s" : ""}
                  </>
                )}
              </p>

              <div className="flex items-center gap-2">
                <button onClick={() => setShowFilter(true)}
                  className="lg:hidden flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:border-slate-400">
                  <SlidersHorizontal className="w-4 h-4" />
                  Filter
                </button>

                <div className="relative">
                  <button onClick={() => setShowSort((s) => !s)}
                    className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:border-slate-400 transition">
                    <span className="text-slate-500 font-normal">Sort by:</span>
                    <span>{SORTS.find((s) => s.key === activeSort)?.label}</span>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>
                  {showSort && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowSort(false)} />
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-20">
                        {SORTS.map((s) => (
                          <button key={s.key} onClick={() => handleSort(s.key)}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${
                              activeSort === s.key ? "text-[#6C3EF4] font-semibold" : "text-slate-700"
                            }`}>
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div className="hidden sm:flex bg-white border border-slate-300 rounded-lg p-0.5">
                  <button onClick={() => setView("grid")}
                    aria-label="Grid view"
                    className={`p-1.5 rounded ${view === "grid" ? "bg-slate-900 text-white" : "text-slate-500"}`}>
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button onClick={() => setView("list")}
                    aria-label="List view"
                    className={`p-1.5 rounded ${view === "list" ? "bg-slate-900 text-white" : "text-slate-500"}`}>
                    <ListIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active chips */}
            {activeChips.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-5 pb-5 border-b border-slate-200">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-1">
                  Filtered by:
                </span>
                {activeChips.map((chip, i) => (
                  <button key={i} onClick={() => removeFilter(chip.key, chip.value)}
                    className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-semibold transition">
                    {chip.label}
                    <X className="w-3 h-3" />
                  </button>
                ))}
                <button onClick={clearAll}
                  className="text-xs font-semibold text-[#6C3EF4] hover:underline ml-1">
                  Clear all
                </button>
              </div>
            )}

            {/* Grid / loading / empty */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="w-full aspect-video bg-slate-100 rounded-lg mb-3" />
                    <div className="h-4 bg-slate-100 rounded mb-2" />
                    <div className="h-4 bg-slate-100 rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : courses.length === 0 ? (
              <div className="border border-slate-200 rounded-xl p-14 text-center">
                <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">No matching courses</h3>
                <p className="text-sm text-slate-500 mb-5 max-w-sm mx-auto">
                  Try broadening your filters or searching for a different topic.
                </p>
                <button onClick={clearAll}
                  className="px-5 py-2 rounded-lg bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition">
                  Reset filters
                </button>
              </div>
            ) : (
              <div className={view === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                : "space-y-4"
              }>
                {courses.map((c) => (
                  <CourseCard key={c.id} course={c} className={view === "list" ? "sm:flex-row" : ""} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && !loading && (
              <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-200">
                <p className="text-sm text-slate-500 hidden sm:block">
                  Showing <span className="font-semibold text-slate-900">
                    {(page - 1) * limit + 1}–{Math.min(page * limit, total)}
                  </span> of {total}
                </p>
                <div className="flex items-center gap-1 mx-auto sm:mx-0">
                  <button onClick={() => changePage(page - 1)} disabled={page <= 1}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed">
                    <ChevronLeft className="w-4 h-4" /> Prev
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                    let p = i + 1
                    if (totalPages > 5 && page > 3) p = Math.min(page - 2 + i, totalPages)
                    return (
                      <button key={p} onClick={() => changePage(p)}
                        className={`min-w-[36px] h-9 rounded-lg font-semibold text-sm transition ${
                          page === p
                            ? "bg-slate-900 text-white"
                            : "text-slate-600 hover:bg-slate-100"
                        }`}>
                        {p}
                      </button>
                    )
                  })}
                  <button onClick={() => changePage(page + 1)} disabled={page >= totalPages}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed">
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      <FilterModal
        mode="modal"
        isOpen={showFilter}
        onClose={() => setShowFilter(false)}
        initial={currentFilters}
        onApply={handleApplyFilters}
      />
    </div>
  )
}
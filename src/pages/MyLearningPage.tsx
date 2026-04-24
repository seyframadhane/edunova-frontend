import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { BookOpen, FileText, Video, Mic, GraduationCap, Clock } from "lucide-react"
import { enrollmentService } from "../services/enrollment.service"

type Enrollment = {
  _id: string
  progress: number
  course: { _id: string; title: string; image: string; level?: string; durationHours?: number }
}

export default function MyLearningPage() {
  const [items, setItems] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    enrollmentService.mine()
      .then(({ data }: any) => setItems(data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-10 text-center text-gray-500">Loading…</div>

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
          <GraduationCap /> My Learning
        </h1>
        <p className="text-slate-500 text-sm mt-1">Pick up where you left off — or jump into a new study mode.</p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
          <BookOpen size={48} className="mx-auto text-slate-300" />
          <h2 className="mt-4 text-xl font-semibold text-slate-900">You haven't enrolled in any course yet</h2>
          <p className="text-slate-500 text-sm mt-1">Find a course you love and start learning today.</p>
          <button onClick={() => navigate("/courses")}
            className="mt-6 px-6 py-3 bg-[#6C3EF4] text-white rounded-xl font-semibold">Browse courses</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {items.map(e => (
            <article key={e._id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition">
              <div className="flex">
                <img src={e.course.image} alt={e.course.title} className="w-36 h-36 object-cover flex-shrink-0" />
                <div className="p-4 flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    {e.course.level && <span className="px-2 py-0.5 rounded-full bg-slate-100">{e.course.level}</span>}
                    {e.course.durationHours && <span className="flex items-center gap-1"><Clock size={12} /> {e.course.durationHours}h</span>}
                  </div>
                  <h3 className="mt-1 text-sm font-semibold text-slate-900 line-clamp-2">{e.course.title}</h3>

                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span>Progress</span><span className="font-semibold text-slate-700">{e.progress ?? 0}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#6C3EF4] to-indigo-500" style={{ width: `${e.progress ?? 0}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 grid grid-cols-3 divide-x divide-slate-100">
                <Link to={`/courses/${e.course._id}/study/pdf`}
                  className="flex items-center justify-center gap-1.5 py-3 text-xs font-medium text-indigo-700 hover:bg-indigo-50">
                  <FileText size={14} /> PDF
                </Link>
                <Link to={`/courses/${e.course._id}/study/video`}
                  className="flex items-center justify-center gap-1.5 py-3 text-xs font-medium text-purple-700 hover:bg-purple-50">
                  <Video size={14} /> Video
                </Link>
                <Link to={`/courses/${e.course._id}/study/voice`}
                  className="flex items-center justify-center gap-1.5 py-3 text-xs font-medium text-emerald-700 hover:bg-emerald-50">
                  <Mic size={14} /> Voice
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
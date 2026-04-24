import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Award, Calendar, Eye, GraduationCap, Loader2 } from "lucide-react"
import { certificateService, type Certificate } from "../services/certificate.service"

export default function CertificatesPage() {
  const [certs, setCerts] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    certificateService
      .mine()
      .then(({ data }) => setCerts(data.data || []))
      .catch(() => setCerts([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#6C3EF4] via-[#5a32d6] to-[#4d2bb5] text-white">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <GraduationCap className="absolute -bottom-10 -right-10 w-72 h-72" />
          <Award className="absolute top-6 right-1/3 w-24 h-24" />
        </div>
        <div className="max-w-6xl mx-auto px-6 py-12 sm:py-16 relative">
          <div className="flex items-center gap-3 mb-3">
            <Award className="w-8 h-8" />
            <h1 className="text-3xl sm:text-4xl font-bold">My Certificates</h1>
          </div>
          <p className="text-white/80 max-w-2xl">
            Every course you complete on EduNova earns you an official certificate of achievement.
            Showcase your learning journey to the world.
          </p>
          <div className="mt-6 inline-flex items-center gap-6 bg-white/10 backdrop-blur rounded-xl px-5 py-3">
            <div>
              <p className="text-xs uppercase tracking-widest text-white/70">Total earned</p>
              <p className="text-2xl font-bold">{loading ? "—" : certs.length}</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div>
              <p className="text-xs uppercase tracking-widest text-white/70">Latest</p>
              <p className="text-sm font-semibold">
                {loading
                  ? "—"
                  : certs[0]
                  ? new Date(certs[0].issuedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "None yet"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#6C3EF4]" />
          </div>
        ) : certs.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center max-w-2xl mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#6C3EF4]/10 text-[#6C3EF4] flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-semibold text-slate-800 mb-2">No certificates yet</h2>
            <p className="text-slate-500 mb-6">
              Complete a course to earn your first official EduNova certificate.
            </p>
            <Link
              to="/courses"
              className="inline-flex px-6 py-3 rounded-lg bg-[#6C3EF4] text-white font-medium hover:bg-[#5a32d6] transition shadow"
            >
              Browse courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {certs.map((c) => (
              <Link
                key={c._id}
                to={`/certificates/${c._id}`}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Mini certificate preview */}
                <div className="relative h-44 bg-gradient-to-br from-[#fdfaff] to-[#f0e8ff] overflow-hidden">
                  <div className="absolute inset-3 border-2 border-[#6C3EF4]/40 rounded" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                    <p className="text-[9px] uppercase tracking-[0.3em] text-slate-500">
                      Certificate of Completion
                    </p>
                    <div className="w-12 h-px bg-[#6C3EF4]/40 my-2" />
                    <p className="text-sm font-semibold text-slate-800 line-clamp-2 px-2">
                      {c.course.title}
                    </p>
                  </div>
                  <div className="absolute bottom-2 right-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#6C3EF4] to-[#4d2bb5] flex items-center justify-center shadow">
                      <GraduationCap className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-5">
                  <h3 className="font-semibold text-slate-900 line-clamp-1 group-hover:text-[#6C3EF4] transition">
                    {c.course.title}
                  </h3>
                  {c.course.category && (
                    <p className="text-xs text-slate-500 mt-1">{c.course.category}</p>
                  )}

                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-3">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(c.issuedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                    <span className="font-mono text-[11px] text-slate-500">{c.code}</span>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-[#6C3EF4]">
                      <Eye className="w-4 h-4" />
                      View
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
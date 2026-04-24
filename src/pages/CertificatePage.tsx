import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { ArrowLeft, Download, Printer, Share2, Copy, Check, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { certificateService, type Certificate } from "../services/certificate.service"
import { useAuth } from "../context/AuthContext"
import CertificateTemplate from "../components/certificate/CertificateTemplate"

export default function CertificatePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [cert, setCert] = useState<Certificate | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setLoading(true)
    certificateService
      .mine()
      .then(({ data }) => {
        const found = data.data.find((c) => c._id === id)
        setCert(found || null)
      })
      .catch(() => setCert(null))
      .finally(() => setLoading(false))
  }, [id])

  const handlePrint = () => window.print()

  const handleCopyCode = () => {
    if (!cert) return
    navigator.clipboard.writeText(cert.code)
    setCopied(true)
    toast.success("Verification code copied")
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    if (!cert) return
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({
          title: `EduNova Certificate · ${cert.course.title}`,
          text: `I just completed ${cert.course.title} on EduNova!`,
          url,
        })
      } catch {
        /* user cancelled */
      }
    } else {
      navigator.clipboard.writeText(url)
      toast.success("Link copied to clipboard")
    }
  }

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#6C3EF4]" />
      </div>
    )
  }

  if (!cert) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4 text-center px-6">
        <h2 className="text-2xl font-semibold text-slate-800">Certificate not found</h2>
        <p className="text-slate-500">It may have been removed or never existed.</p>
        <Link
          to="/certificates"
          className="px-5 py-2.5 rounded-lg bg-[#6C3EF4] text-white font-medium hover:bg-[#5a32d6] transition"
        >
          Back to my certificates
        </Link>
      </div>
    )
  }

  const studentName =
    `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() ||
    user?.email ||
    "Student"

  return (
    <div className="min-h-screen bg-slate-50 py-8 print:py-0 print:bg-white">
      {/* Action bar — hidden when printing */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-6 print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-slate-700 hover:text-[#6C3EF4] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopyCode}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-300 hover:bg-white transition text-sm"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              <span className="font-mono text-xs">{cert.code}</span>
            </button>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 hover:bg-white transition text-sm"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 hover:bg-white transition text-sm"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#6C3EF4] text-white hover:bg-[#5a32d6] transition text-sm font-medium shadow"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* Certificate */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 print:p-0 print:max-w-none">
        <CertificateTemplate
          studentName={studentName}
          courseTitle={cert.course.title}
          instructorName={
            typeof cert.course.instructor === "object"
              ? cert.course.instructor?.name
              : undefined
          }
          durationHours={cert.course.durationHours}
          category={cert.course.category}
          issuedAt={cert.issuedAt}
          code={cert.code}
        />
      </div>

      {/* Verification footer */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-10 print:hidden">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm text-center">
          <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">
            Verify this certificate
          </p>
          <p className="text-slate-700">
            Anyone can verify this certificate by entering the code{" "}
            <span className="font-mono font-semibold text-[#6C3EF4]">
              {cert.code}
            </span>{" "}
            on the EduNova verification page.
          </p>
        </div>
      </div>
    </div>
  )
}
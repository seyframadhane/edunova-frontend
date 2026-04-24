import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import StudyHeader from "../../components/study/StudyHeader"
import AiChatPanel from "../../components/study/AiChatPanel"
import SummaryModal from "../../components/study/SummaryModal"
import QuizModal from "../../components/study/QuizModal"
import { api } from "../../services/api"

type Course = { _id: string; title: string; pdfUrl?: string; image?: string }

export default function StudyPdfPage() {
  const { courseId } = useParams()
  const [course, setCourse] = useState<Course | null>(null)
  const [showSummary, setShowSummary] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)

  useEffect(() => {
    api.get(`/courses/${courseId}`).then(r => setCourse(r.data.course || r.data.data || r.data))
  }, [courseId])

  if (!course) return <div className="p-8 text-slate-500">Loading course…</div>

  const pdfUrl = course.pdfUrl || "https://www.africau.edu/images/default/sample.pdf"

  return (
    <div className="min-h-screen bg-slate-50">
      <StudyHeader courseTitle={course.title} mode="pdf" />
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4 p-4 h-[calc(100vh-56px)]">
        <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white">
          <iframe src={pdfUrl} title={course.title} className="w-full h-full" />
        </div>
        <div className="h-full min-h-0">
          <AiChatPanel
            courseId={course._id}
            courseTitle={course.title}
            onRequestSummary={() => setShowSummary(true)}
            onRequestQuiz={() => setShowQuiz(true)}
          />
        </div>
      </div>
      {showSummary && <SummaryModal courseId={course._id} courseTitle={course.title} onClose={() => setShowSummary(false)} />}
      {showQuiz && <QuizModal courseId={course._id} courseTitle={course.title} onClose={() => setShowQuiz(false)} />}
    </div>
  )
}
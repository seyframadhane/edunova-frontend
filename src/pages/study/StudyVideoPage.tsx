import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import StudyHeader from "../../components/study/StudyHeader"
import AiChatPanel from "../../components/study/AiChatPanel"
import SummaryModal from "../../components/study/SummaryModal"
import QuizModal from "../../components/study/QuizModal"
import { useEmotion } from "../../components/study/EmotionMonitor"
import { aiService } from "../../services/ai.service"
import { api } from "../../services/api"

type Course = { _id: string; title: string; videoUrl?: string }

export default function StudyVideoPage() {
  const { courseId } = useParams()
  const [course, setCourse] = useState<Course | null>(null)
  const [showSummary, setShowSummary] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)
  const [camOn, setCamOn] = useState(true)

  const { videoRef, emotion, error } = useEmotion(camOn)

  useEffect(() => {
    api.get(`/courses/${courseId}`).then(r => setCourse(r.data.course || r.data.data || r.data))
  }, [courseId])

  // Log detected emotion to backend every 15 seconds
  useEffect(() => {
    if (!course?._id) return
    const t = setInterval(() => {
      aiService.logEmotion(course._id, emotion)
    }, 15_000)
    return () => clearInterval(t)
  }, [course?._id, emotion])

  if (!course) return <div className="p-8 text-slate-500">Loading course…</div>

  const videoUrl = course.videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"

  return (
    <div className="min-h-screen bg-slate-50">
      <StudyHeader courseTitle={course.title} mode="video" />
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4 p-4">
        <div className="space-y-4">
          <div className="rounded-2xl overflow-hidden bg-black aspect-video">
            <video src={videoUrl} controls className="w-full h-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-4">
            <div>
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 relative">
                <video ref={videoRef} muted playsInline className="w-full aspect-[4/3] object-cover" />
                <div className="absolute bottom-2 right-2">
                  <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-white/90 text-slate-800">
                    {emotion}
                  </span>
                </div>
                {error && <div className="absolute inset-0 bg-black/70 text-white text-xs p-3 flex items-center justify-center text-center">{error}</div>}
              </div>
              <button onClick={() => setCamOn(c => !c)} className="mt-2 w-full text-xs px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50">
                {camOn ? "Pause camera" : "Resume camera"}
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">Real-time engagement</div>
              <div className="text-2xl font-bold text-slate-900 capitalize">{emotion}</div>
              <p className="text-sm text-slate-600 mt-2">
                {emotion === "confused" && "You seem confused. Try pausing and asking the AI tutor to explain."}
                {emotion === "frustrated" && "Taking a short break often helps reset focus."}
                {emotion === "engaged" && "Great — you're locked in. Keep going!"}
                {emotion === "confident" && "Nice flow. Consider jumping to the quiz when you're ready."}
                {emotion === "neutral" && "Neutral focus. Ask a question to deepen engagement."}
              </p>
            </div>
          </div>
        </div>

        <div className="h-[70vh] lg:h-[calc(100vh-88px)] lg:sticky lg:top-[72px]">
          <AiChatPanel
            courseId={course._id}
            courseTitle={course.title}
            extraContext={`student emotion: ${emotion}`}
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
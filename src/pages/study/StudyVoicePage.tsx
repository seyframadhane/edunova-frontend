import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { Mic, MicOff, Sparkles, FileQuestion } from "lucide-react"
import StudyHeader from "../../components/study/StudyHeader"
import SummaryModal from "../../components/study/SummaryModal"
import QuizModal from "../../components/study/QuizModal"
import { aiService, type ChatMessage } from "../../services/ai.service"
import { api } from "../../services/api"

type Course = { _id: string; title: string }

export default function StudyVoicePage() {
  const { courseId } = useParams()
  const [course, setCourse] = useState<Course | null>(null)
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [speaking, setSpeaking] = useState(false)
  const [thinking, setThinking] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)
  const recogRef = useRef<any>(null)

  useEffect(() => {
    api.get(`/courses/${courseId}`).then(r => setCourse(r.data.course || r.data.data || r.data))
  }, [courseId])

  useEffect(() => {
    if (!course) return
    const greeting = `Hi, I'm your AI tutor for ${course.title}. Press the microphone and ask me anything.`
    setMessages([{ role: "assistant", content: greeting, at: Date.now() }])
    speak(greeting)
    // eslint-disable-next-line
  }, [course])

  function speak(text: string) {
    if (!("speechSynthesis" in window)) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.rate = 1
    u.onstart = () => setSpeaking(true)
    u.onend = () => setSpeaking(false)
    window.speechSynthesis.speak(u)
  }

  function startListening() {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) { alert("Speech recognition isn't supported in this browser. Try Chrome."); return }
    const rec = new SR()
    rec.continuous = false
    rec.interimResults = true
    rec.lang = "en-US"
    rec.onresult = (e: any) => {
      let text = ""
      for (let i = e.resultIndex; i < e.results.length; i++) text += e.results[i][0].transcript
      setTranscript(text)
    }
    rec.onend = async () => {
      setListening(false)
      const final = transcript.trim()
      if (!final || !course) return
      const userMsg: ChatMessage = { role: "user", content: final, at: Date.now() }
      setMessages(m => [...m, userMsg])
      setTranscript("")
      setThinking(true)
      try {
        const reply = await aiService.chat(course._id, [...messages, userMsg], final)
        setMessages(m => [...m, { role: "assistant", content: reply, at: Date.now() }])
        speak(reply)
      } finally {
        setThinking(false)
      }
    }
    rec.onerror = () => setListening(false)
    recogRef.current = rec
    rec.start()
    setListening(true)
  }

  function stopListening() { recogRef.current?.stop(); setListening(false) }

  if (!course) return <div className="p-8 text-slate-500">Loading course…</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <StudyHeader courseTitle={course.title} mode="voice" />

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Talk to your AI tutor</h2>
          <p className="text-sm text-slate-600 mt-1">Tap the mic, ask a question, then listen to the answer.</p>
        </div>

        <div className="flex justify-center mb-10">
          <button
            onClick={listening ? stopListening : startListening}
            className={`relative w-40 h-40 rounded-full flex items-center justify-center text-white shadow-2xl transition-transform
              ${listening ? "bg-rose-500 scale-105" : speaking ? "bg-emerald-500" : "bg-gradient-to-br from-[#6C3EF4] to-indigo-500"}`}
          >
            {(listening || speaking) && (
              <>
                <span className="absolute inset-0 rounded-full animate-ping bg-current opacity-30" />
                <span className="absolute -inset-3 rounded-full animate-pulse bg-current opacity-10" />
              </>
            )}
            {listening ? <MicOff size={48} /> : <Mic size={48} />}
          </button>
        </div>

        <div className="text-center text-sm text-slate-600 min-h-[24px] mb-6">
          {listening && (transcript || "Listening…")}
          {!listening && speaking && "Speaking…"}
          {!listening && thinking && "Thinking…"}
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 p-4 space-y-3 max-h-[40vh] overflow-y-auto">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm whitespace-pre-wrap ${
                m.role === "user" ? "bg-[#6C3EF4] text-white" : "bg-slate-100 text-slate-800"
              }`}>{m.content}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 justify-center mt-6">
          <button onClick={() => setShowSummary(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-[#6C3EF4] text-sm text-slate-800">
            <Sparkles size={16} /> Summary
          </button>
          <button onClick={() => setShowQuiz(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-[#6C3EF4] text-sm text-slate-800">
            <FileQuestion size={16} /> Take quiz
          </button>
        </div>
      </div>

      {showSummary && <SummaryModal courseId={course._id} courseTitle={course.title} onClose={() => setShowSummary(false)} />}
      {showQuiz && <QuizModal courseId={course._id} courseTitle={course.title} onClose={() => setShowQuiz(false)} />}
    </div>
  )
}
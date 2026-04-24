import { useEffect, useRef, useState } from "react"
import { Send, Sparkles, FileQuestion, Loader2 } from "lucide-react"
import { aiService, type ChatMessage } from "../../services/ai.service"

type Props = {
  courseTitle: string
  onRequestSummary: () => void
  onRequestQuiz: () => void
  extraContext?: string // emotion label, current pdf page, etc.
}

export default function AiChatPanel({ courseTitle, onRequestSummary, onRequestQuiz, extraContext }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: `Hi! I'm your AI tutor for "${courseTitle}". Ask me anything about this course.`, at: Date.now() },
  ])
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, sending])

  async function send() {
    const text = input.trim()
    if (!text || sending) return
    const userMsg: ChatMessage = { role: "user", content: text, at: Date.now() }
    setMessages(m => [...m, userMsg])
    setInput("")
    setSending(true)
    try {
      const reply = await aiService.chat(courseTitle, [...messages, userMsg], text + (extraContext ? `\n[ctx: ${extraContext}]` : ""))
      setMessages(m => [...m, { role: "assistant", content: reply, at: Date.now() }])
    } finally {
      setSending(false)
    }
  }

  return (
    <aside className="flex flex-col h-full bg-white border border-slate-200 rounded-2xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-[#6C3EF4]/5 to-indigo-500/5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6C3EF4] to-indigo-500 flex items-center justify-center text-white">
          <Sparkles size={16} />
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-900">AI Tutor</div>
          <div className="text-xs text-slate-500">Ask anything about this course</div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm whitespace-pre-wrap leading-relaxed ${
              m.role === "user"
                ? "bg-[#6C3EF4] text-white rounded-br-sm"
                : "bg-slate-100 text-slate-800 rounded-bl-sm"
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="bg-slate-100 rounded-2xl px-3.5 py-2.5 text-sm text-slate-500 flex items-center gap-2">
              <Loader2 size={14} className="animate-spin" /> Thinking…
            </div>
          </div>
        )}
      </div>

      <div className="px-4 py-2 border-t border-slate-100 flex gap-2">
        <button onClick={onRequestSummary} className="flex-1 text-xs font-medium px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 inline-flex items-center justify-center gap-1.5">
          <Sparkles size={14} /> Summary
        </button>
        <button onClick={onRequestQuiz} className="flex-1 text-xs font-medium px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 inline-flex items-center justify-center gap-1.5">
          <FileQuestion size={14} /> Take quiz
        </button>
      </div>

      <div className="p-3 border-t border-slate-100 flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Ask about this course…"
          className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6C3EF4]/30 focus:border-[#6C3EF4]"
        />
        <button onClick={send} disabled={sending || !input.trim()}
          className="w-10 h-10 rounded-xl bg-[#6C3EF4] hover:bg-[#5a32d6] disabled:opacity-50 text-white flex items-center justify-center">
          <Send size={16} />
        </button>
      </div>
    </aside>
  )
}
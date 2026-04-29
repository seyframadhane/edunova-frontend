import { useEffect, useRef, useState } from "react";
import { Loader2, Send, Sparkles } from "lucide-react";
import { aiService, type ChatMessage } from "../../services/ai.service";

type Props = {
  courseId: string;
  courseTitle: string;
  extraContext?: string;

  // Keep these optional so other pages don't break,
  // but we do not render Summary / Quiz buttons here anymore.
  onRequestSummary?: () => void;
  onRequestQuiz?: () => void;
};

export default function AiChatPanel({
  courseId,
  courseTitle,
  extraContext,
}: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: `Hi! I'm your AI tutor for "${courseTitle}". Ask me anything about this course.`,
      at: Date.now(),
    },
  ]);

  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, sending]);

  async function send() {
    const text = input.trim();
    if (!text || sending) return;

    const userMsg: ChatMessage = {
      role: "user",
      content: text,
      at: Date.now(),
    };

    setMessages((current) => [...current, userMsg]);
    setInput("");
    setSending(true);

    try {
      const reply = await aiService.chat(
        courseId,
        [...messages, userMsg],
        text + (extraContext ? `\n[ctx: ${extraContext}]` : "")
      );

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: reply,
          at: Date.now(),
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: "Sorry, I had trouble answering that. Try again.",
          at: Date.now(),
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="shrink-0 border-b border-slate-200 bg-indigo-50/70 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white">
            <Sparkles className="h-5 w-5" />
          </div>

          <div>
            <h2 className="font-black text-slate-950">AI Tutor</h2>
            <p className="text-sm text-slate-500">
              Ask anything about this course
            </p>
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5"
      >
        {messages.map((message, index) => {
          const isUser = message.role === "user";

          return (
            <div
              key={index}
              className={`flex ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[86%] rounded-2xl px-4 py-3 text-sm leading-7 ${
                  isUser
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-800"
                }`}
              >
                {message.content}
              </div>
            </div>
          );
        })}

        {sending && (
          <div className="flex justify-start">
            <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              Thinking…
            </div>
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-slate-200 bg-white p-4">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") send();
            }}
            placeholder="Ask about this lesson…"
            className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
          />

          <button
            onClick={send}
            disabled={!input.trim() || sending}
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-200"
          >
            {sending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
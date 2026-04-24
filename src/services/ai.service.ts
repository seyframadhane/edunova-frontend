import { api } from "./api"

export type ChatMessage = { role: "user" | "assistant"; content: string; at: number }

export type QuizQuestion = {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export const aiService = {
  async chat(courseId: string, history: ChatMessage[], message: string): Promise<string> {
    const { data } = await api.post("/ai/chat", {
      courseId,
      history: history.map(m => ({ role: m.role, content: m.content })),
      message,
    })
    return data?.data?.reply || ""
  },

  async summarize(courseId: string): Promise<string> {
    const { data } = await api.post("/ai/summary", { courseId })
    return data?.data?.summary || ""
  },

  async quiz(courseId: string, count = 4): Promise<QuizQuestion[]> {
    const { data } = await api.post("/ai/quiz", { courseId, count })
    return (data?.data?.questions || []) as QuizQuestion[]
  },

  async logEmotion(courseId: string, emotion: string): Promise<void> {
    try { await api.post("/ai/emotion", { courseId, emotion }) } catch { /* silent */ }
  },
}
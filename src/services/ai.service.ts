// Mocked AI service. Replace each TODO with a real call to your backend
// (e.g. POST /api/ai/chat) once the endpoints exist.

export type ChatMessage = { role: "user" | "assistant"; content: string; at: number }

export type QuizQuestion = {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

const delay = (ms: number) => new Promise(r => setTimeout(r, ms))

export const aiService = {
  async chat(courseTitle: string, history: ChatMessage[], userMsg: string): Promise<string> {
    // TODO: replace with POST /api/ai/chat { courseId, history, message }
    await delay(700 + Math.random() * 700)
    const hints = [
      `Great question about "${courseTitle}". In simple terms, this part focuses on the core idea and how to apply it in practice.`,
      `Here's the short version: break it into three steps — understand the concept, see an example, then try one yourself.`,
      `Think of it this way: the goal of this lesson is to give you a mental model you can reuse. Want me to give you an example?`,
      `Good follow-up. The key distinction is *what* you do vs *why* you do it — the lesson in "${courseTitle}" spends more time on the why.`,
    ]
    return hints[Math.floor(Math.random() * hints.length)] + `\n\nYou asked: "${userMsg.slice(0, 140)}"`
  },

  async summarize(courseTitle: string): Promise<string> {
    // TODO: replace with POST /api/ai/summary { courseId }
    await delay(1200)
    return [
      `## Summary — ${courseTitle}`,
      ``,
      `**Main idea.** This course introduces the core concepts and gives you a practical workflow you can reuse.`,
      ``,
      `**Key takeaways**`,
      `- Understand the foundations before jumping into tools.`,
      `- Practice with small, focused examples.`,
      `- Reflect on each exercise to reinforce the mental model.`,
      ``,
      `**What's next.** Try the quiz to check your understanding.`,
    ].join("\n")
  },

  async quiz(courseTitle: string): Promise<QuizQuestion[]> {
    // TODO: replace with POST /api/ai/quiz { courseId }
    await delay(1400)
    return [
      {
        question: `What is the most important first step when studying "${courseTitle}"?`,
        options: ["Memorize every detail", "Understand the core idea", "Skip to the exercises", "Read the FAQ"],
        correctIndex: 1,
        explanation: "Start with the core idea so the details have something to attach to.",
      },
      {
        question: "Which habit helps the most with retention?",
        options: ["Passive re-reading", "Spaced practice", "Cramming", "Watching at 2x speed"],
        correctIndex: 1,
        explanation: "Spaced practice is consistently shown to outperform cramming.",
      },
      {
        question: "When you get stuck, what's a good next step?",
        options: ["Give up", "Ask the AI tutor", "Skip the lesson", "Restart the course"],
        correctIndex: 1,
        explanation: "Asking clarifying questions speeds up learning more than brute-forcing alone.",
      },
      {
        question: "What does a good summary contain?",
        options: ["Every word from the course", "Only the title", "Key ideas + how to apply them", "Only definitions"],
        correctIndex: 2,
        explanation: "A good summary distills key ideas and how to use them.",
      },
    ]
  },
}
// src/components/ai/CourseAssistantPanel.tsx
import { useMemo, useState } from "react";
import { MessageSquare, X, Bot, Send } from "lucide-react";
import { api } from "../../services/api";

type ChatMsg = {
	id: string;
	role: "user" | "assistant";
	content: string;
};

export default function CourseAssistantPanel({ courseId }: { courseId: string }) {
	const [isOpen, setIsOpen] = useState(false);
	const [inputValue, setInputValue] = useState("");
	const [loading, setLoading] = useState(false);
	const [messages, setMessages] = useState<ChatMsg[]>([]);

	const toggle = () => setIsOpen((p) => !p);

	const canSend = useMemo(
		() => inputValue.trim().length > 0 && !loading,
		[inputValue, loading]
	);

	const send = async () => {
		if (!canSend) return;

		const prompt = inputValue.trim();
		setInputValue("");

		const userMsg: ChatMsg = {
			id: crypto.randomUUID(),
			role: "user",
			content: prompt,
		};
		setMessages((m) => [...m, userMsg]);
		setLoading(true);

		try {
			const { data } = await api.post("/chat/course", { courseId, prompt });
			const assistantText = data?.data?.answer ?? "No answer returned.";

			const aiMsg: ChatMsg = {
				id: crypto.randomUUID(),
				role: "assistant",
				content: assistantText,
			};

			setMessages((m) => [...m, aiMsg]);
		} catch (e: any) {
			const aiMsg: ChatMsg = {
				id: crypto.randomUUID(),
				role: "assistant",
				content:
					e?.response?.data?.message ||
					e?.message ||
					"Error while contacting AI.",
			};
			setMessages((m) => [...m, aiMsg]);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			{/* Floating open button */}
			{!isOpen && (
				<button
					type="button"
					onClick={toggle}
					className="fixed bottom-6 right-6 z-[80] p-3 bg-white border border-gray-100 rounded-2xl shadow-xl hover:shadow-2xl transition-all"
					title="Course AI Assistant"
				>
					<MessageSquare size={20} className="text-indigo-600" />
				</button>
			)}

			{/* Slide-over */}
			<div
				className={[
					"fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50",
					"border-l border-gray-100 shadow-2xl transition-transform duration-300",
					isOpen ? "translate-x-0" : "translate-x-full",
				].join(" ")}
			>
				{/* Header */}
				<div className="p-5 border-b border-gray-50 flex items-center justify-between">
					<div>
						<div className="text-[11px] font-black uppercase tracking-widest text-gray-400">
							Course Assistant
						</div>
						<div className="text-lg font-extrabold text-slate-800">
							Ask about this PDF
						</div>
					</div>

					<button
						type="button"
						onClick={toggle}
						className="p-2 rounded-xl hover:bg-gray-50 text-gray-500 hover:text-gray-800 transition-colors"
					>
						<X size={20} />
					</button>
				</div>

				{/* Messages */}
				<div className="flex-1 overflow-y-auto p-4 space-y-3 h-[calc(100vh-220px)]">
					{messages.length === 0 ? (
						<div className="text-gray-500 text-sm bg-gray-50 border border-gray-100 rounded-2xl p-4">
							Ask questions like:
							<ul className="list-disc pl-5 mt-2 space-y-1">
								<li>Summarize chapter 2</li>
								<li>Explain the definition of …</li>
								<li>Give me 5 quiz questions from this lesson</li>
							</ul>
						</div>
					) : null}

					{messages.map((m) => (
						<div
							key={m.id}
							className={[
								"max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed border",
								m.role === "user"
									? "ml-auto bg-indigo-600 text-white border-indigo-600"
									: "mr-auto bg-white text-slate-800 border-gray-100",
							].join(" ")}
						>
							{m.content}
						</div>
					))}

					{loading ? (
						<div className="mr-auto bg-white text-gray-500 border border-gray-100 rounded-2xl px-4 py-3 text-sm">
							Thinking…
						</div>
					) : null}
				</div>

				{/* Input */}
				<div className="p-4 border-t border-gray-50">
					<div className="w-full bg-white rounded-full shadow-lg p-2 pl-4 flex items-center border border-gray-100">
						<Bot className="text-pink-500 mr-2" size={22} />
						<input
							type="text"
							placeholder="Ask a question about this PDF..."
							className="flex-1 bg-transparent border-none outline-none text-gray-700 py-3 text-sm"
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") send();
							}}
						/>
						<button
							type="button"
							disabled={!canSend}
							onClick={send}
							className={[
								"p-3 rounded-full transition-colors flex items-center justify-center ml-2 shadow-md",
								canSend
									? "bg-blue-500 hover:bg-blue-600 text-white"
									: "bg-gray-200 text-gray-400",
							].join(" ")}
						>
							<Send size={18} className="translate-x-[-1px] translate-y-[1px]" />
						</button>
					</div>
				</div>
			</div>

			{/* Backdrop */}
			{isOpen ? (
				<button
					type="button"
					onClick={toggle}
					className="fixed inset-0 bg-black/30 z-40"
					aria-label="Close assistant"
				/>
			) : null}
		</>
	);
}

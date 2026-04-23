import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

export function AdminLabel({ children }: { children: string }) {
	return (
		<label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2">
			{children}
		</label>
	);
}

export function AdminInput(props: InputHTMLAttributes<HTMLInputElement>) {
	return (
		<input
			{...props}
			className={[
				"w-full bg-[#121318] text-white placeholder:text-gray-500",
				"border border-white/10 rounded-2xl px-4 py-3",
				"outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/40",
				props.className ?? "",
			].join(" ")}
		/>
	);
}

export function AdminTextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
	return (
		<textarea
			{...props}
			className={[
				"w-full bg-[#121318] text-white placeholder:text-gray-500",
				"border border-white/10 rounded-2xl px-4 py-3 min-h-[110px]",
				"outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/40",
				props.className ?? "",
			].join(" ")}
		/>
	);
}

export function AdminButton({
	children,
	variant = "primary",
	...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: "primary" | "secondary" | "ghost";
}) {
	const base =
		"px-5 py-3 rounded-2xl font-extrabold text-sm transition-all active:scale-95";
	const variants: Record<string, string> = {
		primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/20",
		secondary: "bg-white/10 text-white hover:bg-white/15 border border-white/10",
		ghost: "bg-transparent text-gray-300 hover:text-white hover:bg-white/5",
	};

	return (
		<button {...props} className={[base, variants[variant], props.className ?? ""].join(" ")}>
			{children}
		</button>
	);
}

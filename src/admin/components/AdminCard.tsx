import type { ReactNode } from "react";

export function AdminCard({
	title,
	subtitle,
	children,
}: {
	title: string;
	subtitle?: string;
	children: ReactNode;
}) {
	return (
		<div className="bg-[#1a1c20] border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
			<div className="px-6 py-5 border-b border-white/10">
				<h2 className="text-lg font-extrabold text-white tracking-tight">{title}</h2>
				{subtitle ? (
					<p className="text-sm text-gray-400 mt-1">{subtitle}</p>
				) : null}
			</div>
			<div className="p-6">{children}</div>
		</div>
	);
}

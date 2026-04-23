import { AdminButton } from "../components/AdminField";

export function AdminTopbar({ onLogout }: { onLogout: () => void }) {
	return (
		<header className="sticky top-0 z-30 bg-[#0f1014]/80 backdrop-blur border-b border-white/10">
			<div className="flex items-center justify-between px-4 lg:px-8 py-4">
				<div>
					<h1 className="text-white font-extrabold text-lg tracking-tight">Admin</h1>
					<p className="text-gray-400 text-sm">Manage courses, instructors, notifications</p>
				</div>

				<div className="flex items-center gap-3">
					<AdminButton variant="secondary" onClick={onLogout}>
						Logout
					</AdminButton>
				</div>
			</div>
		</header>
	);
}

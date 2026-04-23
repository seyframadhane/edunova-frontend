import { NavLink } from "react-router-dom";
import { BookPlus, UserPlus, Bell, LayoutDashboard } from "lucide-react";

const items = [
	{ to: "/admin", label: "Dashboard", icon: LayoutDashboard },
	{ to: "/admin/courses/new", label: "Add Course", icon: BookPlus },
	{ to: "/admin/instructors/new", label: "Add Instructor", icon: UserPlus },
	{ to: "/admin/notifications", label: "Notifications", icon: Bell },
];

export function AdminSidebar() {
	return (
		<aside className="fixed left-0 top-0 h-screen w-[280px] bg-[#1a1c20] border-r border-white/10 hidden lg:flex flex-col">
			<div className="p-6 border-b border-white/10">
				<div className="text-white font-extrabold text-xl tracking-tight">EduNovaAI</div>
				<div className="text-[11px] text-gray-400 font-black uppercase tracking-widest mt-1">
					Admin Panel
				</div>
			</div>

			<nav className="p-4 flex-1">
				<div className="space-y-2">
					{items.map((it) => (
						<NavLink
							key={it.to}
							to={it.to}
							end={it.to === "/admin"}
							className={({ isActive }) =>
								[
									"flex items-center gap-3 px-4 py-3 rounded-2xl transition-all",
									isActive
										? "bg-white/10 text-white border border-white/10"
										: "text-gray-400 hover:text-white hover:bg-white/5",
								].join(" ")
							}
						>
							<it.icon size={18} />
							<span className="font-bold">{it.label}</span>
						</NavLink>
					))}
				</div>
			</nav>

			<div className="p-4 border-t border-white/10 text-xs text-gray-500">
				© {new Date().getFullYear()} EduNovaAI
			</div>
		</aside>
	);
}

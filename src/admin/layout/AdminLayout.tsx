import { Outlet, useNavigate } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";

export default function AdminLayout() {
	const navigate = useNavigate();

	const logout = () => {
		// Adjust keys to match your app
		localStorage.removeItem("accessToken");
		localStorage.removeItem("refreshToken");
		navigate("/login");
	};

	return (
		<div className="min-h-screen bg-[#0f1014] text-white">
			<AdminSidebar />

			<div className="lg:pl-[280px]">
				<AdminTopbar onLogout={logout} />

				<main className="px-4 lg:px-8 py-6">
					<div className="max-w-4xl mx-auto">
						<Outlet />
					</div>
				</main>
			</div>
		</div>
	);
}

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AdminCard } from "../components/AdminCard";
import { AdminButton, AdminInput, AdminLabel, AdminTextArea } from "../components/AdminField";
import { adminApi } from "../services/adminApi";
import { api } from "../../services/api";

export default function AdminCoursesEditPage() {
	const { id } = useParams<{ id: string }>();

	const [form, setForm] = useState({
		title: "",
		description: "",
		category: "",
		level: "Beginner",
		price: 0,
		oldPrice: 0,
		image: "",
		pdfUrl: "",
		instructorId: "",
		isPublished: true,
	});

	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	// Load course data on mount
	useEffect(() => {
		const loadCourse = async () => {
			try {
				setLoading(true);
				const response = await api.get(`/admin/courses/${id}`);
				const course = response.data.data;
				setForm({
					title: course.title,
					description: course.description || "",
					category: course.category,
					level: course.level,
					price: course.price,
					oldPrice: course.oldPrice || 0,
					image: course.image || "",
					pdfUrl: course.pdfUrl || "",
					instructorId: course.instructor?._id || course.instructor || "",
					isPublished: course.isPublished,
				});
			} catch (err: any) {
				setError(err?.response?.data?.message || "Failed to load course");
			} finally {
				setLoading(false);
			}
		};
		loadCourse();
	}, [id]);

	const onChange = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }));

	const submit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSaving(true);
		setError(null);
		setSuccess(null);

		try {
			if (!id) throw new Error("Course ID not found");

			await adminApi.updateCourse(id, {
				title: form.title,
				description: form.description || undefined,
				category: form.category,
				level: form.level,
				price: Number(form.price),
				oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
				image: form.image || undefined,
				pdfUrl: form.pdfUrl,
				contentType: "pdf",
				instructor: form.instructorId,
				isPublished: form.isPublished,
			});

			setSuccess("Course updated successfully.");
		} catch (err: any) {
			setError(err?.message || "Failed to update course.");
		} finally {
			setSaving(false);
		}
	};

	if (loading) {
		return (
			<AdminCard title="Edit Course" subtitle="Loading...">
				<div className="text-center text-gray-400">Loading course data...</div>
			</AdminCard>
		);
	}

	return (
		<AdminCard
			title="Edit Course"
			subtitle="Update course details and PDF link."
		>
			<form onSubmit={submit} className="space-y-5">
				<div>
					<AdminLabel>Title</AdminLabel>
					<AdminInput
						value={form.title}
						onChange={(e) => onChange("title", e.target.value)}
						placeholder="Advanced React Patterns..."
						required
					/>
				</div>

				<div>
					<AdminLabel>Description</AdminLabel>
					<AdminTextArea
						value={form.description}
						onChange={(e) => onChange("description", e.target.value)}
						placeholder="Short course description..."
					/>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
					<div>
						<AdminLabel>Category</AdminLabel>
						<AdminInput
							value={form.category}
							onChange={(e) => onChange("category", e.target.value)}
							placeholder="Development"
							required
						/>
					</div>

					<div>
						<AdminLabel>Level</AdminLabel>
						<select
							value={form.level}
							onChange={(e) => onChange("level", e.target.value)}
							className="w-full bg-[#121318] text-white border border-white/10 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/30"
						>
							<option>Beginner</option>
							<option>Intermediate</option>
							<option>Advanced</option>
						</select>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
					<div>
						<AdminLabel>Price</AdminLabel>
						<AdminInput
							type="number"
							value={form.price}
							onChange={(e) => onChange("price", e.target.value)}
							min={0}
							required
						/>
					</div>
					<div>
						<AdminLabel>Old price (optional)</AdminLabel>
						<AdminInput
							type="number"
							value={form.oldPrice}
							onChange={(e) => onChange("oldPrice", e.target.value)}
							min={0}
						/>
					</div>
				</div>

				<div>
					<AdminLabel>Instructor ID</AdminLabel>
					<AdminInput
						value={form.instructorId}
						onChange={(e) => onChange("instructorId", e.target.value)}
						placeholder="Instructor._id (from DB)"
						required
					/>
					<p className="text-xs text-gray-500 mt-2">
						Instructor MongoDB ObjectId (24-character hex string)
					</p>
				</div>

				<div>
					<AdminLabel>Course image URL (optional)</AdminLabel>
					<AdminInput
						value={form.image}
						onChange={(e) => onChange("image", e.target.value)}
						placeholder="https://images.unsplash.com/..."
					/>
				</div>

				<div>
					<AdminLabel>PDF URL (required)</AdminLabel>
					<AdminInput
						value={form.pdfUrl}
						onChange={(e) => onChange("pdfUrl", e.target.value)}
						placeholder="http://localhost:5001/uploads/pdfs/....pdf"
						required
					/>
				</div>

				<div className="flex items-center justify-between pt-2">
					<label className="flex items-center gap-3 text-sm text-gray-300 font-bold">
						<input
							type="checkbox"
							checked={form.isPublished}
							onChange={(e) => onChange("isPublished", e.target.checked)}
							className="w-5 h-5 rounded border-white/20 bg-[#121318]"
						/>
						Published
					</label>

					<AdminButton type="submit" disabled={saving}>
						{saving ? "Updating..." : "Update Course"}
					</AdminButton>
				</div>

				{error ? (
					<div className="bg-red-500/10 border border-red-500/20 text-red-200 rounded-2xl px-4 py-3 text-sm font-bold">
						{error}
					</div>
				) : null}

				{success ? (
					<div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 rounded-2xl px-4 py-3 text-sm font-bold">
						{success}
					</div>
				) : null}
			</form>
		</AdminCard>
	);
}

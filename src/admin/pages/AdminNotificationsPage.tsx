import { useState } from "react";
import { AdminCard } from "../components/AdminCard";
import { AdminButton, AdminInput, AdminLabel, AdminTextArea } from "../components/AdminField";
import { adminApi } from "../services/adminApi";

export default function AdminNotificationsPage() {
  const [form, setForm] = useState({
    audience: "all" as "all" | "enrolled_in_course" | "single_user",
    userId: "",
    courseId: "",
    type: "system" as "course_upload" | "resume" | "coupon" | "discount" | "system",
    title: "",
    description: "",
    link: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onChange = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await adminApi.broadcastNotification({
        audience: form.audience,
        userId: form.audience === "single_user" ? form.userId : undefined,
        courseId: form.audience === "enrolled_in_course" ? form.courseId : undefined,
        type: form.type,
        title: form.title,
        description: form.description,
        link: form.link || undefined,
      });

      setSuccess("Notification broadcast created.");
      setForm(p => ({ ...p, title: "", description: "", link: "" }));
    } catch (err: any) {
      setError(err?.message || "Failed to broadcast notification.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminCard title="Broadcast Notification" subtitle="Send DB notifications to users.">
      <form onSubmit={submit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <AdminLabel>Audience</AdminLabel>
            <select
              value={form.audience}
              onChange={(e) => onChange("audience", e.target.value)}
              className="w-full bg-[#121318] text-white border border-white/10 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/30"
            >
              <option value="all">All users</option>
              <option value="enrolled_in_course">Enrolled in course</option>
              <option value="single_user">Single user</option>
            </select>
          </div>

          <div>
            <AdminLabel>Type</AdminLabel>
            <select
              value={form.type}
              onChange={(e) => onChange("type", e.target.value)}
              className="w-full bg-[#121318] text-white border border-white/10 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/30"
            >
              <option value="system">system</option>
              <option value="course_upload">course_upload</option>
              <option value="resume">resume</option>
              <option value="coupon">coupon</option>
              <option value="discount">discount</option>
            </select>
          </div>
        </div>

        {form.audience === "single_user" ? (
          <div>
            <AdminLabel>User ID</AdminLabel>
            <AdminInput value={form.userId} onChange={(e) => onChange("userId", e.target.value)} required />
          </div>
        ) : null}

        {form.audience === "enrolled_in_course" ? (
          <div>
            <AdminLabel>Course ID</AdminLabel>
            <AdminInput value={form.courseId} onChange={(e) => onChange("courseId", e.target.value)} required />
          </div>
        ) : null}

        <div>
          <AdminLabel>Title</AdminLabel>
          <AdminInput value={form.title} onChange={(e) => onChange("title", e.target.value)} required />
        </div>

        <div>
          <AdminLabel>Description</AdminLabel>
          <AdminTextArea value={form.description} onChange={(e) => onChange("description", e.target.value)} required />
        </div>

        <div>
          <AdminLabel>Link (optional)</AdminLabel>
          <AdminInput value={form.link} onChange={(e) => onChange("link", e.target.value)} placeholder="/courses" />
        </div>

        <div className="flex items-center justify-end">
          <AdminButton type="submit" disabled={loading}>
            {loading ? "Sending..." : "Broadcast"}
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

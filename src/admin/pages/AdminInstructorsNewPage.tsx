import { useState } from "react";
import { AdminCard } from "../components/AdminCard";
import { AdminButton, AdminInput, AdminLabel, AdminTextArea } from "../components/AdminField";
import { adminApi } from "../services/adminApi";

export default function AdminInstructorsNewPage() {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        name: "",
        role: "",
        bio: "",
        image: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const onChange = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }));

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await adminApi.createInstructor({
                firstName: form.firstName,
                lastName: form.lastName,
                email: form.email,
                password: form.password,
                profile: {
                    name: form.name || `${form.firstName} ${form.lastName}`,
                    role: form.role || undefined,
                    bio: form.bio || undefined,
                    image: form.image || undefined,
                },
            });

            setSuccess("Instructor created successfully.");
            setForm({
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                name: "",
                role: "",
                bio: "",
                image: "",
            });
        } catch (err: any) {
            setError(err?.message || "Failed to create instructor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminCard
            title="Add Instructor"
            subtitle="Creates a new User (role=instructor) and Instructor profile."
        >
            <form onSubmit={submit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <AdminLabel>First name</AdminLabel>
                        <AdminInput
                            value={form.firstName}
                            onChange={(e) => onChange("firstName", e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <AdminLabel>Last name</AdminLabel>
                        <AdminInput
                            value={form.lastName}
                            onChange={(e) => onChange("lastName", e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div>
                    <AdminLabel>Email</AdminLabel>
                    <AdminInput
                        type="email"
                        value={form.email}
                        onChange={(e) => onChange("email", e.target.value)}
                        required
                    />
                </div>

                <div>
                    <AdminLabel>Temporary password</AdminLabel>
                    <AdminInput
                        type="password"
                        value={form.password}
                        onChange={(e) => onChange("password", e.target.value)}
                        placeholder="Min 6 characters"
                        required
                    />
                </div>

                <div>
                    <AdminLabel>Public name (optional)</AdminLabel>
                    <AdminInput
                        value={form.name}
                        onChange={(e) => onChange("name", e.target.value)}
                        placeholder="Displayed instructor name"
                    />
                </div>

                <div>
                    <AdminLabel>Role / Title (optional)</AdminLabel>
                    <AdminInput
                        value={form.role}
                        onChange={(e) => onChange("role", e.target.value)}
                        placeholder="Senior React Engineer"
                    />
                </div>

                <div>
                    <AdminLabel>Bio (optional)</AdminLabel>
                    <AdminTextArea
                        value={form.bio}
                        onChange={(e) => onChange("bio", e.target.value)}
                        placeholder="Short instructor bio..."
                    />
                </div>

                <div>
                    <AdminLabel>Image URL (optional)</AdminLabel>
                    <AdminInput
                        value={form.image}
                        onChange={(e) => onChange("image", e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                    />
                </div>

                <div className="flex items-center justify-end pt-2">
                    <AdminButton type="submit" disabled={loading}>
                        {loading ? "Creating..." : "Create Instructor"}
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

import { useState, useEffect, type FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/auth.service';
import { enrollmentService } from '../services/enrollment.service';
import { certificateService } from '../services/certificate.service';
import { toast } from 'sonner';
import {
    User, Mail, Award, BookOpen, Clock, Star,
    Camera, Edit2, Save, X, Lock, LogOut, Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
    });

    const [showPwd, setShowPwd] = useState(false);
    const [pwd, setPwd] = useState({ current: '', next: '', confirm: '' });

    const [stats, setStats] = useState({ enrolled: 0, completed: 0, certificates: 0, hours: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const [enrollsRes, certsRes] = await Promise.all([
                    enrollmentService.mine(),
                    certificateService.mine(),
                ]);

                // Your API returns { success, data: [...] }, axios wraps it in res.data
                const enrolls: any[] = enrollsRes.data?.data || enrollsRes.data || [];
                const certs: any[] = certsRes.data?.data || certsRes.data || [];

                const enrolled = enrolls.length;
                const completed = enrolls.filter((e: any) => (e.progress ?? 0) >= 100).length;
                const hours = enrolls.reduce(
                    (s: number, e: any) => s + (e.course?.duration || 0),
                    0
                );

                setStats({
                    enrolled,
                    completed,
                    certificates: certs.length,
                    hours,
                });
            } catch (err) {
                console.warn('Could not load profile stats:', err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);
    const handleSave = async (e: FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await authService.updateProfile(form);
            toast.success('Profile updated');
            setEditing(false);
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Update failed');
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async (e: FormEvent) => {
        e.preventDefault();
        if (pwd.next !== pwd.confirm) return toast.error('Passwords do not match');
        if (pwd.next.length < 8) return toast.error('Password must be at least 8 characters');
        try {
            await authService.changePassword({ currentPassword: pwd.current, newPassword: pwd.next });
            toast.success('Password changed');
            setPwd({ current: '', next: '', confirm: '' });
            setShowPwd(false);
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Change failed');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">Please log in to view your profile.</p>
            </div>
        );
    }

    const fullName = `${user.firstName} ${user.lastName}`.trim();
    const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || 'U';

    const roleLabel = user.role === 'admin' ? 'Admin' : user.role === 'instructor' ? 'Instructor' : 'Student';
    const roleColor =
        user.role === 'admin' ? 'bg-red-100 text-red-600' :
            user.role === 'instructor' ? 'bg-blue-100 text-blue-600' :
                'bg-purple-100 text-[#6C3EF4]';

    return (
        <div className="min-h-screen bg-gray-50 pb-16">
            <div className="h-48 bg-gradient-to-r from-[#6C3EF4] via-[#8B5CF6] to-[#EC4899]" />

            <div className="max-w-5xl mx-auto px-4 -mt-24">
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#6C3EF4] to-[#EC4899] flex items-center justify-center text-white text-4xl font-bold ring-4 ring-white shadow-lg overflow-hidden">
                                {user.avatar ? (
                                    <img src={user.avatar} alt={fullName} className="w-full h-full object-cover" />
                                ) : (
                                    initials
                                )}
                            </div>
                            <button className="absolute bottom-1 right-1 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition" title="Change photo">
                                <Camera size={16} className="text-gray-700" />
                            </button>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl font-bold text-gray-900">{fullName}</h1>
                            <p className="text-gray-500 flex items-center justify-center md:justify-start gap-2 mt-1">
                                <Mail size={14} /> {user.email}
                            </p>
                            <div className="flex items-center justify-center md:justify-start gap-2 mt-3 flex-wrap">
                                <span className={`px-3 py-1 ${roleColor} rounded-full text-xs font-semibold flex items-center gap-1`}>
                                    <Shield size={12} /> {roleLabel}
                                </span>
                                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold flex items-center gap-1">
                                    <Star size={12} fill="currentColor" /> {user.points} points
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            {!editing ? (
                                <button
                                    onClick={() => setEditing(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-[#1a1a2e] text-white rounded-lg hover:bg-[#6C3EF4] transition"
                                >
                                    <Edit2 size={16} /> Edit
                                </button>
                            ) : (
                                <button
                                    onClick={() => { setEditing(false); setForm({ firstName: user.firstName, lastName: user.lastName, email: user.email }); }}
                                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                >
                                    <X size={16} /> Cancel
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <StatCard icon={<BookOpen size={20} />} label="Enrolled" value={stats.enrolled} color="bg-blue-50 text-blue-600" loading={loading} />
                    <StatCard icon={<Award size={20} />} label="Completed" value={stats.completed} color="bg-green-50 text-green-600" loading={loading} />
                    <StatCard icon={<Shield size={20} />} label="Certificates" value={stats.certificates} color="bg-purple-50 text-[#6C3EF4]" loading={loading} />
                    <StatCard icon={<Clock size={20} />} label="Hours" value={stats.hours} color="bg-orange-50 text-orange-600" loading={loading} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 bg-white rounded-2xl shadow-sm p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <User size={20} /> Personal Information
                        </h2>

                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field label="First name" value={form.firstName} onChange={(v) => setForm({ ...form, firstName: v })} editing={editing} />
                                <Field label="Last name" value={form.lastName} onChange={(v) => setForm({ ...form, lastName: v })} editing={editing} />
                            </div>
                            <Field label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} editing={editing} type="email" />

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                                <p className="text-gray-500 py-2 font-mono text-sm">{user._id}</p>
                            </div>

                            {editing && (
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex items-center gap-2 px-6 py-2 bg-[#6C3EF4] text-white rounded-lg hover:bg-[#5a2fd9] transition disabled:opacity-50"
                                >
                                    <Save size={16} /> {saving ? 'Saving...' : 'Save changes'}
                                </button>
                            )}
                        </form>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Lock size={18} /> Security
                            </h2>

                            {!showPwd ? (
                                <button
                                    onClick={() => setShowPwd(true)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition text-sm"
                                >
                                    Change password
                                </button>
                            ) : (
                                <form onSubmit={handleChangePassword} className="space-y-3">
                                    <input type="password" placeholder="Current password" value={pwd.current} onChange={(e) => setPwd({ ...pwd, current: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6C3EF4]" required />
                                    <input type="password" placeholder="New password" value={pwd.next} onChange={(e) => setPwd({ ...pwd, next: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6C3EF4]" required />
                                    <input type="password" placeholder="Confirm new password" value={pwd.confirm} onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6C3EF4]" required />
                                    <div className="flex gap-2">
                                        <button type="submit" className="flex-1 px-3 py-2 bg-[#6C3EF4] text-white rounded-lg text-sm hover:bg-[#5a2fd9]">Update</button>
                                        <button type="button" onClick={() => { setShowPwd(false); setPwd({ current: '', next: '', confirm: '' }); }} className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
                                    </div>
                                </form>
                            )}
                        </div>

                        <div className="bg-gradient-to-br from-[#6C3EF4] to-[#EC4899] rounded-2xl shadow-sm p-6 text-white">
                            <div className="flex items-center gap-2 mb-2">
                                <Star size={20} fill="currentColor" />
                                <h2 className="text-lg font-bold">Your Points</h2>
                            </div>
                            <p className="text-4xl font-bold mb-1">{user.points}</p>
                            <p className="text-sm text-white/80">Earn more by completing courses</p>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Account</h2>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition text-sm"
                            >
                                <LogOut size={16} /> Log out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, color, loading }: { icon: React.ReactNode; label: string; value: number; color: string; loading: boolean }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center mb-3`}>{icon}</div>
            <p className="text-2xl font-bold text-gray-900">{loading ? '—' : value}</p>
            <p className="text-sm text-gray-500">{label}</p>
        </div>
    );
}

function Field({ label, value, onChange, editing, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; editing: boolean; type?: string }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            {editing ? (
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C3EF4]"
                />
            ) : (
                <p className="text-gray-900 py-2">{value || <span className="italic text-gray-400">Not set</span>}</p>
            )}
        </div>
    );
}
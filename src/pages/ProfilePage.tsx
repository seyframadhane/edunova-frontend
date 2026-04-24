import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
    User as UserIcon, Mail, Phone, MapPin, Globe, Github, Linkedin, Twitter,
    Award, BookOpen, Clock, Star, Camera, Edit2, Save, X, Lock, LogOut, Shield,
    Calendar, Briefcase, Loader2, ChevronRight, Image as ImageIcon,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { authService } from '../services/auth.service';
import { enrollmentService } from '../services/enrollment.service';
import { certificateService } from '../services/certificate.service';
import type { User } from '../types/api';

export default function ProfilePage() {
    const { user, setUser, logout } = useAuth();
    const navigate = useNavigate();

    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [uploadingCover, setUploadingCover] = useState(false);
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState(() => toForm(user));
    useEffect(() => setForm(toForm(user)), [user]);

    const [stats, setStats] = useState({ enrolled: 0, completed: 0, certificates: 0, hours: 0 });
    const [recentCourses, setRecentCourses] = useState<any[]>([]);
    const [loadingStats, setLoadingStats] = useState(true);

    const [showPwd, setShowPwd] = useState(false);
    const [pwd, setPwd] = useState({ current: '', next: '', confirm: '' });
    const [changingPwd, setChangingPwd] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const [enrollsRes, certsRes] = await Promise.all([
                    enrollmentService.mine(),
                    certificateService.mine(),
                ]);
                const enrolls: any[] = enrollsRes.data?.data || [];
                const certs: any[] = certsRes.data?.data || [];
                const completed = enrolls.filter(e => (e.progress ?? 0) >= 100).length;
                const hours = enrolls.reduce((s, e) => s + (e.course?.durationHours || 0), 0);
                setStats({ enrolled: enrolls.length, completed, certificates: certs.length, hours });
                setRecentCourses(enrolls.slice(0, 4));
            } catch (e) {
                console.warn('stats load failed', e);
            } finally {
                setLoadingStats(false);
            }
        })();
    }, []);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">Please log in to view your profile.</p>
            </div>
        );
    }

    const fullName = `${user.firstName} ${user.lastName}`.trim();
    const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || 'U';
    const memberSince = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
        : null;

    const roleLabel = user.role === 'admin' ? 'Admin' : user.role === 'instructor' ? 'Instructor' : 'Student';
    const roleColor =
        user.role === 'admin' ? 'bg-red-50 text-red-600 ring-red-100' :
            user.role === 'instructor' ? 'bg-blue-50 text-blue-600 ring-blue-100' :
                'bg-purple-50 text-[#6C3EF4] ring-purple-100';

    const handleAvatarClick = () => { if (editing) avatarInputRef.current?.click(); };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) return toast.error('Image must be under 5MB');
        setUploadingAvatar(true);
        try {
            const updated = await authService.uploadAvatar(file);
            setUser(updated);
            toast.success('Avatar updated');
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Upload failed');
        } finally {
            setUploadingAvatar(false);
            if (avatarInputRef.current) avatarInputRef.current.value = '';
        }
    };

    const handleCoverClick = () => { if (editing) coverInputRef.current?.click(); };

    const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 8 * 1024 * 1024) return toast.error('Image must be under 8MB');
        setUploadingCover(true);
        try {
            const updated = await authService.uploadCover(file);
            setUser(updated);
            toast.success('Cover updated');
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Upload failed');
        } finally {
            setUploadingCover(false);
            if (coverInputRef.current) coverInputRef.current.value = '';
        }
    };

    const handleSave = async (e: FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const updated = await authService.updateProfile({
                firstName: form.firstName,
                lastName: form.lastName,
                email: form.email,
                headline: form.headline,
                bio: form.bio,
                phone: form.phone,
                location: form.location,
                website: form.website,
                socials: {
                    github: form.github,
                    linkedin: form.linkedin,
                    twitter: form.twitter,
                },
            });
            setUser(updated);
            toast.success('Profile updated');
            setEditing(false);
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Update failed');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => { setForm(toForm(user)); setEditing(false); };

    const handleChangePassword = async (e: FormEvent) => {
        e.preventDefault();
        if (pwd.next !== pwd.confirm) return toast.error('Passwords do not match');
        if (pwd.next.length < 8) return toast.error('Password must be at least 8 characters');
        setChangingPwd(true);
        try {
            await authService.changePassword({ currentPassword: pwd.current, newPassword: pwd.next });
            toast.success('Password changed');
            setPwd({ current: '', next: '', confirm: '' });
            setShowPwd(false);
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Change failed');
        } finally {
            setChangingPwd(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-16">
            {/* Cover */}
            <div
                onClick={handleCoverClick}
                className={`h-56 relative overflow-hidden rounded-3xl ${editing ? 'cursor-pointer' : ''} ${user.coverImage ? '' : 'bg-gradient-to-r from-[#6C3EF4] via-[#8B5CF6] to-[#EC4899]'
                    }`}
            >
                {user.coverImage && (
                    <img
                        src={user.coverImage}
                        alt="Cover"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.15),transparent_50%)]" />

                {editing && (
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleCoverClick(); }}
                        className="absolute top-4 right-4 z-10 flex items-center gap-2 px-4 py-2 bg-white/95 backdrop-blur text-gray-800 rounded-xl text-sm font-medium shadow-lg hover:bg-white transition"
                    >
                        {uploadingCover ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />}
                        {uploadingCover ? 'Uploading…' : 'Change cover'}
                    </button>
                )}

                <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={handleCoverChange}
                />
            </div>

            <div className="max-w-6xl mx-auto px-4 -mt-28 relative z-10">
                {/* Header card */}
                <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-6">
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                        {/* Avatar */}
                        <div className="relative shrink-0">
                            <div
                                onClick={handleAvatarClick}
                                className={`group w-36 h-36 rounded-full bg-gradient-to-br from-[#6C3EF4] to-[#EC4899] flex items-center justify-center text-white text-5xl font-bold ring-4 ring-white shadow-xl overflow-hidden relative ${editing ? 'cursor-pointer' : ''}`}
                            >
                                {user.avatar
                                    ? <img src={user.avatar} alt={fullName} className="w-full h-full object-cover" />
                                    : initials}
                                {editing && (
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-sm font-medium">
                                        {uploadingAvatar
                                            ? <Loader2 className="animate-spin" size={24} />
                                            : <><Camera size={18} className="mr-1.5" /> Change</>}
                                    </div>
                                )}
                                {uploadingAvatar && !editing && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <Loader2 className="animate-spin text-white" size={24} />
                                    </div>
                                )}
                            </div>
                            {editing && (
                                <button
                                    onClick={handleAvatarClick}
                                    className="absolute bottom-1 right-1 bg-white rounded-full p-2.5 shadow-lg hover:shadow-xl transition"
                                    title="Change photo"
                                    type="button"
                                >
                                    <Camera size={16} className="text-gray-700" />
                                </button>
                            )}
                            <input
                                ref={avatarInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/gif"
                                className="hidden"
                                onChange={handleAvatarChange}
                            />
                        </div>

                        {/* Name block */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{fullName}</h1>
                            {user.headline && (
                                <p className="text-gray-600 text-base md:text-lg mt-1 flex items-center justify-center md:justify-start gap-1.5">
                                    <Briefcase size={14} /> {user.headline}
                                </p>
                            )}
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ring-1 ${roleColor}`}>
                                    <Shield size={12} /> {roleLabel}
                                </span>
                                <span className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs font-semibold flex items-center gap-1 ring-1 ring-yellow-100">
                                    <Star size={12} fill="currentColor" /> {user.points} points
                                </span>
                                {user.location && (
                                    <span className="px-3 py-1 bg-gray-50 text-gray-700 rounded-full text-xs font-semibold flex items-center gap-1 ring-1 ring-gray-100">
                                        <MapPin size={12} /> {user.location}
                                    </span>
                                )}
                                {memberSince && (
                                    <span className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-xs font-semibold flex items-center gap-1 ring-1 ring-gray-100">
                                        <Calendar size={12} /> Member since {memberSince}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 shrink-0">
                            {!editing ? (
                                <button
                                    onClick={() => setEditing(true)}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-[#1a1a2e] text-white rounded-xl hover:bg-[#6C3EF4] transition font-medium"
                                >
                                    <Edit2 size={16} /> Edit profile
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={handleCancel}
                                        className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium"
                                    >
                                        <X size={16} /> Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-[#6C3EF4] text-white rounded-xl hover:bg-[#5a2fd9] transition font-medium disabled:opacity-50"
                                    >
                                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                        {saving ? 'Saving…' : 'Save changes'}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <StatCard icon={<BookOpen size={20} />} label="Enrolled" value={stats.enrolled} color="bg-blue-50 text-blue-600" loading={loadingStats} />
                    <StatCard icon={<Award size={20} />} label="Completed" value={stats.completed} color="bg-green-50 text-green-600" loading={loadingStats} />
                    <StatCard icon={<Shield size={20} />} label="Certificates" value={stats.certificates} color="bg-purple-50 text-[#6C3EF4]" loading={loadingStats} />
                    <StatCard icon={<Clock size={20} />} label="Hours" value={stats.hours} color="bg-orange-50 text-orange-600" loading={loadingStats} />
                </div>

                {/* Main grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left column */}
                    <div className="lg:col-span-2 space-y-6">
                        <Section title="About" icon={<UserIcon size={18} />}>
                            {editing ? (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Field label="First name" value={form.firstName} onChange={v => setForm({ ...form, firstName: v })} />
                                        <Field label="Last name" value={form.lastName} onChange={v => setForm({ ...form, lastName: v })} />
                                    </div>
                                    <Field label="Headline" placeholder="e.g. Full-stack developer & lifelong learner"
                                        value={form.headline} onChange={v => setForm({ ...form, headline: v })} />
                                    <TextArea label="Bio" placeholder="Tell us about yourself…"
                                        value={form.bio} onChange={v => setForm({ ...form, bio: v })} maxLength={600} />
                                </div>
                            ) : (
                                user.bio
                                    ? <p className="text-gray-700 whitespace-pre-line leading-relaxed">{user.bio}</p>
                                    : <EmptyHint text="Add a short bio to let others know who you are." onAction={() => setEditing(true)} />
                            )}
                        </Section>

                        <Section title="Contact information" icon={<Mail size={18} />}>
                            {editing ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Field label="Email" type="email" value={form.email} onChange={v => setForm({ ...form, email: v })} />
                                    <Field label="Phone" value={form.phone} onChange={v => setForm({ ...form, phone: v })} placeholder="+213 ..." />
                                    <Field label="Location" value={form.location} onChange={v => setForm({ ...form, location: v })} placeholder="City, Country" />
                                    <Field label="Website" value={form.website} onChange={v => setForm({ ...form, website: v })} placeholder="https://…" />
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <Line icon={<Mail size={14} />} value={user.email} href={`mailto:${user.email}`} />
                                    <Line icon={<Phone size={14} />} value={user.phone} href={user.phone ? `tel:${user.phone}` : undefined} />
                                    <Line icon={<MapPin size={14} />} value={user.location} />
                                    <Line icon={<Globe size={14} />} value={user.website} href={user.website} isLink />
                                </div>
                            )}
                        </Section>

                        <Section title="Social links" icon={<Github size={18} />}>
                            {editing ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Field label="GitHub" value={form.github} onChange={v => setForm({ ...form, github: v })} placeholder="https://github.com/yourname" />
                                    <Field label="LinkedIn" value={form.linkedin} onChange={v => setForm({ ...form, linkedin: v })} placeholder="https://linkedin.com/in/yourname" />
                                    <Field label="Twitter/X" value={form.twitter} onChange={v => setForm({ ...form, twitter: v })} placeholder="https://twitter.com/yourname" />
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    <SocialChip icon={<Github size={14} />} label="GitHub" url={user.socials?.github} />
                                    <SocialChip icon={<Linkedin size={14} />} label="LinkedIn" url={user.socials?.linkedin} />
                                    <SocialChip icon={<Twitter size={14} />} label="Twitter" url={user.socials?.twitter} />
                                    {!user.socials?.github && !user.socials?.linkedin && !user.socials?.twitter && (
                                        <EmptyHint text="Add your social profiles." onAction={() => setEditing(true)} />
                                    )}
                                </div>
                            )}
                        </Section>
                    </div>

                    {/* Right column */}
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-[#6C3EF4] to-[#EC4899] rounded-2xl shadow-sm p-6 text-white">
                            <div className="flex items-center gap-2 mb-2">
                                <Star size={20} fill="currentColor" />
                                <h2 className="text-lg font-bold">Your points</h2>
                            </div>
                            <p className="text-4xl font-bold mb-1">{user.points}</p>
                            <p className="text-sm text-white/85">Earn more by completing courses, quizzes and streaks.</p>
                        </div>

                        <Section title="Recent courses" icon={<BookOpen size={18} />}>
                            {loadingStats ? (
                                <p className="text-sm text-gray-400">Loading…</p>
                            ) : recentCourses.length === 0 ? (
                                <EmptyHint text="You haven't enrolled in any course yet." action="Browse courses" onAction={() => navigate('/courses')} />
                            ) : (
                                <ul className="space-y-2">
                                    {recentCourses.map((e: any) => (
                                        <li key={e._id}>
                                            <button
                                                onClick={() => navigate(`/learn/course/${e.course?._id}`)}
                                                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition text-left"
                                            >
                                                {e.course?.image ? (
                                                    <img src={e.course.image} className="w-10 h-10 rounded-lg object-cover" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-lg bg-purple-100 text-[#6C3EF4] flex items-center justify-center">
                                                        <BookOpen size={16} />
                                                    </div>
                                                )}
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium text-gray-900 truncate">{e.course?.title || 'Course'}</p>
                                                    <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-[#6C3EF4]" style={{ width: `${Math.min(100, e.progress || 0)}%` }} />
                                                    </div>
                                                </div>
                                                <ChevronRight size={16} className="text-gray-400 shrink-0" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </Section>

                        <Section title="Security" icon={<Lock size={18} />}>
                            {!showPwd ? (
                                <button
                                    onClick={() => setShowPwd(true)}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition text-sm font-medium"
                                >
                                    Change password
                                </button>
                            ) : (
                                <form onSubmit={handleChangePassword} className="space-y-3">
                                    <PasswordInput placeholder="Current password" value={pwd.current} onChange={v => setPwd({ ...pwd, current: v })} />
                                    <PasswordInput placeholder="New password" value={pwd.next} onChange={v => setPwd({ ...pwd, next: v })} />
                                    <PasswordInput placeholder="Confirm new password" value={pwd.confirm} onChange={v => setPwd({ ...pwd, confirm: v })} />
                                    <div className="flex gap-2">
                                        <button type="submit" disabled={changingPwd}
                                            className="flex-1 px-3 py-2 bg-[#6C3EF4] text-white rounded-lg text-sm font-medium hover:bg-[#5a2fd9] disabled:opacity-50">
                                            {changingPwd ? 'Updating…' : 'Update'}
                                        </button>
                                        <button type="button" onClick={() => { setShowPwd(false); setPwd({ current: '', next: '', confirm: '' }); }}
                                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}
                        </Section>

                        <Section title="Account" icon={<Shield size={18} />}>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-red-100 text-red-600 rounded-xl hover:bg-red-50 transition text-sm font-medium"
                            >
                                <LogOut size={16} /> Log out
                            </button>
                        </Section>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ---------- helpers & subcomponents ---------- */

function toForm(user: User | null) {
    return {
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        headline: user?.headline || '',
        bio: user?.bio || '',
        phone: user?.phone || '',
        location: user?.location || '',
        website: user?.website || '',
        github: user?.socials?.github || '',
        linkedin: user?.socials?.linkedin || '',
        twitter: user?.socials?.twitter || '',
    };
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
    return (
        <section className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-purple-50 text-[#6C3EF4] flex items-center justify-center">{icon}</span>
                {title}
            </h2>
            {children}
        </section>
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

function Field({ label, value, onChange, placeholder, type = 'text' }:
    { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
    return (
        <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">{label}</label>
            <input
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C3EF4] focus:border-transparent"
            />
        </div>
    );
}

function TextArea({ label, value, onChange, placeholder, maxLength }:
    { label: string; value: string; onChange: (v: string) => void; placeholder?: string; maxLength?: number }) {
    return (
        <div>
            <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">{label}</label>
                {maxLength && <span className="text-xs text-gray-400">{value.length}/{maxLength}</span>}
            </div>
            <textarea
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                rows={4}
                maxLength={maxLength}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C3EF4] focus:border-transparent resize-none"
            />
        </div>
    );
}

function PasswordInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
    return (
        <input
            type="password"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6C3EF4]"
            required
        />
    );
}

function Line({ icon, value, href, isLink }: { icon: React.ReactNode; value?: string; href?: string; isLink?: boolean }) {
    if (!value) {
        return <p className="flex items-center gap-2 text-sm text-gray-400"><span className="text-gray-300">{icon}</span>Not set</p>;
    }
    const content = isLink ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#6C3EF4] hover:underline break-all">{value}</a>
    ) : href ? (
        <a href={href} className="text-gray-900 hover:text-[#6C3EF4] break-all">{value}</a>
    ) : (
        <span className="text-gray-900 break-all">{value}</span>
    );
    return (
        <p className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">{icon}</span>
            {content}
        </p>
    );
}

function SocialChip({ icon, label, url }: { icon: React.ReactNode; label: string; url?: string }) {
    if (!url) return null;
    return (
        <a href={url} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-100 hover:border-gray-300 transition">
            {icon} {label}
        </a>
    );
}

function EmptyHint({ text, action = 'Edit profile', onAction }: { text: string; action?: string; onAction?: () => void }) {
    return (
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl text-sm">
            <span className="text-gray-600">{text}</span>
            {onAction && (
                <button onClick={onAction} className="ml-auto text-[#6C3EF4] font-medium hover:underline shrink-0">{action}</button>
            )}
        </div>
    );
}
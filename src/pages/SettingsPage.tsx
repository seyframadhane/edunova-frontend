import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { authService } from '../services/auth.service';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function SettingsPage() {
    const { user } = useAuth();
    const [form, setForm] = useState({ firstName: '', lastName: '', avatar: '' });
    const [pw, setPw] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

    useEffect(() => {
        if (user) setForm({ firstName: user.firstName, lastName: user.lastName, avatar: user.avatar || '' });
    }, [user]);

    const saveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.patch('/users/me', form);
            toast.success('Profile updated');
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Update failed');
        }
    };

    const changePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (pw.newPassword !== pw.confirmPassword) return toast.error('Passwords do not match');
        if (pw.newPassword.length < 6) return toast.error('Password must be 6+ characters');
        try {
            await api.post('/auth/change-password', {
                currentPassword: pw.currentPassword,
                newPassword: pw.newPassword,
            });
            toast.success('Password changed');
            setPw({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Password change failed');
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-8">
            <h1 className="text-3xl font-extrabold text-slate-800">Settings</h1>

            <form onSubmit={saveProfile} className="bg-white rounded-2xl p-6 border border-gray-100 space-y-4">
                <h2 className="font-bold text-lg">Profile</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-semibold">First name</label>
                        <input className="w-full border border-gray-200 rounded-xl px-4 py-3 mt-1" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} required />
                    </div>
                    <div>
                        <label className="text-sm font-semibold">Last name</label>
                        <input className="w-full border border-gray-200 rounded-xl px-4 py-3 mt-1" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} required />
                    </div>
                </div>
                <div>
                    <label className="text-sm font-semibold">Avatar URL (optional)</label>
                    <input className="w-full border border-gray-200 rounded-xl px-4 py-3 mt-1" value={form.avatar} onChange={e => setForm({ ...form, avatar: e.target.value })} placeholder="https://..." />
                </div>
                <div>
                    <label className="text-sm font-semibold">Email</label>
                    <input className="w-full border border-gray-200 rounded-xl px-4 py-3 mt-1 bg-gray-50" value={user?.email} disabled />
                </div>
                <button type="submit" className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold">Save profile</button>
            </form>

            <form onSubmit={changePassword} className="bg-white rounded-2xl p-6 border border-gray-100 space-y-4">
                <h2 className="font-bold text-lg">Change password</h2>
                <input type="password" placeholder="Current password" className="w-full border border-gray-200 rounded-xl px-4 py-3" value={pw.currentPassword} onChange={e => setPw({ ...pw, currentPassword: e.target.value })} required />
                <input type="password" placeholder="New password (min 6)" className="w-full border border-gray-200 rounded-xl px-4 py-3" value={pw.newPassword} onChange={e => setPw({ ...pw, newPassword: e.target.value })} required minLength={6} />
                <input type="password" placeholder="Confirm new password" className="w-full border border-gray-200 rounded-xl px-4 py-3" value={pw.confirmPassword} onChange={e => setPw({ ...pw, confirmPassword: e.target.value })} required />
                <button type="submit" className="px-6 py-3 bg-slate-800 text-white rounded-xl font-bold">Change password</button>
            </form>
        </div>
    );
}
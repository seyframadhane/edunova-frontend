import { useEffect, useState } from 'react';
import { Play, Ticket, Tag, Bell } from 'lucide-react';
import { notificationService } from '../../services/notification.service';

interface Notif {
    _id: string;
    type: 'course_upload' | 'resume' | 'coupon' | 'discount' | 'system';
    title?: string;
    description?: string;
    icon?: string;
    isRead: boolean;
    createdAt: string;
}

const iconFor = (type: Notif['type']) => {
    switch (type) {
        case 'resume':   return { bg: 'bg-orange-100', el: <Play className="text-orange-500 fill-orange-500" size={20} /> };
        case 'coupon':   return { bg: 'bg-yellow-100', el: <Ticket className="text-yellow-500 fill-yellow-500" size={20} /> };
        case 'discount': return { bg: 'bg-red-500',    el: <Tag className="text-white fill-white" size={20} /> };
        default:         return { bg: 'bg-indigo-100', el: <Bell className="text-indigo-500" size={20} /> };
    }
};

const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const min = Math.floor(diff / 60000);
    if (min < 1) return 'just now';
    if (min < 60) return `${min}min ago`;
    const h = Math.floor(min / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
};

const NotificationsDropdown = () => {
    const [notifications, setNotifications] = useState<Notif[]>([]);

    useEffect(() => {
        notificationService.list()
            .then(({ data }: any) => setNotifications(data.data))
            .catch(() => setNotifications([]));
    }, []);

    const markRead = async (id: string) => {
        await notificationService.markRead(id);
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    };

    return (
        <div className="absolute right-0 mt-4 w-[380px] bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden z-50">
            <div className="p-5 border-b border-gray-50">
                <h3 className="text-xl font-bold text-slate-800">Notifications</h3>
            </div>
            <div className="max-h-[480px] overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">No notifications yet</div>
                ) : notifications.map((notif, index) => {
                    const { bg, el } = iconFor(notif.type);
                    return (
                        <div key={notif._id}>
                            <div
                                onClick={() => markRead(notif._id)}
                                className={`flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer ${!notif.isRead ? 'opacity-100' : 'opacity-50'}`}
                            >
                                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${bg}`}>{el}</div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="text-sm font-semibold text-gray-500">{notif.title}</h4>
                                        <span className="text-xs text-gray-400">{timeAgo(notif.createdAt)}</span>
                                    </div>
                                    <p className="text-sm font-bold text-slate-800 truncate">{notif.description}</p>
                                </div>
                            </div>
                            {index < notifications.length - 1 && <div className="mx-4 border-b border-gray-50" />}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default NotificationsDropdown;
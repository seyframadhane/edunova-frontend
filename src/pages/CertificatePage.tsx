import { useEffect, useState } from 'react';
import { GraduationCap, Download } from 'lucide-react';
import { certificateService } from '../services/certificate.service';

export default function CertificatePage() {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        certificateService.mine()
            .then(({ data }: any) => setItems(data.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-400">Loading…</div>;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-extrabold text-slate-800 mb-8">My Certificates</h1>
            {items.length === 0 ? (
                <div className="text-center py-20">
                    <GraduationCap size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-400">Complete a course (100% progress) to earn your first certificate.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {items.map(cert => (
                        <div key={cert._id} className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-xl">
                            <GraduationCap size={32} className="mb-4" />
                            <h3 className="font-bold text-xl mb-2">{cert.course?.title}</h3>
                            <p className="text-indigo-100 text-sm mb-4">Awarded on {new Date(cert.issuedAt).toLocaleDateString()}</p>
                            <div className="bg-white/10 rounded-xl p-3 mb-4">
                                <p className="text-xs text-indigo-100">Certificate code</p>
                                <p className="font-mono font-bold">{cert.code}</p>
                            </div>
                            <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-700 rounded-xl font-bold text-sm">
                                <Download size={16} /> Download PDF
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
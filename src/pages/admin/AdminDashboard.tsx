import { useAuth } from '@/contexts/AuthContext';
import {
    Users,
    Package,
    MapPin,
    TrendingUp,
    Clock,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminAIInsight from '@/components/AdminAIInsight';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
    const { isSuperAdmin, profile } = useAuth();

    const stats = [
        {
            title: 'Toplam Kullanıcı',
            value: isSuperAdmin ? '1,284' : '156',
            icon: Users,
            color: 'text-blue-500',
            trend: '+12.5%'
        },
        {
            title: 'Deney Setleri',
            value: '17',
            icon: Package,
            color: 'text-emerald-500',
            trend: 'Sabit'
        },
        {
            title: isSuperAdmin ? 'Aktif Bayiler' : 'Sınıf Sayısı',
            value: isSuperAdmin ? '42' : '8',
            icon: isSuperAdmin ? MapPin : TrendingUp,
            color: 'text-amber-500',
            trend: isSuperAdmin ? '+3' : '+1'
        },
        {
            title: 'Tamamlanan Deneyler',
            value: isSuperAdmin ? '8,432' : '412',
            icon: CheckCircle2,
            color: 'text-indigo-500',
            trend: '+5.2%'
        }
    ];

    return (
        <div className="space-y-6">
            {/* İstatistikler */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <Card key={i} className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-400">{stat.title}</CardTitle>
                            <stat.icon className={`w-4 h-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">{stat.value}</div>
                            <p className="text-xs text-slate-500 mt-1">
                                <span className="text-emerald-500 font-medium">{stat.trend}</span> geçen aya göre
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sol Kolon: Aktivite ve Analiz */}
                <div className="lg:col-span-2 space-y-6">
                    {/* AI Insight (Yeni) */}
                    <AdminAIInsight isSuperAdmin={isSuperAdmin} stats={stats} />

                    {/* Son Aktiviteler */}
                    <Card className="bg-slate-900/50 border-slate-800 h-fit">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold text-white border-b border-slate-800 pb-2">
                                Son Aktiviteler
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {[1, 2, 3, 4, 5].map((_, i) => (
                                    <div key={i} className="flex items-start gap-4">
                                        <div className="mt-1 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                                            <Clock className="w-4 h-4 text-slate-400" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-slate-200">
                                                <span className="font-bold">Ahmet Yılmaz</span> adlı öğrenci <span className="text-emerald-400 font-medium">Hidrolik Kamyon</span> deneyini tamamladı.
                                            </p>
                                            <p className="text-xs text-slate-500 mt-1">15 dakika önce</p>
                                        </div>
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Bekleyen Onaylar / Duyurular */}
                <Card className="bg-slate-900/50 border-slate-800 h-fit">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-white border-b border-slate-800 pb-2">
                            {isSuperAdmin ? 'Onay Bekleyen Talepler' : 'Okul Duyuruları'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {isSuperAdmin ? (
                                <>
                                    {[1, 2, 3].map((_, i) => (
                                        <div key={i} className="p-3 rounded-lg bg-orange-500/5 border border-orange-500/10 flex flex-col gap-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-orange-400">TOPTAN TEKLİF</span>
                                                <span className="text-[10px] text-slate-500 uppercase">Yeni</span>
                                            </div>
                                            <p className="text-xs text-slate-300">Sandıklı Eğitim Merkezi için 50 adet Hidrolik Kamyon talebi.</p>
                                            <button className="text-[10px] text-blue-400 font-bold hover:underline self-end">DETAYLARI GÖR</button>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <AlertCircle className="w-10 h-10 text-slate-700 mb-2" />
                                    <p className="text-xs text-slate-500">Şu an için yeni bir duyuru bulunmuyor.</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

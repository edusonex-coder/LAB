import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    QrCode,
    Award,
    ShieldCheck,
    Zap,
    ChevronRight,
    Plus,
    Trophy,
    Gamepad2,
    Ticket,
    Download,
    Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { kitService, Activation } from '@/services/kitService';
import { useAuth } from '@/contexts/AuthContext';

export default function KitPassport() {
    const { profile } = useAuth();
    const [kits, setKits] = useState<Activation[]>([]);
    const [badges, setBadges] = useState<any[]>([]);
    const [serialCode, setSerialCode] = useState('');
    const [isActivating, setIsActivating] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [myKits, myBadges] = await Promise.all([
                kitService.getMyKits(),
                kitService.getMyBadges()
            ]);
            setKits(myKits);
            setBadges(myBadges);
        } catch (error) {
            console.error('Data load error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleActivate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!serialCode) return;

        setIsActivating(true);
        try {
            await kitService.activateKit(serialCode);
            toast.success('Kit başarıyla aktive edildi! Yeni içerikler açıldı.');
            setSerialCode('');
            loadData();
        } catch (error: any) {
            toast.error(error.message || 'Aktivasyon başarısız.');
        } finally {
            setIsActivating(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0f0d]">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0f0d] text-slate-200 pb-24 overflow-x-hidden">
            {/* 1. Header & QR Identity */}
            <div className="relative pt-12 pb-20 px-6 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none" />
                <div className="relative z-10 flex flex-col items-center text-center">
                    <motion.div
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="w-32 h-32 bg-white p-3 rounded-3xl shadow-2xl shadow-emerald-500/20 mb-6 relative group"
                    >
                        <QrCode className="w-full h-full text-slate-900" />
                        <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-black p-2 rounded-full shadow-lg">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                    </motion.div>
                    <h1 className="text-3xl font-black font-heading text-white tracking-tight">KİT PASAPORTU</h1>
                    <p className="text-emerald-500/80 font-medium text-sm mt-1 uppercase tracking-widest">Digital Twin & Progress Explorer</p>
                </div>
            </div>

            <div className="px-6 -mt-10 space-y-8 relative z-10 max-w-2xl mx-auto">

                {/* 2. Activation Card */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-slate-900/80 border border-emerald-500/30 backdrop-blur-xl rounded-3xl p-6 shadow-2xl"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-500">
                            <Plus className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white">Yeni Kit Aktive Et</h3>
                            <p className="text-xs text-slate-400">Kutu üzerindeki seri kodunu gir</p>
                        </div>
                    </div>
                    <form onSubmit={handleActivate} className="space-y-3">
                        <div className="relative">
                            <Input
                                placeholder="LAB-XXXX-XXXX"
                                value={serialCode}
                                onChange={(e) => setSerialCode(e.target.value)}
                                className="bg-slate-950/50 border-slate-800 text-emerald-400 font-mono text-center h-14 text-lg tracking-widest rounded-2xl"
                            />
                            <Zap className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500/30" />
                        </div>
                        <Button
                            type="submit"
                            disabled={isActivating || !serialCode}
                            className="w-full h-14 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-lg rounded-2xl shadow-lg shadow-emerald-500/20 transition-all duration-300"
                        >
                            {isActivating ? <Loader2 className="animate-spin" /> : 'SİSTEME BAĞLA'}
                        </Button>
                    </form>
                </motion.div>

                {/* 3. My Collection (The Physical-Digital Bridge) */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <Gamepad2 className="w-5 h-5 text-slate-400" /> Koleksiyonum
                        </h2>
                        <span className="bg-slate-800 text-slate-400 text-[10px] px-2 py-1 rounded-full uppercase font-bold tracking-tighter">
                            {kits.length} AKTİF KİT
                        </span>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {kits.length === 0 ? (
                            <div className="text-center py-10 border-2 border-dashed border-slate-800 rounded-3xl opacity-50">
                                <p className="text-sm">Henüz bir kit aktive edilmemiş.</p>
                            </div>
                        ) : kits.map((item, idx) => (
                            <motion.div
                                key={item.id}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-slate-900/40 border border-slate-800 p-4 rounded-3xl flex items-center gap-4 hover:border-emerald-500/50 transition-all group"
                            >
                                <div className="w-12 h-12 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                                    📦
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-white text-sm">{item.kit.model_name}</h4>
                                    <p className="text-[10px] text-slate-500 font-mono tracking-tighter uppercase">{item.kit.serial_code}</p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-emerald-500 transition-colors" />
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* 4. Badges (The Gamification Layer) */}
                <section className="space-y-4">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-amber-500" /> Başarı Rozetleri
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                        {badges.length === 0 ? (
                            <div className="col-span-2 text-center py-6 bg-slate-900/20 rounded-2xl border border-slate-800 italic text-sm text-slate-500">
                                Macerana başla ve rozetleri topla!
                            </div>
                        ) : badges.map((item, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ scale: 1.02 }}
                                className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-4 rounded-3xl flex flex-col items-center text-center relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="text-4xl mb-3 filter drop-shadow-lg group-hover:rotate-12 transition-transform">{item.badge.icon}</div>
                                <h5 className="font-bold text-xs text-white uppercase tracking-tight">{item.badge.name}</h5>
                                <p className="text-[9px] text-slate-500 mt-1 leading-tight">{item.badge.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* 5. Certificates & Bonuses */}
                <section className="space-y-4">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <Ticket className="w-5 h-5 text-purple-500" /> Kariyer & Ödüller
                    </h2>
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 rounded-3xl text-black relative overflow-hidden shadow-xl shadow-emerald-500/20">
                        <Download className="absolute -bottom-4 -right-4 w-32 h-32 opacity-20 rotate-12" />
                        <div className="relative z-10">
                            <h4 className="font-black text-xl mb-1">GELECEĞİN MÜHENDİSİ</h4>
                            <p className="text-sm font-bold opacity-80 mb-4">5 Kit Tamamlandı — Sertifikan Hazır!</p>
                            <Button className="bg-white hover:bg-slate-100 text-black font-bold h-10 px-6 rounded-xl shadow-lg border-none">
                                SERTİFİKAYI İNDİR
                            </Button>
                        </div>
                    </div>

                    <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl text-center">
                        <p className="text-xs text-slate-500 uppercase font-black tracking-widest mb-2">Hediye Kuponu</p>
                        <p className="text-2xl font-mono font-black text-emerald-400 tracking-[0.2em]">LAB-ELITE-20</p>
                        <p className="text-[10px] text-slate-600 mt-3">Bir sonraki kit alışverişinde %20 indirim sağlar.</p>
                    </div>
                </section>

            </div>
        </div>
    );
}

import { useState } from 'react';
import { Sparkles, Loader2, BrainCircuit, BarChart3, Rocket, MessageSquare, ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { sendMessageToGroq } from '@/services/aiService';

export default function AdminAIInsight({ isSuperAdmin, stats }: { isSuperAdmin: boolean, stats: any[] }) {
    const [insight, setInsight] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const generateInsight = async () => {
        setIsLoading(true);
        try {
            const statsSummary = stats.map(s => `${s.title}: ${s.value}`).join(', ');
            const prompt = `Sen Edusonex'in Stratejik AI Danışmanısın. Bir ${isSuperAdmin ? 'Holding Super Admini' : 'Okul Müdürü'} için dashboard verilerini analiz et. 
            Veriler: ${statsSummary}. 
            Lütfen şunları yap: 
            1. Bu sayılar ne anlama geliyor (kısa özet)? 
            2. Bir risk veya iyileştirilmesi gereken alan görünüyor mu? 
            3. Gelecek ay için spesifik bir "Aksiyon Önerisi" ver. 
            Profesyonel ama vizyoner bir dil kullan. Türkçe olsun. Madde madde yaz.`;

            const reply = await sendMessageToGroq([{ role: 'user', content: prompt }]);
            setInsight(reply);
        } catch (error) {
            console.error('Insight error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border-indigo-500/20 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <BrainCircuit size={80} className="text-indigo-500 rotate-12" />
            </div>

            <CardHeader className="relative z-10">
                <CardTitle className="text-lg font-black text-white flex items-center gap-2">
                    <Sparkles className="text-indigo-400 animate-pulse" /> AI STRATEJİK ANALİZ
                </CardTitle>
            </CardHeader>

            <CardContent className="relative z-10 space-y-4">
                <AnimatePresence mode="wait">
                    {!insight ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center py-6 text-center"
                        >
                            <p className="text-sm text-slate-400 mb-6 max-w-sm">
                                Dashboard verilerini derinlemesine analiz ederek size özel büyüme stratejileri üretelim.
                            </p>
                            <Button
                                onClick={generateInsight}
                                disabled={isLoading}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl gap-2 h-11 px-8 shadow-lg shadow-indigo-500/20 transition-all border-none"
                            >
                                {isLoading ? <Loader2 className="animate-spin" /> : <BarChart3 size={18} />}
                                VERİLERİ ANALİZ ET
                            </Button>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            <div className="bg-slate-950/40 border border-indigo-500/20 p-5 rounded-2xl text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-medium">
                                {insight}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex items-center gap-2">
                                    <Rocket size={16} className="text-emerald-500" />
                                    <span className="text-[11px] font-bold text-emerald-400 uppercase">Growth Focus</span>
                                </div>
                                <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl flex items-center gap-2">
                                    <ShieldAlert size={16} className="text-amber-500" />
                                    <span className="text-[11px] font-bold text-amber-400 uppercase">Risk Shield</span>
                                </div>
                            </div>

                            <Button
                                variant="ghost"
                                onClick={() => setInsight(null)}
                                className="w-full text-slate-500 hover:text-slate-300 text-xs font-bold"
                            >
                                ANALİZİ YENİLE
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>
        </Card>
    );
}

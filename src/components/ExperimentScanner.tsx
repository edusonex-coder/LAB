import { useState, useRef } from 'react';
import {
    Camera,
    Upload,
    Loader2,
    Sparkles,
    X,
    Check,
    GraduationCap,
    Trophy,
    Lightbulb,
    BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { analyzeImageWithGroq } from '@/services/aiService';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from '@/components/Confetti';

interface ExperimentScannerProps {
    experimentTitle: string;
    onClose: () => void;
}

const EduMascot = ({ status }: { status: 'idle' | 'analyzing' | 'success' | 'error' }) => {
    return (
        <motion.div
            animate={status === 'analyzing' ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : (status === 'success' ? { y: [0, -20, 0] } : {})}
            transition={status === 'analyzing' ? { repeat: Infinity, duration: 2 } : { duration: 0.5 }}
            className="relative w-24 h-24 mx-auto mb-4"
        >
            <div className={`absolute inset-0 rounded-full blur-2xl opacity-20 ${status === 'analyzing' ? 'bg-indigo-500' : (status === 'success' ? 'bg-emerald-500' : 'bg-slate-500')}`} />
            <svg viewBox="0 0 100 100" className="w-full h-full relative z-10">
                <rect x="25" y="30" width="50" height="50" rx="15" fill="#6366f1" />
                <rect x="30" y="35" width="40" height="40" rx="10" fill="#1e293b" />
                <motion.circle
                    cx="40" cy="50" r="4"
                    fill={status === 'success' ? '#10b981' : '#f8fafc'}
                    animate={status === 'analyzing' ? { opacity: [1, 0, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 1 }}
                />
                <motion.circle
                    cx="60" cy="50" r="4"
                    fill={status === 'success' ? '#10b981' : '#f8fafc'}
                    animate={status === 'analyzing' ? { opacity: [1, 0, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 1 }}
                />
                <line x1="50" y1="30" x2="50" y2="15" stroke="#6366f1" strokeWidth="4" />
                <motion.circle
                    cx="50" cy="15" r="5"
                    fill={status === 'analyzing' ? '#fbbf24' : '#6366f1'}
                    animate={status === 'analyzing' ? { scale: [1, 1.5, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                />
            </svg>
        </motion.div>
    );
};

export default function ExperimentScanner({ experimentTitle, onClose }: ExperimentScannerProps) {
    const [image, setImage] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<{
        feedback: string;
        hint: string;
        story: string;
        talent_score: number;
    } | null>(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
                setAnalysisResult(null);
                setShowConfetti(false);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAnalyze = async () => {
        if (!image) return;

        setIsAnalyzing(true);
        try {
            const base64 = image.split(',')[1];
            const feedback = await analyzeImageWithGroq(base64, experimentTitle);
            setAnalysisResult(feedback);
            if (feedback.talent_score >= 90) {
                setShowConfetti(true);
            }
        } catch (error) {
            toast.error('AI analiz yaparken bir sorun oluştu.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed inset-0 z-50 bg-black/95 flex flex-col p-6 overflow-y-auto"
        >
            {showConfetti && <Confetti />}

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-black text-white flex items-center gap-2">
                        <Sparkles className="text-emerald-500" /> DENEY DEDEKTİFİ
                    </h2>
                    <p className="text-xs text-slate-500 uppercase tracking-widest leading-loose">{experimentTitle}</p>
                </div>
                <button onClick={onClose} className="p-2 bg-slate-900 rounded-full text-slate-400">
                    <X size={24} />
                </button>
            </div>

            <div className="flex-1 flex flex-col items-center gap-6">
                {!image ? (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-[2.5rem] bg-slate-950/50 cursor-pointer hover:border-emerald-500/50 transition-all"
                    >
                        <EduMascot status="idle" />
                        <p className="font-bold text-white text-lg">Deney Fotoğrafını Çek</p>
                        <p className="text-xs text-slate-500 mt-2 uppercase tracking-tighter">veya dosyalarından seç</p>
                        <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </div>
                ) : (
                    <div className="w-full flex-1 flex flex-col items-center gap-6">
                        <div className="relative w-full max-h-[40vh] overflow-hidden rounded-[2.5rem] border border-slate-800 shadow-2xl">
                            <img src={image} alt="Experiment" className="w-full h-full object-cover" />
                            {!isAnalyzing && !analysisResult && (
                                <button
                                    onClick={() => setImage(null)}
                                    className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-md rounded-full text-white"
                                >
                                    <X size={20} />
                                </button>
                            )}
                        </div>

                        {isAnalyzing && (
                            <div className="text-center py-4">
                                <EduMascot status="analyzing" />
                                <p className="text-emerald-400 font-black text-lg animate-pulse tracking-tight mt-2 italic">
                                    "Hımm, dur bakayım burda neler oluyor..."
                                </p>
                            </div>
                        )}

                        {!analysisResult && !isAnalyzing && (
                            <Button
                                onClick={handleAnalyze}
                                disabled={isAnalyzing}
                                className="w-full h-16 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-lg rounded-2xl gap-2 shadow-lg shadow-emerald-500/20"
                            >
                                <Sparkles size={20} /> ANALİZİ BAŞLAT
                            </Button>
                        )}

                        <AnimatePresence>
                            {analysisResult && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="w-full space-y-4"
                                >
                                    <EduMascot status="success" />
                                    <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1">
                                                <Trophy size={14} /> Mühendislik Puanı
                                            </span>
                                            <span className="text-lg font-black text-white">{analysisResult.talent_score}</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${analysisResult.talent_score}%` }}
                                                className="h-full bg-gradient-to-r from-amber-600 to-orange-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                                        <div className="flex gap-3 text-left">
                                            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                                                <GraduationCap className="text-indigo-400" size={20} />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-bold text-indigo-400 uppercase tracking-tight">Edu'nun Notu</p>
                                                <p className="text-slate-200 leading-relaxed italic">"{analysisResult.feedback}"</p>
                                            </div>
                                        </div>

                                        {analysisResult.hint && (
                                            <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-3 flex gap-3 text-left italic">
                                                <Lightbulb className="text-amber-500 shrink-0" size={18} />
                                                <p className="text-sm text-slate-300">{analysisResult.hint}</p>
                                            </div>
                                        )}

                                        <div className="pt-4 border-t border-slate-800 text-left">
                                            <div className="flex items-center gap-2 mb-2">
                                                <BookOpen size={16} className="text-emerald-400" />
                                                <span className="text-[10px] font-black text-emerald-500 uppercase">Bilim Hikayesi</span>
                                            </div>
                                            <p className="text-xs text-slate-400 leading-relaxed font-medium">
                                                {analysisResult.story}
                                            </p>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={onClose}
                                        className="w-full h-14 bg-white text-black hover:bg-slate-200 font-bold rounded-xl text-lg"
                                    >
                                        GÖREVİ TAMAMLA 🚀
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            <div className="mt-8 text-center pb-6">
                <p className="text-[10px] text-slate-600 uppercase tracking-[0.2em] leading-loose">
                    Edusonex LAB Innovation Engine<br />
                    v3.0.0 Stable | Shared with OdevGPT
                </p>
            </div>
        </motion.div>
    );
}

import { useState, useRef } from 'react';
import { Camera, Upload, Loader2, Sparkles, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { analyzeImageWithGroq } from '@/services/aiService';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface ExperimentScannerProps {
    experimentTitle: string;
    onClose: () => void;
}

export default function ExperimentScanner({ experimentTitle, onClose }: ExperimentScannerProps) {
    const [image, setImage] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
                setResult(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAnalyze = async () => {
        if (!image) return;

        setIsAnalyzing(true);
        try {
            // Remove the "data:image/jpeg;base64," prefix
            const base64 = image.split(',')[1];
            const feedback = await analyzeImageWithGroq(base64, experimentTitle);
            setResult(feedback);
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
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-black text-white flex items-center gap-2">
                        <Sparkles className="text-emerald-500" /> DENEY DEDEKTİFİ
                    </h2>
                    <p className="text-xs text-slate-500 uppercase tracking-widest">{experimentTitle}</p>
                </div>
                <button onClick={onClose} className="p-2 bg-slate-900 rounded-full text-slate-400">
                    <X size={24} />
                </button>
            </div>

            {!image ? (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-[2.5rem] bg-slate-950/50 mb-6 cursor-pointer hover:border-emerald-500/50 transition-all"
                >
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mb-4">
                        <Camera size={40} />
                    </div>
                    <p className="font-bold text-white">Deney Fotoğrafını Çek</p>
                    <p className="text-xs text-slate-500 mt-2">veya galeriden yükle</p>
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
                <div className="flex-1 flex flex-col items-center gap-6 mb-6">
                    <div className="relative w-full max-h-[50vh] overflow-hidden rounded-[2.5rem] border border-slate-800 shadow-2xl">
                        <img src={image} alt="Experiment" className="w-full h-full object-cover" />
                        <button
                            onClick={() => setImage(null)}
                            className="absolute top-4 right-4 p-2 bg-black/50 blur-card rounded-full text-white"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {!result && (
                        <Button
                            onClick={handleAnalyze}
                            disabled={isAnalyzing}
                            className="w-full h-16 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-lg rounded-2xl gap-2 shadow-lg shadow-emerald-500/20"
                        >
                            {isAnalyzing ? (
                                <><Loader2 className="animate-spin" /> ANALİZ EDİLİYOR...</>
                            ) : (
                                <><Sparkles size={20} /> ANALİZ ET</>
                            )}
                        </Button>
                    )}

                    <AnimatePresence>
                        {result && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="w-full bg-slate-900/80 border border-emerald-500/30 backdrop-blur-xl p-6 rounded-[2rem] text-slate-200"
                            >
                                <div className="flex items-center gap-2 mb-3 text-emerald-500 font-black text-sm uppercase tracking-tighter">
                                    <Check size={18} /> EDU'NUN GÖRÜŞÜ
                                </div>
                                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                                    {result}
                                </div>
                                <Button
                                    onClick={onClose}
                                    className="w-full mt-6 bg-slate-800 hover:bg-slate-700 text-white font-bold h-12 rounded-xl"
                                >
                                    TEŞEKKÜRLER!
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}

            <div className="text-center">
                <p className="text-[10px] text-slate-600 uppercase tracking-widest leading-loose">
                    Powered by Edusonex AI Vision Engine<br />
                    Llama 3.2 Vision Preview v1.1
                </p>
            </div>
        </motion.div>
    );
}

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, Lock, UserPlus, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';

export default function Register() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { signUp } = useAuth();
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await signUp(email, password, fullName);
            toast.success('Kayıt başarılı! Bilimin dünyasına hoş geldin.');
        } catch (error: any) {
            toast.error('Kayıt yapılamadı: ' + (error.message || 'Lütfen bilgileri kontrol edin'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0f0d] p-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-[110px]" />
                <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[130px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
                        <UserPlus className="text-white w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Aramıza Katıl</h1>
                    <p className="text-slate-400 text-sm">Geleceğin mucitleri burada yetişıyor</p>
                </div>

                <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl">
                    <CardHeader>
                        <CardTitle className="text-white text-xl">Yeni Hesap Oluştur</CardTitle>
                        <CardDescription className="text-slate-400">
                            Bilim dolu yolculuğuna başlamak için formu doldur.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullName" className="text-slate-300">Ad Soyad</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <Input
                                        id="fullName"
                                        type="text"
                                        placeholder="Ahmet Yılmaz"
                                        required
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="bg-slate-950 border-slate-700 text-white pl-10 focus:ring-emerald-500/50 focus:border-emerald-500/50"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-300">E-posta</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="ornek@edusonex.com"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="bg-slate-950 border-slate-700 text-white pl-10 focus:ring-emerald-500/50 focus:border-emerald-500/50"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-slate-300">Şifre</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="bg-slate-950 border-slate-700 text-white pl-10 focus:ring-emerald-500/50 focus:border-emerald-500/50"
                                    />
                                </div>
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold py-6 text-lg transition-all duration-300"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                        Hesap oluşturuluyor...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="w-5 h-5 mr-2" />
                                        Hemen Kayıt Ol
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <div className="text-center text-sm">
                            <span className="text-slate-500">Zaten hesabın var mı?</span>{' '}
                            <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                                Giriş Yap
                            </Link>
                        </div>
                        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
                            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                            <p className="text-[10px] text-emerald-300/80 leading-snug">
                                Tek bir hesapla tüm Edusonex projelerine (odevgpt, LAB vb.) erişebilirsin.
                            </p>
                        </div>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}

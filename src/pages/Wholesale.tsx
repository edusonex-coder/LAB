import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Building2,
    Package,
    Award,
    CheckCircle,
    Send,
    Phone,
    Mail,
    MapPin,
    ChevronDown,
    Banknote,
    ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const PRODUCTS = [
    "Denge Kuşu", "Balonlu Jet Arabası", "Periskop", "Işıklı Ev (Elektrik Devresi)",
    "El Feneri Seti", "Eşit Kollu Terazi", "Hidrolik Kamyon", "Mancınık",
    "Rüzgar Gülü", "Solar Değirmen", "Solar Uçak", "Su Kuyusu",
    "Mıknatıslı Araba", "Para Ayırma Makinesi", "Kumbara", "Tavşan Gece Lambası",
];

const schema = z.object({
    firma_adi: z.string().min(2, "Firma adı gerekli"),
    yetkili_adi: z.string().min(2, "Yetkili adı gerekli"),
    email: z.string().email("Geçerli e-posta giriniz"),
    telefon: z.string().min(10, "Telefon numarası gerekli"),
    sehir: z.string().min(2, "Şehir gerekli"),
    satis_turu: z.enum(["toptan", "white-label", "her-ikisi"]),
    aciklama: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const BENEFITS = [
    { icon: <Package className="w-5 h-5 text-emerald-400" />, label: "Min. 10 adet'ten toptan fiyat" },
    { icon: <Award className="w-5 h-5 text-teal-400" />, label: "White-label: kendi markanızla satın" },
    { icon: <Banknote className="w-5 h-5 text-amber-400" />, label: "Ödeme: Yalnızca EFT / Havale" },
    { icon: <ShieldCheck className="w-5 h-5 text-cyan-400" />, label: "MEB onaylı, EN71 güvenlik standardı" },
];

export default function Wholesale() {
    const [submitted, setSubmitted] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [satisTuru, setSatisTuru] = useState<"toptan" | "white-label" | "her-ikisi">("toptan");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: { satis_turu: "toptan" },
    });

    const toggleProduct = (p: string) =>
        setSelectedProducts((prev) =>
            prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
        );

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        try {
            const { error } = await supabase.from("wholesale_requests").insert([
                {
                    firma_adi: data.firma_adi,
                    yetkili_adi: data.yetkili_adi,
                    email: data.email,
                    telefon: data.telefon,
                    sehir: data.sehir,
                    satis_turu: satisTuru,
                    urunler: selectedProducts,
                    aciklama: data.aciklama || "",
                    durum: "beklemede",
                    created_at: new Date().toISOString(),
                },
            ]);

            if (error) throw error;
            setSubmitted(true);
        } catch (err) {
            console.error(err);
            toast.error("Gönderim sırasında bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-[#0a0f0d] flex items-center justify-center p-6">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center max-w-md"
                >
                    <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-12 h-12 text-emerald-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">Talebiniz Alındı!</h2>
                    <p className="text-slate-400 mb-6 leading-relaxed">
                        Teklifiniz incelemeye alındı. En kısa sürede (genellikle 24 saat içinde)
                        satış ekibimiz sizinle iletişime geçecektir.
                    </p>
                    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 text-left space-y-2 mb-6">
                        <p className="text-sm text-slate-400 flex items-center gap-2">
                            <Phone className="w-4 h-4 text-emerald-400" />
                            WhatsApp: <a href="https://wa.me/905XXXXXXXXX" className="text-emerald-400 hover:underline">(0XXX) XXX XX XX</a>
                        </p>
                        <p className="text-sm text-slate-400 flex items-center gap-2">
                            <Mail className="w-4 h-4 text-emerald-400" />
                            E-posta: <a href="mailto:satis@edusonex.com.tr" className="text-emerald-400 hover:underline">satis@edusonex.com.tr</a>
                        </p>
                    </div>
                    <Button
                        onClick={() => setSubmitted(false)}
                        variant="outline"
                        className="border-emerald-700 text-emerald-400"
                    >
                        Yeni Talep Oluştur
                    </Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0f0d]">
            {/* Header */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#0a1f14] to-[#0a0f0d] border-b border-emerald-900/30">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 right-20 w-72 h-72 bg-emerald-500 rounded-full blur-[120px]" />
                </div>
                <div className="relative max-w-4xl mx-auto px-6 py-16 text-center">
                    <Badge className="mb-4 bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                        B2B Satış · Toptan & White-Label
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Toptan / White-Label
                        <span className="text-emerald-400"> Teklif İste</span>
                    </h1>
                    <p className="text-slate-400 text-lg">
                        Okul, eğitim merkezi, bayi veya kendi markanızla satış yapmak
                        istiyorsanız formu doldurun, size özel teklif hazırlayalım.
                    </p>
                </div>
            </section>

            <section className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Sol: Bilgi Paneli */}
                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-bold text-white mb-4">Neden Edusonex?</h2>
                        <div className="space-y-3">
                            {BENEFITS.map((b, i) => (
                                <div key={i} className="flex items-center gap-3 bg-slate-800/50 border border-slate-700/50 rounded-xl p-3">
                                    {b.icon}
                                    <span className="text-slate-300 text-sm">{b.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Banknote className="w-5 h-5 text-amber-400" />
                            <span className="text-amber-400 font-semibold text-sm">Ödeme Bilgisi</span>
                        </div>
                        <p className="text-amber-300/70 text-sm leading-relaxed">
                            Tüm toptan ve white-label satışlarda ödeme yalnızca <strong className="text-amber-300">EFT veya Havale</strong> ile yapılmaktadır. Kredi kartı kabul edilmemektedir.
                        </p>
                    </div>

                    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Phone className="w-4 h-4 text-emerald-400" />
                            <span className="text-white font-semibold text-sm">Hızlı İletişim</span>
                        </div>
                        <a
                            href="https://wa.me/905XXXXXXXXX"
                            className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-sm transition-colors"
                        >
                            WhatsApp ile yazın →
                        </a>
                    </div>

                    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Building2 className="w-4 h-4 text-slate-400" />
                            <span className="text-white font-semibold text-sm">Parakende Alım</span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Bireysel alım için{" "}
                            <a href="/bayi-bul" className="text-emerald-400 hover:underline">
                                yetkili bayilerimizi
                            </a>{" "}
                            arayabilirsiniz.
                        </p>
                    </div>
                </div>

                {/* Sağ: Form */}
                <div className="lg:col-span-2">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-8 space-y-6"
                    >
                        <h3 className="text-xl font-bold text-white">Talep Formu</h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <Label className="text-slate-300 mb-1 block">Firma Adı *</Label>
                                <Input
                                    {...register("firma_adi")}
                                    placeholder="Eğitim Merkezi A.Ş."
                                    className="bg-slate-900 border-slate-600 text-white"
                                />
                                {errors.firma_adi && (
                                    <p className="text-red-400 text-xs mt-1">{errors.firma_adi.message}</p>
                                )}
                            </div>
                            <div>
                                <Label className="text-slate-300 mb-1 block">Yetkili Adı Soyadı *</Label>
                                <Input
                                    {...register("yetkili_adi")}
                                    placeholder="Ahmet Yılmaz"
                                    className="bg-slate-900 border-slate-600 text-white"
                                />
                                {errors.yetkili_adi && (
                                    <p className="text-red-400 text-xs mt-1">{errors.yetkili_adi.message}</p>
                                )}
                            </div>
                            <div>
                                <Label className="text-slate-300 mb-1 block">E-posta *</Label>
                                <Input
                                    {...register("email")}
                                    type="email"
                                    placeholder="satis@firma.com"
                                    className="bg-slate-900 border-slate-600 text-white"
                                />
                                {errors.email && (
                                    <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
                                )}
                            </div>
                            <div>
                                <Label className="text-slate-300 mb-1 block">Telefon *</Label>
                                <Input
                                    {...register("telefon")}
                                    placeholder="0532 XXX XX XX"
                                    className="bg-slate-900 border-slate-600 text-white"
                                />
                                {errors.telefon && (
                                    <p className="text-red-400 text-xs mt-1">{errors.telefon.message}</p>
                                )}
                            </div>
                            <div>
                                <Label className="text-slate-300 mb-1 block">Şehir *</Label>
                                <Input
                                    {...register("sehir")}
                                    placeholder="İstanbul"
                                    className="bg-slate-900 border-slate-600 text-white"
                                />
                                {errors.sehir && (
                                    <p className="text-red-400 text-xs mt-1">{errors.sehir.message}</p>
                                )}
                            </div>

                            {/* Satış Türü */}
                            <div>
                                <Label className="text-slate-300 mb-1 block">Satış Türü *</Label>
                                <div className="flex gap-2">
                                    {(["toptan", "white-label", "her-ikisi"] as const).map((t) => (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => setSatisTuru(t)}
                                            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${satisTuru === t
                                                    ? "bg-emerald-500 text-black"
                                                    : "bg-slate-700 text-slate-400 hover:bg-slate-600"
                                                }`}
                                        >
                                            {t === "toptan" ? "Toptan" : t === "white-label" ? "White-Label" : "Her İkisi"}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Ürün Seçimi */}
                        <div>
                            <Label className="text-slate-300 mb-3 block">
                                İlgilendiğiniz Ürünler (isteğe bağlı)
                            </Label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                                {PRODUCTS.map((p) => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => toggleProduct(p)}
                                        className={`text-left px-3 py-2 rounded-lg text-xs transition-all ${selectedProducts.includes(p)
                                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                                                : "bg-slate-700/50 text-slate-400 border border-slate-600/50 hover:border-slate-500"
                                            }`}
                                    >
                                        {selectedProducts.includes(p) && "✓ "}{p}
                                    </button>
                                ))}
                            </div>
                            {selectedProducts.length > 0 && (
                                <p className="text-emerald-400/60 text-xs mt-2">
                                    {selectedProducts.length} ürün seçildi
                                </p>
                            )}
                        </div>

                        {/* Açıklama */}
                        <div>
                            <Label className="text-slate-300 mb-1 block">Ek Notlar / Miktar Bilgisi</Label>
                            <Textarea
                                {...register("aciklama")}
                                placeholder="Örn: 200 adet Periskop, 150 adet Hidrolik Kamyon gerekiyor. Okul yılı başında teslimat istiyoruz."
                                className="bg-slate-900 border-slate-600 text-white min-h-24"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            size="lg"
                            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold gap-2"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                    Gönderiliyor...
                                </span>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    Teklif Talebimi Gönder
                                </>
                            )}
                        </Button>

                        <p className="text-slate-500 text-xs text-center">
                            Talebiniz alındıktan sonra en geç 24 iş saati içinde geri dönüş yapılır.
                            Ödeme yalnızca EFT/Havale ile kabul edilir.
                        </p>
                    </form>
                </div>
            </section>
        </div>
    );
}

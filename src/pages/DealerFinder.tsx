import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    MapPin,
    Search,
    Phone,
    Mail,
    Clock,
    Store,
    ChevronRight,
    Filter,
    CheckCircle,
    AlertCircle,
    Navigation,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

// Türkiye il listesi
const ILLER = [
    "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya",
    "Artvin", "Aydın", "Balıkesir", "Bilecik", "Bingöl", "Bitlis", "Bolu",
    "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır",
    "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun",
    "Gümüşhane", "Hakkari", "Hatay", "Isparta", "Mersin", "İstanbul", "İzmir",
    "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir", "Kocaeli", "Konya",
    "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş",
    "Nevşehir", "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop",
    "Sivas", "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Şanlıurfa", "Uşak",
    "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman", "Kırıkkale",
    "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük",
    "Kilis", "Osmaniye", "Düzce",
];

interface Dealer {
    id: string;
    ad: string;
    sehir: string;
    ilce: string;
    mahalle?: string;
    telefon: string;
    email: string;
    adres: string;
    durum: string;
    projeler: string[];
    calisma_saatleri?: string;
}

// Mock bayi verisi (Supabase'de bayi tablosu oluşturulana kadar)
const MOCK_DEALERS: Dealer[] = [
    {
        id: "1",
        ad: "Eğitim Dünyası Eğitim Merkezi",
        sehir: "İstanbul",
        ilce: "Kadıköy",
        mahalle: "Moda",
        telefon: "0216 XXX XX XX",
        email: "info@egitimdunyasi.com",
        adres: "Moda Cad. No: XX, Kadıköy/İstanbul",
        durum: "aktif",
        projeler: ["LAB Deney Setleri", "ÖdevGPT"],
        calisma_saatleri: "09:00 - 18:00 (Pzt-Cmt)",
    },
    {
        id: "2",
        ad: "Bilim ve Teknoloji Okulu",
        sehir: "Ankara",
        ilce: "Çankaya",
        mahalle: "Kavaklıdere",
        telefon: "0312 XXX XX XX",
        email: "bilim@bilimtekno.com",
        adres: "Kavaklıdere Mah. Akay Cad. No: XX",
        durum: "aktif",
        projeler: ["LAB Deney Setleri"],
        calisma_saatleri: "08:30 - 17:30 (Pzt-Cum)",
    },
    {
        id: "3",
        ad: "STEM Akademi İzmir",
        sehir: "İzmir",
        ilce: "Bornova",
        mahalle: "Kazımdirik",
        telefon: "0232 XXX XX XX",
        email: "stem@stemakademi.com",
        adres: "Kazımdirik Mah. No: XX, Bornova/İzmir",
        durum: "aktif",
        projeler: ["LAB Deney Setleri", "ÖdevGPT"],
        calisma_saatleri: "09:00 - 19:00 (Pzt-Cmt)",
    },
    {
        id: "4",
        ad: "Sandıklı Eğitim Merkezi",
        sehir: "Afyonkarahisar",
        ilce: "Sandıklı",
        mahalle: "Merkez",
        telefon: "0272 XXX XX XX",
        email: "info@sandikli-egitim.com",
        adres: "Cumhuriyet Cad. No: XX, Sandıklı/Afyon",
        durum: "aktif",
        projeler: ["LAB Deney Setleri"],
        calisma_saatleri: "09:00 - 17:00 (Pzt-Cmt)",
    },
    {
        id: "5",
        ad: "Bursa Mantis Robotik",
        sehir: "Bursa",
        ilce: "Nilüfer",
        mahalle: "Özlüce",
        telefon: "0224 XXX XX XX",
        email: "bursa@mantisrobotik.com",
        adres: "Özlüce Mah. Ar-Ge Cad. No: XX, Nilüfer/Bursa",
        durum: "aktif",
        projeler: ["LAB Deney Setleri"],
        calisma_saatleri: "09:00 - 18:00 (Pzt-Cum)",
    },
];

const PROJE_RENKLERI: Record<string, string> = {
    "LAB Deney Setleri": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    "ÖdevGPT": "bg-blue-500/20 text-blue-400 border-blue-500/30",
    "DokumanOS": "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

export default function DealerFinder() {
    const [dealers, setDealers] = useState<Dealer[]>(MOCK_DEALERS);
    const [searchCity, setSearchCity] = useState("");
    const [searchDistrict, setSearchDistrict] = useState("");
    const [searchNeighborhood, setSearchNeighborhood] = useState("");
    const [searchText, setSearchText] = useState("");
    const [cityDropdown, setCityDropdown] = useState(false);
    const [loading, setLoading] = useState(false);

    // Supabase'den bayileri çek
    useEffect(() => {
        async function fetchDealers() {
            setLoading(true);
            const { data, error } = await supabase
                .from("dealers")
                .select("*")
                .eq("durum", "aktif");

            if (data && data.length > 0 && !error) {
                setDealers(data as Dealer[]);
            }
            // Hata durumunda mock data kullanmaya devam et
            setLoading(false);
        }
        fetchDealers();
    }, []);

    const filteredDealers = dealers.filter((d) => {
        const matchCity = searchCity
            ? d.sehir.toLowerCase().includes(searchCity.toLowerCase())
            : true;
        const matchDistrict = searchDistrict
            ? d.ilce?.toLowerCase().includes(searchDistrict.toLowerCase())
            : true;
        const matchNeighborhood = searchNeighborhood
            ? d.mahalle?.toLowerCase().includes(searchNeighborhood.toLowerCase())
            : true;
        const matchText = searchText
            ? d.ad.toLowerCase().includes(searchText.toLowerCase()) ||
            d.adres.toLowerCase().includes(searchText.toLowerCase())
            : true;
        return matchCity && matchDistrict && matchNeighborhood && matchText;
    });

    const filteredIller = ILLER.filter((il) =>
        il.toLowerCase().includes(searchCity.toLowerCase())
    ).slice(0, 8);

    return (
        <div className="min-h-screen bg-[#0a0f0d]">
            {/* Hero */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#0a1a2e] to-[#0a0f0d] border-b border-blue-900/30">
                <div className="absolute inset-0 opacity-15">
                    <div className="absolute top-10 left-20 w-64 h-64 bg-blue-500 rounded-full blur-[120px]" />
                    <div className="absolute bottom-10 right-20 w-72 h-72 bg-emerald-500 rounded-full blur-[130px]" />
                </div>
                <div className="relative max-w-5xl mx-auto px-6 py-16 text-center">
                    <Badge className="mb-4 bg-blue-500/20 text-blue-400 border-blue-500/30">
                        <Navigation className="w-3 h-3 mr-1" />
                        Tüm Türkiye'de Yetkili Bayiler
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Size En Yakın
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                            {" "}Bayiyi Bulun
                        </span>
                    </h1>
                    <p className="text-slate-400 text-lg mb-4">
                        Parakende alım için tüm Türkiye'deki yetkili bayilerimizi bulabilirsiniz.
                        Şehir, ilçe ve mahalle bazında arama yapın.
                    </p>
                    <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-2">
                        <AlertCircle className="w-4 h-4 text-amber-400" />
                        <span className="text-amber-300 text-sm">
                            Toptan ve white-label alım için{" "}
                            <a href="/toptan-teklif" className="underline hover:text-amber-200">
                                teklif sayfasını
                            </a>{" "}
                            ziyaret edin.
                        </span>
                    </div>
                </div>
            </section>

            {/* Arama Filtresi */}
            <section className="max-w-5xl mx-auto px-6 py-8">
                <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">
                    <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
                        <Filter className="w-4 h-4 text-emerald-400" />
                        Bayileri Filtrele
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Şehir Arama (Dropdown) */}
                        <div className="relative">
                            <label className="text-slate-400 text-xs block mb-1">İl / Şehir</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <Input
                                    value={searchCity}
                                    onChange={(e) => {
                                        setSearchCity(e.target.value);
                                        setCityDropdown(true);
                                    }}
                                    onFocus={() => setCityDropdown(true)}
                                    onBlur={() => setTimeout(() => setCityDropdown(false), 200)}
                                    placeholder="İstanbul, Ankara..."
                                    className="pl-10 bg-slate-900 border-slate-600 text-white"
                                />
                            </div>
                            {/* Il Dropdown */}
                            <AnimatePresence>
                                {cityDropdown && searchCity && filteredIller.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        className="absolute z-20 top-full mt-1 left-0 right-0 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-2xl"
                                    >
                                        {filteredIller.map((il) => (
                                            <button
                                                key={il}
                                                onMouseDown={() => {
                                                    setSearchCity(il);
                                                    setCityDropdown(false);
                                                }}
                                                className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 transition-colors"
                                            >
                                                {il}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* İlçe */}
                        <div>
                            <label className="text-slate-400 text-xs block mb-1">İlçe</label>
                            <Input
                                value={searchDistrict}
                                onChange={(e) => setSearchDistrict(e.target.value)}
                                placeholder="Kadıköy, Çankaya..."
                                className="bg-slate-900 border-slate-600 text-white"
                            />
                        </div>

                        {/* Mahalle */}
                        <div>
                            <label className="text-slate-400 text-xs block mb-1">Mahalle / Köy</label>
                            <Input
                                value={searchNeighborhood}
                                onChange={(e) => setSearchNeighborhood(e.target.value)}
                                placeholder="Mahalle adı..."
                                className="bg-slate-900 border-slate-600 text-white"
                            />
                        </div>

                        {/* Genel Arama */}
                        <div>
                            <label className="text-slate-400 text-xs block mb-1">Bayi Adı / Adres</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <Input
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    placeholder="Ara..."
                                    className="pl-10 bg-slate-900 border-slate-600 text-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Temizle Butonu */}
                    {(searchCity || searchDistrict || searchNeighborhood || searchText) && (
                        <button
                            onClick={() => {
                                setSearchCity("");
                                setSearchDistrict("");
                                setSearchNeighborhood("");
                                setSearchText("");
                            }}
                            className="mt-3 text-xs text-slate-500 hover:text-slate-300 underline"
                        >
                            Filtreleri temizle
                        </button>
                    )}
                </div>

                {/* Sonuç Sayısı */}
                <div className="flex items-center justify-between mt-4 px-1">
                    <p className="text-slate-500 text-sm">
                        {filteredDealers.length} yetkili bayi bulundu
                    </p>
                    {loading && (
                        <span className="text-xs text-emerald-500/60 animate-pulse">
                            Güncelleniyor...
                        </span>
                    )}
                </div>
            </section>

            {/* Bayi Listesi */}
            <section className="max-w-5xl mx-auto px-6 pb-20">
                {filteredDealers.length === 0 ? (
                    <div className="text-center py-20">
                        <Store className="w-16 h-16 mx-auto mb-4 text-slate-700" />
                        <h3 className="text-xl font-semibold text-slate-400 mb-2">
                            Bu bölgede bayi bulunamadı
                        </h3>
                        <p className="text-slate-500 text-sm mb-6">
                            Arama kriterlerinize uygun bayi yok veya bölgenizde henüz bayi bulunmuyor.
                        </p>
                        <a href="/toptan-teklif">
                            <Button className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2">
                                Bölgenizde Bayi Olmak İster misiniz?
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </a>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredDealers.map((dealer, i) => (
                            <motion.div
                                key={dealer.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.07 }}
                                className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 hover:border-emerald-700/40 hover:bg-slate-800/80 transition-all"
                            >
                                <div className="flex flex-col md:flex-row md:items-start gap-4">
                                    {/* Sol: İkon */}
                                    <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-700/30 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Store className="w-6 h-6 text-emerald-400" />
                                    </div>

                                    {/* Orta: Bilgiler */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start gap-3 flex-wrap">
                                            <h3 className="text-white font-bold text-lg">{dealer.ad}</h3>
                                            <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-xs">
                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                Yetkili Bayi
                                            </Badge>
                                        </div>

                                        {/* Konum */}
                                        <div className="flex items-center gap-1 text-slate-400 text-sm mt-1 mb-3">
                                            <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                                            <span>
                                                {[dealer.mahalle, dealer.ilce, dealer.sehir]
                                                    .filter(Boolean)
                                                    .join(" / ")}
                                            </span>
                                        </div>

                                        <p className="text-slate-400 text-sm mb-3">{dealer.adres}</p>

                                        {/* Projeler */}
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {dealer.projeler?.map((proje) => (
                                                <span
                                                    key={proje}
                                                    className={`text-xs px-2 py-0.5 rounded-lg border ${PROJE_RENKLERI[proje] || "bg-slate-700 text-slate-400 border-slate-600"
                                                        }`}
                                                >
                                                    {proje}
                                                </span>
                                            ))}
                                        </div>

                                        {/* İletişim */}
                                        <div className="flex flex-wrap items-center gap-4 text-sm">
                                            {dealer.telefon && (
                                                <a
                                                    href={`tel:${dealer.telefon.replace(/\s/g, "")}`}
                                                    className="flex items-center gap-1.5 text-slate-400 hover:text-emerald-400 transition-colors"
                                                >
                                                    <Phone className="w-3.5 h-3.5" />
                                                    {dealer.telefon}
                                                </a>
                                            )}
                                            {dealer.email && (
                                                <a
                                                    href={`mailto:${dealer.email}`}
                                                    className="flex items-center gap-1.5 text-slate-400 hover:text-emerald-400 transition-colors"
                                                >
                                                    <Mail className="w-3.5 h-3.5" />
                                                    {dealer.email}
                                                </a>
                                            )}
                                            {dealer.calisma_saatleri && (
                                                <span className="flex items-center gap-1.5 text-slate-500">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {dealer.calisma_saatleri}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Sağ: CTA */}
                                    <div className="flex-shrink-0">
                                        <a
                                            href={`https://www.google.com/maps/search/${encodeURIComponent(dealer.adres)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="border-emerald-700 text-emerald-400 hover:bg-emerald-900/20 gap-2 whitespace-nowrap"
                                            >
                                                <Navigation className="w-3.5 h-3.5" />
                                                Haritada Gör
                                            </Button>
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Bayi Ol CTA */}
                <div className="mt-12 bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border border-emerald-800/30 rounded-2xl p-8 text-center">
                    <h3 className="text-2xl font-bold text-white mb-3">
                        Bölgenizde Bayi Olmak İster misiniz?
                    </h3>
                    <p className="text-slate-400 mb-6">
                        Türkiye genelinde genişleyen bayi ağımıza katılın. Tüm projelerimiz
                        için tek çatı altında bayi olabilirsiniz.
                    </p>
                    <a href="/toptan-teklif">
                        <Button className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold gap-2">
                            Bayi Başvurusu Yap
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </a>
                </div>
            </section>
        </div>
    );
}

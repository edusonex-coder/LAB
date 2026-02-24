import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ShoppingCart,
    Award,
    Package,
    Zap,
    Star,
    ChevronRight,
    Filter,
    Search,
    Building2,
    Phone,
    MapPin,
    Info,
    Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

// Ürün kataloğu - mevcut görseller ile eşleştirildi
const PRODUCTS = [
    {
        id: "denge-kusu",
        name: "Denge Kuşu",
        slug: "denge-kusu",
        category: "okul-oncesi",
        categoryLabel: "Okul Öncesi (3-6 yaş)",
        mebCode: "Denge & Ağırlık Merkezi",
        description:
            "Ağırlık merkezi ve statik denge kavramını somut olarak öğreten ahşap set. Kanat uçlarındaki metal ağırlıklar sayesinde kuş, gaga ucunda dengede duruyor.",
        image: "/urunler/denge_kusu.webp",
        toptanFiyat: 95,
        whiteLabelFiyat: 145,
        minAdet: 50,
        malzeme: "3mm Kavak Kontrplak + Metal Ağırlıklar",
        stars: 5,
        isNew: false,
        isBestseller: true,
    },
    {
        id: "balonlu-araba",
        name: "Balonlu Jet Arabası",
        slug: "balonlu-araba",
        category: "okul-oncesi",
        categoryLabel: "Okul Öncesi (3-6 yaş)",
        mebCode: "Etki-Tepki Prensibi",
        description:
            "Hava basıncı ve etki-tepki prensibini öğreten sürükleyici deney seti. Balon şişirilip serbest bırakıldığında araba ileri fırlar.",
        image: "/urunler/balonlu_araba.webp",
        toptanFiyat: 75,
        whiteLabelFiyat: 120,
        minAdet: 50,
        malzeme: "3mm Kavak Kontrplak + Plastik Akslar",
        stars: 5,
        isNew: false,
        isBestseller: false,
    },
    {
        id: "periskop",
        name: "Periskop",
        slug: "periskop",
        category: "ilkokul",
        categoryLabel: "İlkokul (1-4. Sınıf)",
        mebCode: "F.4.5.1 Işığın Yansıması",
        description:
            "Işığın yansıması ve aynalar konusunu öğreten klasik deney seti. 45° açılı iki ayna ile köşeli görüş sağlanır.",
        image: "/urunler/periskop.webp",
        toptanFiyat: 95,
        whiteLabelFiyat: 145,
        minAdet: 30,
        malzeme: "3mm MDF + Pleksi Ayna",
        stars: 4,
        isNew: false,
        isBestseller: true,
    },
    {
        id: "isikli-ev",
        name: "Işıklı Ev (Elektrik Devresi)",
        slug: "isikli-ev",
        category: "ilkokul",
        categoryLabel: "İlkokul (1-4. Sınıf)",
        mebCode: "F.4.7.1 Basit Elektrik Devreleri",
        description:
            "Temel elektrik devre elemanlarını öğreten mini ev modeli. LED'ler, anahtar ve pil yatağı içerir.",
        image: "/urunler/isikli_ev.webp",
        toptanFiyat: 120,
        whiteLabelFiyat: 185,
        minAdet: 25,
        malzeme: "3mm Kavak Kontrplak + LED + Elektronik",
        stars: 5,
        isNew: true,
        isBestseller: false,
    },
    {
        id: "el-feneri",
        name: "El Feneri Seti",
        slug: "el-feneri",
        category: "ilkokul",
        categoryLabel: "İlkokul (1-4. Sınıf)",
        mebCode: "F.4.7.1 Elektrik Devreleri",
        description:
            "Seri ve paralel devre bağlantılarını öğreten el feneri yapım seti.",
        image: "/urunler/el_feneri.webp",
        toptanFiyat: 85,
        whiteLabelFiyat: 130,
        minAdet: 30,
        malzeme: "3mm Kontrplak + LED + Pil Yatağı",
        stars: 4,
        isNew: false,
        isBestseller: false,
    },
    {
        id: "esit-kollu-terazi",
        name: "Eşit Kollu Terazi",
        slug: "esit-kollu-terazi",
        category: "ortaokul",
        categoryLabel: "Ortaokul (5-8. Sınıf)",
        mebCode: "F.8.4.4 Basit Makineler",
        description:
            "Kaldıraç prensibi ve moment hesapları için mükemmel deney aracı. Hassas denge noktaları ile matematiksel doğrulama yapılabilir.",
        image: "/urunler/esit_kollu_terazi.webp",
        toptanFiyat: 185,
        whiteLabelFiyat: 285,
        minAdet: 20,
        malzeme: "4mm Kavak Kontrplak + Metal Ağırlık Seti",
        stars: 5,
        isNew: false,
        isBestseller: true,
    },
    {
        id: "hidrolik-kamyon",
        name: "Hidrolik Kamyon",
        slug: "hidrolik-kamyon",
        category: "ortaokul",
        categoryLabel: "Ortaokul (5-8. Sınıf)",
        mebCode: "F.8.3.1 Pascal Prensibi",
        description:
            "Pascal prensibini şırınga sistemiyle öğreten hidrolik kepçe/kamyon seti. Su basıncıyla çalışan gerçek bir iş makinesi modeli.",
        image: "/urunler/hidrolik_kamyon.webp",
        toptanFiyat: 245,
        whiteLabelFiyat: 380,
        minAdet: 15,
        malzeme: "4mm Kontrplak + 10ml/20ml Şırınga + Hortum",
        stars: 5,
        isNew: false,
        isBestseller: true,
    },
    {
        id: "mancnik",
        name: "Mancınık (Atapult)",
        slug: "mancinik",
        category: "ortaokul",
        categoryLabel: "Ortaokul (5-8. Sınıf)",
        mebCode: "F.8.4.1 Kaldıraç Prensipleri",
        description:
            "Kaldıraç türleri ve elastik enerji depolamayı öğreten eğlenceli deney seti. Mermer veya tahta top fırlatma yarışması yapılabilir.",
        image: "/urunler/mancinik.webp",
        toptanFiyat: 155,
        whiteLabelFiyat: 240,
        minAdet: 20,
        malzeme: "4mm Kavak Kontrplak + Lastik + Metal Aks",
        stars: 4,
        isNew: false,
        isBestseller: false,
    },
    {
        id: "ruzgar-gulu",
        name: "Rüzgar Gülü (Anemometre)",
        slug: "ruzgar-gulu",
        category: "ortaokul",
        categoryLabel: "Ortaokul (5-8. Sınıf)",
        mebCode: "F.7.4.1 Enerji Dönüşümleri",
        description:
            "Rüzgar enerjisini elektriğe çeviren gerçek çalışan türbin modeli. Üretilen elektrik ölçülebilir.",
        image: "/urunler/ruzgar_gulu.webp",
        toptanFiyat: 220,
        whiteLabelFiyat: 340,
        minAdet: 15,
        malzeme: "3mm Kontrplak + DC Motor/Dinamo",
        stars: 5,
        isNew: true,
        isBestseller: false,
    },
    {
        id: "solar-degirmen",
        name: "Solar Değirmen",
        slug: "solar-degirmen",
        category: "ortaokul",
        categoryLabel: "Ortaokul (5-8. Sınıf)",
        mebCode: "F.7.4.2 Yenilenebilir Enerji",
        description:
            "Güneş enerjisiyle çalışan ahşap değirmen modeli. Güneş paneli ile motor arasındaki enerji dönüşümünü gözlemleyin.",
        image: "/urunler/solar_degirmen.webp",
        toptanFiyat: 265,
        whiteLabelFiyat: 410,
        minAdet: 10,
        malzeme: "3mm Kontrplak + 1.5V Güneş Paneli + DC Motor",
        stars: 5,
        isNew: true,
        isBestseller: false,
    },
    {
        id: "solar-ucak",
        name: "Solar Uçak",
        slug: "solar-ucak",
        category: "ortaokul",
        categoryLabel: "Ortaokul (5-8. Sınıf)",
        mebCode: "F.7.4.2 Yenilenebilir Enerji",
        description:
            "Güneş paneli ve propeller sistemiyle çalışan uçak modeli. Aerodinamik ve güneş enerjisi konularını birleştirir.",
        image: "/urunler/solar_ucak.webp",
        toptanFiyat: 295,
        whiteLabelFiyat: 455,
        minAdet: 10,
        malzeme: "2mm Balsa + Güneş Paneli + Fırçasız Motor",
        stars: 4,
        isNew: true,
        isBestseller: false,
    },
    {
        id: "su-kuyusu",
        name: "Su Kuyusu (Vinç Sistemi)",
        slug: "su-kuyusu",
        category: "ortaokul",
        categoryLabel: "Ortaokul (5-8. Sınıf)",
        mebCode: "F.8.4.4 Basit Makineler",
        description:
            "Makara ve vida prensiplerini bir arada öğreten vinç modeli. Krank kolu ile su kovası kaldırılabilir.",
        image: "/urunler/su_kuyusu.webp",
        toptanFiyat: 165,
        whiteLabelFiyat: 255,
        minAdet: 20,
        malzeme: "4mm Kontrplak + Makara + Naylon İp",
        stars: 4,
        isNew: false,
        isBestseller: false,
    },
    {
        id: "mik-araba",
        name: "Mıknatıslı Araba",
        slug: "miknatisli-araba",
        category: "ortaokul",
        categoryLabel: "Ortaokul (5-8. Sınıf)",
        mebCode: "F.6.8.1 Manyetizma",
        description:
            "Mıknatısların çekme ve itme kuvvetlerini araç hareketi üzerinden öğreten deney seti.",
        image: "/urunler/miknatisli_araba.webp",
        toptanFiyat: 145,
        whiteLabelFiyat: 225,
        minAdet: 25,
        malzeme: "3mm Kontrplak + Neodyum Mıknatıs",
        stars: 4,
        isNew: false,
        isBestseller: false,
    },
    {
        id: "kumbara",
        name: "Para Ayırma Makinesi",
        slug: "para-ayirma",
        category: "ortaokul",
        categoryLabel: "Ortaokul (5-8. Sınıf)",
        mebCode: "Fizik & Tasarım Üretim",
        description:
            "Boyut farklılığı prensibine göre madeni paraları otomatik ayıran mekanik sınıflandırıcı.",
        image: "/urunler/para_ayirma_makinesi.webp",
        toptanFiyat: 195,
        whiteLabelFiyat: 300,
        minAdet: 15,
        malzeme: "4mm Kontrplak + Eğik Düzlem",
        stars: 5,
        isNew: false,
        isBestseller: false,
    },
    {
        id: "kumbara2",
        name: "Kumbara (Tasarruf Kutusu)",
        slug: "kumbara",
        category: "ilkokul",
        categoryLabel: "İlkokul (1-4. Sınıf)",
        mebCode: "Tasarım & Üretim",
        description:
            "Para saymayı ve tasarrufu öğreten sevimli ahşap kumbara. Çocukların kendi bitirebileceği montaj seti.",
        image: "/urunler/kumbara.webp",
        toptanFiyat: 65,
        whiteLabelFiyat: 100,
        minAdet: 50,
        malzeme: "3mm Kavak Kontrplak",
        stars: 4,
        isNew: false,
        isBestseller: false,
    },
    {
        id: "tavsan-lamba",
        name: "Tavşan Gece Lambası",
        slug: "tavsan-lamba",
        category: "ilkokul",
        categoryLabel: "İlkokul (1-4. Sınıf)",
        mebCode: "F.4.7.1 Işık & Elektrik",
        description:
            "Sevimli tavşan figürlü LED gece lambası. Elektrik devresi ve ahşap işçiliğini birleştiriyor.",
        image: "/urunler/tavsan_lamba.webp",
        toptanFiyat: 110,
        whiteLabelFiyat: 170,
        minAdet: 30,
        malzeme: "3mm Kontrplak + LED + Doğal Ahşap Boyası",
        stars: 5,
        isNew: false,
        isBestseller: true,
    },
];

const CATEGORIES = [
    { id: "hepsi", label: "Tümü", icon: "📦" },
    { id: "okul-oncesi", label: "Okul Öncesi", icon: "🐣" },
    { id: "ilkokul", label: "İlkokul", icon: "📚" },
    { id: "ortaokul", label: "Ortaokul", icon: "🔬" },
];

export default function Products() {
    const [selectedCategory, setSelectedCategory] = useState("hepsi");
    const [searchQuery, setSearchQuery] = useState("");

    const filtered = PRODUCTS.filter((p) => {
        const matchCat =
            selectedCategory === "hepsi" || p.category === selectedCategory;
        const matchSearch =
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.mebCode.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCat && matchSearch;
    });

    return (
        <div className="min-h-screen bg-[#0a0f0d]">
            {/* Hero Banner */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#0a1f14] via-[#0d2b1a] to-[#0a0f0d] border-b border-emerald-900/30">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-10 left-20 w-72 h-72 bg-emerald-500 rounded-full blur-[120px]" />
                    <div className="absolute bottom-10 right-20 w-96 h-96 bg-teal-400 rounded-full blur-[150px]" />
                </div>
                <div className="relative max-w-7xl mx-auto px-6 py-20 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Badge className="mb-4 bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-4 py-1 text-sm">
                            🇹🇷 MEB Müfredatına %100 Uyumlu · Yerel Üretim
                        </Badge>
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                            Ahşap STEM
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                                Deney Setleri
                            </span>
                        </h1>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
                            Okul öncesinden liseye, lazer kesim ahşap deney setleri. Toptan
                            ve white-label satış için fiyatlarımızı keşfedin.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/toptan-teklif">
                                <Button
                                    size="lg"
                                    className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-8 gap-2"
                                >
                                    <Package className="w-5 h-5" />
                                    Toptan & White-Label Teklif Al
                                </Button>
                            </Link>
                            <Link to="/bayi-bul">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-emerald-700 text-emerald-400 hover:bg-emerald-900/30 px-8 gap-2"
                                >
                                    <MapPin className="w-5 h-5" />
                                    Size En Yakın Bayiyi Bulun
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Satış Modeli Bilgi Kartları */}
            <section className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        {
                            icon: <Building2 className="w-8 h-8 text-emerald-400" />,
                            title: "Toptan Satış",
                            desc: "Minimum 10 adet siparişle toptan fiyatlarından yararlanın. EFT/Havale ile ödeme.",
                            highlight: "Min. 10 adet",
                        },
                        {
                            icon: <Award className="w-8 h-8 text-teal-400" />,
                            title: "White-Label",
                            desc: "Ürünleri kendi markanızla satın. Logo, renk ve ambalaj tamamen size özel.",
                            highlight: "Kendi Markanız",
                        },
                        {
                            icon: <MapPin className="w-8 h-8 text-cyan-400" />,
                            title: "Parakende Alım",
                            desc: "Bireysel alım için size en yakın yetkili bayimizi arayın veya bayileri haritada bulun.",
                            highlight: "Tüm Türkiye'de",
                        },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.15 }}
                            className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-700/50 rounded-2xl p-6 hover:border-emerald-700/50 transition-all"
                        >
                            <div className="w-14 h-14 rounded-xl bg-slate-800 flex items-center justify-center mb-4">
                                {item.icon}
                            </div>
                            <div className="text-xs font-semibold text-emerald-500 uppercase tracking-wider mb-1">
                                {item.highlight}
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                {item.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Ödeme Notu */}
                <div className="mt-6 flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                    <Info className="w-5 h-5 text-amber-400 flex-shrink-0" />
                    <p className="text-amber-300/80 text-sm">
                        <strong className="text-amber-300">Ödeme Yöntemi:</strong> Tüm
                        toptan ve white-label siparişlerde ödeme yalnızca EFT/Havale ile
                        kabul edilmektedir. Kredi kartı ödeme seçeneği bulunmamaktadır.
                    </p>
                </div>
            </section>

            {/* Filtre & Arama */}
            <section className="max-w-7xl mx-auto px-6 pb-6">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    {/* Kategori Filtreleri */}
                    <div className="flex gap-2 flex-wrap">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedCategory === cat.id
                                        ? "bg-emerald-500 text-black"
                                        : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
                                    }`}
                            >
                                {cat.icon} {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Arama */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Ürün veya MEB kodu ara..."
                            className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 w-64"
                        />
                    </div>
                </div>

                <p className="text-slate-500 text-sm mt-3">
                    {filtered.length} ürün bulundu
                </p>
            </section>

            {/* Ürün Grid */}
            <section className="max-w-7xl mx-auto px-6 pb-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filtered.map((product, i) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="group bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-emerald-600/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] transition-all duration-300"
                        >
                            {/* Görsel */}
                            <div className="relative overflow-hidden bg-slate-900 h-52">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src =
                                            "https://placehold.co/400x300/1e293b/64748b?text=Ürün+Görseli";
                                    }}
                                />
                                {/* Badges */}
                                <div className="absolute top-3 left-3 flex flex-col gap-1">
                                    {product.isNew && (
                                        <Badge className="bg-teal-500 text-white text-xs px-2 py-0.5">
                                            ✨ Yeni
                                        </Badge>
                                    )}
                                    {product.isBestseller && (
                                        <Badge className="bg-amber-500 text-black text-xs px-2 py-0.5">
                                            🔥 Çok Satan
                                        </Badge>
                                    )}
                                </div>
                                {/* Kategori */}
                                <div className="absolute bottom-3 right-3">
                                    <span className="text-xs bg-slate-900/80 text-emerald-400 border border-emerald-700/50 px-2 py-1 rounded-lg">
                                        {product.categoryLabel}
                                    </span>
                                </div>
                            </div>

                            {/* İçerik */}
                            <div className="p-5">
                                {/* MEB Kod */}
                                <div className="flex items-center gap-1 mb-2">
                                    <Tag className="w-3 h-3 text-emerald-500" />
                                    <span className="text-xs text-emerald-500/80 font-mono">
                                        {product.mebCode}
                                    </span>
                                </div>

                                <h3 className="text-white font-bold text-lg mb-2 leading-tight">
                                    {product.name}
                                </h3>
                                <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-2">
                                    {product.description}
                                </p>

                                {/* Yıldızlar */}
                                <div className="flex items-center gap-1 mb-4">
                                    {Array.from({ length: 5 }).map((_, j) => (
                                        <Star
                                            key={j}
                                            className={`w-3.5 h-3.5 ${j < product.stars
                                                    ? "text-amber-400 fill-amber-400"
                                                    : "text-slate-600"
                                                }`}
                                        />
                                    ))}
                                </div>

                                {/* Fiyatlar */}
                                <div className="bg-slate-900/60 rounded-xl p-3 mb-4 space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-slate-500">Toptan (min. {product.minAdet} adet)</span>
                                        <span className="text-emerald-400 font-bold">
                                            ₺{product.toptanFiyat}
                                            <span className="text-xs text-slate-500 font-normal">/adet</span>
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-slate-500">White-Label</span>
                                        <span className="text-teal-400 font-bold">
                                            ₺{product.whiteLabelFiyat}
                                            <span className="text-xs text-slate-500 font-normal">/adet</span>
                                        </span>
                                    </div>
                                </div>

                                {/* CTA */}
                                <Link to="/toptan-teklif">
                                    <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white gap-2 group/btn">
                                        <ShoppingCart className="w-4 h-4" />
                                        Teklif Al
                                        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Boş Durum */}
                {filtered.length === 0 && (
                    <div className="text-center py-20 text-slate-500">
                        <Filter className="w-12 h-12 mx-auto mb-4 opacity-30" />
                        <p className="text-lg">Arama kriterlerinize uygun ürün bulunamadı.</p>
                    </div>
                )}
            </section>

            {/* B2B CTA Banner */}
            <section className="bg-gradient-to-r from-emerald-900/40 via-teal-900/30 to-emerald-900/40 border-y border-emerald-800/30">
                <div className="max-w-7xl mx-auto px-6 py-16 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Phone className="w-5 h-5 text-emerald-400" />
                        <span className="text-emerald-400 font-semibold">B2B & Kurumsal</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Okul, Eğitim Kurumu veya Bayi misiniz?
                    </h2>
                    <p className="text-slate-400 max-w-xl mx-auto mb-8">
                        10+ adet siparişlerde toptan fiyatlardan yararlanın. White-label
                        paketlerle kendi markanızla satış yapın. Sadece EFT/Havale kabul
                        edilmektedir.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/toptan-teklif">
                            <Button
                                size="lg"
                                className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-8 gap-2"
                            >
                                <Zap className="w-5 h-5" />
                                Hemen Teklif İste
                            </Button>
                        </Link>
                        <Link to="/bayi-bul">
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-slate-600 text-slate-300 hover:bg-slate-800 gap-2"
                            >
                                <MapPin className="w-5 h-5" />
                                Bayi Ol
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

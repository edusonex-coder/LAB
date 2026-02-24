import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserStore } from '@/store/userStore';
import { useSetStore } from '@/store/setStore';
import { Sparkles, ArrowRight, LogIn } from 'lucide-react';
import heroImage from '@/assets/hero-image.jpg';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function Index() {
  const navigate = useNavigate();
  const { profile, user } = useAuth();
  const { sets } = useSetStore();
  const localUser = useUserStore();

  const completedSets = sets.filter(s => s.isCompleted).length;
  const totalSets = sets.length;
  const progressPercent = Math.round((completedSets / totalSets) * 100);

  // Auth'dan gelen isim yoksa localStore'dan kullan
  const displayName = profile?.full_name || localUser.name || 'Misafir';
  const displayLevel = profile?.level || localUser.level || 1;

  return (
    <div className="animate-fade-in pb-10">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-b-[2.5rem] shadow-2xl shadow-emerald-500/10" style={{ background: 'var(--gradient-hero)' }}>
        <img
          src={heroImage}
          alt="STEM Deneyleri"
          className="w-full h-56 object-cover opacity-30 mix-blend-overlay"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-2"
          >
            <h1 className="text-4xl font-black text-white font-heading tracking-tighter">
              EDUSONEX <span className="text-emerald-400 text-2xl absolute -top-1 -right-8">LAB</span>
            </h1>
            <p className="text-emerald-50/80 text-sm font-medium">
              Geleceğin Bilim İnsanları Buradan Yetişiyor
            </p>
          </motion.div>

          <button
            onClick={() => navigate('/sets')}
            className="btn-hero mt-6 group"
          >
            <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
            Keşfetmeye Başla
          </button>
        </div>
      </div>

      <div className="px-4 py-6 space-y-8">
        {/* Welcome + Progress */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all" />

          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-slate-400 font-medium mb-1">
                Merhaba, <span className="text-white font-bold">{displayName}</span>! 👋
              </p>
              <p className="text-xs text-slate-500">
                {completedSets}/{totalSets} deney seti tamamlandı • {displayLevel}. Seviye
              </p>
            </div>
            {!user && (
              <Button
                onClick={() => navigate('/login')}
                className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[10px] h-7 px-3 rounded-full border border-emerald-500/20"
              >
                Giriş Yap
              </Button>
            )}
          </div>

          <div className="progress-track h-2 bg-slate-800 rounded-full">
            <div
              className="progress-fill h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-[10px] text-right mt-2 text-slate-600 font-bold uppercase tracking-wider">
            Gelişim: %{progressPercent}
          </p>
        </div>

        {/* Quick Kits */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black font-heading text-white">Deney Setleri</h2>
            <button
              onClick={() => navigate('/sets')}
              className="text-xs font-bold text-emerald-400 flex items-center gap-1 hover:text-emerald-300 transition-colors"
            >
              TÜMÜNÜ GÖR <ArrowRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {sets.slice(0, 4).map((kit, i) => (
              <button
                key={kit.id}
                onClick={() => navigate(`/set/${kit.id}`)}
                className="bg-slate-900/30 border border-slate-800 rounded-2xl p-3 text-left hover:border-emerald-500/30 transition-all group active:scale-95"
              >
                <div className="w-full h-28 mb-3 rounded-xl overflow-hidden bg-slate-800">
                  <img
                    src={kit.image}
                    alt={kit.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="font-bold text-sm font-heading text-slate-200 line-clamp-1">{kit.title}</h3>
                <div className="mt-2 flex items-center justify-between">
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${kit.difficulty === 'Kolay' ? 'bg-emerald-500/10 text-emerald-500' :
                    kit.difficulty === 'Orta' ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'
                    }`}>
                    {kit.difficulty}
                  </span>
                  {kit.isCompleted && (
                    <span className="text-emerald-500">✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Badges Preview */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black font-heading text-white">Başarıların</h2>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-xs font-bold text-emerald-400 flex items-center gap-1 hover:text-emerald-300 transition-colors"
            >
              DETAYLAR <ArrowRight size={14} />
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {[
              { emoji: '🚀', label: 'BAŞLANGIÇ', locked: false },
              { emoji: '🔍', label: 'KAŞİF', locked: true },
              { emoji: '🔧', label: 'USTA', locked: true },
              { emoji: '💡', label: 'MUCİT', locked: true },
            ].map((badge, idx) => (
              <div
                key={idx}
                className={`flex-shrink-0 w-24 h-28 rounded-2xl border flex flex-col items-center justify-center gap-1 ${badge.locked
                  ? 'border-slate-800 bg-slate-900/10 opacity-40 grayscale'
                  : 'border-emerald-500/30 bg-emerald-500/5 shadow-xl shadow-emerald-500/5'
                  }`}
              >
                <div className="text-3xl mb-1">{badge.emoji}</div>
                <p className="text-[9px] font-black tracking-widest text-emerald-50">{badge.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

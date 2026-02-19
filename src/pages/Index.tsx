import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import { useSetStore } from '@/store/setStore';
import { Sparkles, ArrowRight } from 'lucide-react';
import heroImage from '@/assets/hero-image.jpg';

export default function Index() {
  const navigate = useNavigate();
  const { name, level, points } = useUserStore();
  const { sets } = useSetStore();

  const completedSets = sets.filter(s => s.isCompleted).length;
  const totalSets = sets.length;
  const progressPercent = Math.round((completedSets / totalSets) * 100);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-b-3xl" style={{ background: 'var(--gradient-hero)' }}>
        <img
          src={heroImage}
          alt="STEM Deneyleri"
          className="w-full h-48 object-cover opacity-30 mix-blend-overlay"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <h1 className="text-3xl font-extrabold text-primary-foreground font-heading mb-2">
            EDUSONEX
          </h1>
          <p className="text-primary-foreground/90 text-sm mb-4">
            Keşfet · Dene · Öğren
          </p>
          <button
            onClick={() => navigate('/sets')}
            className="btn-hero"
          >
            <Sparkles size={20} />
            Deneyine Başla
          </button>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Welcome + Progress */}
        <div className="card-kit p-5">
          <p className="text-sm text-muted-foreground mb-1">
            Merhaba, <span className="font-bold text-foreground">{name}</span>! 👋
          </p>
          <p className="text-xs text-muted-foreground mb-3">
            {completedSets}/{totalSets} deney seti tamamlandı • Seviye {level}
          </p>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        {/* Quick Kits */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold font-heading">Deney Setleri</h2>
            <button
              onClick={() => navigate('/sets')}
              className="text-sm font-medium text-primary flex items-center gap-1 tap-target"
            >
              Tümü <ArrowRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {sets.slice(0, 4).map((kit, i) => (
              <button
                key={kit.id}
                onClick={() => navigate(`/set/${kit.id}`)}
                className="card-kit text-left relative overflow-hidden"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="w-full h-24 mb-3 rounded-lg overflow-hidden bg-slate-100">
                  <img src={kit.image} alt={kit.title} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-sm font-heading leading-tight line-clamp-2">{kit.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{kit.category}</p>
                <div className="mt-2 flex items-center gap-2">
                  {kit.isLocked ? (
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">Kilitli</span>
                  ) : (
                    <span className={`difficulty-${kit.difficulty === 'Kolay' ? 'easy' : kit.difficulty === 'Orta' ? 'medium' : 'hard'}`}>
                      {kit.difficulty}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Badges Preview */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold font-heading">Rozetlerin</h2>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-sm font-medium text-primary flex items-center gap-1 tap-target"
            >
              Tümü <ArrowRight size={14} />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {/* TODO: Implement real badges data from store */}
            <div className="flex-shrink-0 w-20 badge-earned">
              <div className="text-2xl mb-1">🚀</div>
              <p className="text-[10px] font-bold leading-tight">Başlangıç</p>
            </div>
            <div className="flex-shrink-0 w-20 badge-locked">
              <div className="text-2xl mb-1">🔍</div>
              <p className="text-[10px] font-bold leading-tight">Kaşif</p>
            </div>
            <div className="flex-shrink-0 w-20 badge-locked">
              <div className="text-2xl mb-1">🔧</div>
              <p className="text-[10px] font-bold leading-tight">Usta</p>
            </div>
            <div className="flex-shrink-0 w-20 badge-locked">
              <div className="text-2xl mb-1">💡</div>
              <p className="text-[10px] font-bold leading-tight">Mucit</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

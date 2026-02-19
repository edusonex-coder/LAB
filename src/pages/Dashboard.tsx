import { useUser, useBadges } from '@/hooks/useQueries';
import { Award, Download } from 'lucide-react';

export default function Dashboard() {
  const { data: user } = useUser();
  const { data: badges = [] } = useBadges();

  return (
    <div className="animate-fade-in px-4 pt-6 pb-6 space-y-6">
      <h1 className="text-2xl font-extrabold font-heading">Başarılarım</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Deney', value: user?.completedSets ?? 0, emoji: '🧪' },
          { label: 'Rozet', value: user?.badges.length ?? 0, emoji: '🏅' },
          { label: 'Sınıf', value: `${user?.grade ?? '-'}.`, emoji: '📚' },
        ].map((stat) => (
          <div key={stat.label} className="card-kit text-center p-4">
            <div className="text-2xl mb-1">{stat.emoji}</div>
            <div className="text-xl font-extrabold font-heading">{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="card-kit p-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-bold font-heading">Genel İlerleme</span>
          <span className="text-muted-foreground">{user?.completedSets ?? 0}/{user?.totalSets ?? 0}</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${user ? (user.completedSets / user.totalSets) * 100 : 0}%` }} />
        </div>
      </div>

      {/* Badges */}
      <div>
        <h2 className="text-lg font-bold font-heading mb-3 flex items-center gap-2">
          <Award size={20} className="text-accent" /> Rozetler
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {badges.map((badge, i) => (
            <div
              key={badge.id}
              className={`${badge.unlocked ? 'badge-earned' : 'badge-locked'} animate-scale-in`}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="text-3xl mb-2">{badge.emoji}</div>
              <p className="font-bold text-sm">{badge.title}</p>
              <p className="text-[11px] opacity-80 mt-1">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Certificate */}
      <button className="btn-accent w-full justify-center">
        <Download size={18} />
        Sertifika İndir — Geleceğin Mühendisi
      </button>
    </div>
  );
}

import { useNavigate } from 'react-router-dom';
import { useSetStore } from '@/store/setStore';
import { Search } from 'lucide-react';
import { useState } from 'react';

const subjects = ['Tümü', 'Fizik', 'Kimya', 'Biyoloji', 'Astronomi', 'Mühendislik'];
const difficulties = ['Tümü', 'Kolay', 'Orta', 'Zor'];

export default function Sets() {
  const navigate = useNavigate();
  const { sets } = useSetStore();
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('Tümü');
  const [difficulty, setDifficulty] = useState('Tümü');

  const filtered = sets.filter((kit) => {
    if (search && !kit.title.toLowerCase().includes(search.toLowerCase())) return false;
    // Map 'Mekanik' -> 'Fizik' logic if needed, or just match direct categories
    // For now assuming categories match subjects roughly or adding logic
    // Using includes for broad match or strict if categories aligned
    if (subject !== 'Tümü' && !kit.category.includes(subject) && kit.category !== subject) {
      // Simple mapping for demo: Mekanik/Optik/Enerji -> Fizik under hood or just loose match
      if (subject === 'Fizik' && ['Mekanik', 'Optik', 'Enerji'].includes(kit.category)) return true;
      return false;
    }
    if (difficulty !== 'Tümü' && kit.difficulty !== difficulty) return false;
    return true;
  });

  return (
    <div className="animate-fade-in">
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-2xl font-extrabold font-heading mb-4">Deney Setleri</h1>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Deney ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 tap-target"
          />
        </div>

        {/* Subject filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
          {subjects.map((s) => (
            <button
              key={s}
              onClick={() => setSubject(s)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap tap-target transition-all ${subject === s
                ? 'bg-primary text-primary-foreground'
                : 'bg-card text-muted-foreground border border-border'
                }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Difficulty filter */}
        <div className="flex gap-2 mb-4">
          {difficulties.map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold tap-target transition-all ${difficulty === d
                ? 'bg-secondary text-secondary-foreground'
                : 'bg-card text-muted-foreground border border-border'
                }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 grid grid-cols-1 gap-3 pb-6">
        {filtered.map((kit, i) => (
          <button
            key={kit.id}
            onClick={() => navigate(`/set/${kit.id}`)}
            className="card-kit flex items-center gap-4 text-left animate-slide-up"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className="text-4xl flex-shrink-0">{kit.emoji}</div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold font-heading">{kit.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{kit.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`difficulty-${kit.difficulty === 'Kolay' ? 'easy' : kit.difficulty === 'Orta' ? 'medium' : 'hard'}`}>
                  {kit.difficulty}
                </span>
                <span className="text-xs text-muted-foreground">Sınıf {kit.grade}</span>
              </div>
            </div>
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-4xl mb-2">🔍</p>
            <p className="text-sm">Sonuç bulunamadı</p>
          </div>
        )}
      </div>
    </div>
  );
}

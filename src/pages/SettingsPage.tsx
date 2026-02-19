import { useUser } from '@/hooks/useQueries';
import { User, Shield, Bell, Globe, Moon, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const { data: user } = useUser();
  const [darkMode, setDarkMode] = useState(false);

  const toggleDark = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const sections = [
    {
      title: 'Profil',
      items: [
        { icon: User, label: 'İsim', value: user?.name ?? '...' },
        { icon: User, label: 'Sınıf', value: user ? `${user.grade}. Sınıf` : '...' },
      ],
    },
    {
      title: 'Gizlilik',
      items: [
        { icon: Shield, label: 'Ebeveyn Onayı', value: user?.parentConsent ? 'Onaylandı ✅' : 'Bekliyor' },
        { icon: Shield, label: 'KVKK Ayarları', value: '' },
      ],
    },
    {
      title: 'Tercihler',
      items: [
        { icon: Bell, label: 'Bildirimler', value: 'Açık' },
        { icon: Globe, label: 'Dil', value: 'Türkçe' },
      ],
    },
  ];

  return (
    <div className="animate-fade-in px-4 pt-6 pb-6 space-y-6">
      <h1 className="text-2xl font-extrabold font-heading">Ayarlar</h1>

      {/* Profile Card */}
      <div className="card-kit p-5 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl" style={{ background: 'var(--gradient-hero)' }}>
          {user?.name?.charAt(0) ?? '?'}
        </div>
        <div>
          <p className="font-bold font-heading text-lg">{user?.name ?? '...'}</p>
          <p className="text-sm text-muted-foreground">{user?.grade ?? '-'}. Sınıf · {user?.role === 'student' ? 'Öğrenci' : 'Ebeveyn'}</p>
        </div>
      </div>

      {/* Sections */}
      {sections.map((section) => (
        <div key={section.title}>
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">{section.title}</h2>
          <div className="card-kit divide-y divide-border">
            {section.items.map((item) => (
              <button key={item.label} className="flex items-center gap-3 w-full p-4 tap-target hover:bg-muted/50 transition-colors text-left">
                <item.icon size={20} className="text-muted-foreground" />
                <span className="flex-1 text-sm font-medium">{item.label}</span>
                <span className="text-sm text-muted-foreground">{item.value}</span>
                <ChevronRight size={16} className="text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Dark Mode Toggle */}
      <div className="card-kit p-4 flex items-center gap-3">
        <Moon size={20} className="text-muted-foreground" />
        <span className="flex-1 text-sm font-medium">Karanlık Mod</span>
        <button
          onClick={toggleDark}
          className={`w-12 h-7 rounded-full transition-all relative ${darkMode ? 'bg-primary' : 'bg-muted'}`}
        >
          <div
            className={`w-5 h-5 rounded-full bg-card absolute top-1 transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-1'}`}
            style={{ boxShadow: 'var(--shadow-card)' }}
          />
        </button>
      </div>

      <p className="text-center text-xs text-muted-foreground pt-4">
        EDUSONEX v1.0 · KVKK Uyumlu
      </p>
    </div>
  );
}

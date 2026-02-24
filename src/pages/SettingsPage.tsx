import { User, Shield, Bell, Globe, Moon, ChevronRight, LogOut, Mail, LogIn } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
  const { profile, signOut, user } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true); // LAB'da varsayılan dark olabilir

  const toggleDark = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Başarıyla çıkış yapıldı.');
      navigate('/login');
    } catch (error) {
      toast.error('Çıkış yapılırken bir hata oluştu.');
    }
  };

  const sections = [
    {
      title: 'Profil Bilgileri',
      items: [
        { icon: User, label: 'Ad Soyad', value: profile?.full_name ?? 'Misafir' },
        { icon: Mail, label: 'E-posta', value: user?.email ?? '-' },
        { icon: Bell, label: 'Rol', value: profile?.role === 'admin' ? 'Yönetici' : 'Öğrenci' },
      ],
    },
    {
      title: 'Güvenlik & Gizlilik',
      items: [
        { icon: Shield, label: 'KVKK Ayarları', value: 'Yönet' },
        { icon: Shield, label: 'Şifre Değiştir', value: '' },
      ],
    },
    {
      title: 'Uygulama Tercihleri',
      items: [
        { icon: Bell, label: 'Bildirimler', value: 'Açık' },
        { icon: Globe, label: 'Dil', value: 'Türkçe' },
      ],
    },
  ];

  return (
    <div className="animate-fade-in px-4 pt-6 pb-20 space-y-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-extrabold font-heading text-white">Ayarlar</h1>

      {/* Profile Card */}
      <div className="bg-slate-900/50 border border-slate-800 backdrop-blur-md rounded-2xl p-6 flex items-center gap-5 shadow-xl shadow-emerald-500/5">
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl font-bold bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20">
          {profile?.full_name?.charAt(0) ?? '?'}
        </div>
        <div>
          <p className="font-bold font-heading text-xl text-white">{profile?.full_name ?? 'Kullanıcı'}</p>
          <p className="text-sm text-slate-400">
            {profile?.role === 'admin' ? 'Yönetici' : 'Öğrenci'} · {profile?.level ? `${profile.level}. Seviye` : 'Yeni Kaşif'}
          </p>
        </div>
      </div>

      {/* Sections */}
      {sections.map((section) => (
        <div key={section.title} className="space-y-3">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-2">{section.title}</h2>
          <div className="bg-slate-900/30 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800/50">
            {section.items.map((item) => (
              <button
                key={item.label}
                className="flex items-center gap-4 w-full p-4 hover:bg-slate-800/50 transition-colors text-left"
              >
                <item.icon size={20} className="text-emerald-500/70" />
                <span className="flex-1 text-sm font-medium text-slate-200">{item.label}</span>
                <span className="text-sm text-slate-500">{item.value}</span>
                <ChevronRight size={16} className="text-slate-600" />
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Dark Mode Toggle */}
      <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
        <Moon size={20} className="text-emerald-500/70" />
        <span className="flex-1 text-sm font-medium text-slate-200">Karanlık Mod</span>
        <button
          onClick={toggleDark}
          className={`w-12 h-7 rounded-full transition-all relative ${darkMode ? 'bg-emerald-500' : 'bg-slate-700'}`}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white absolute top-1 transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-1'}`}
          />
        </button>
      </div>

      {/* Logout Button */}
      {user && (
        <Button
          onClick={handleSignOut}
          variant="outline"
          className="w-full border-red-500/20 bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 py-6 rounded-2xl gap-2 font-bold"
        >
          <LogOut size={18} />
          Oturumu Kapat
        </Button>
      )}

      {!user && (
        <Button
          onClick={() => (window.location.href = '/login')}
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-6 rounded-2xl gap-2"
        >
          <LogIn size={18} />
          Hemen Giriş Yap
        </Button>
      )}

      <div className="text-center space-y-2 pt-4">
        <p className="text-xs text-slate-600">
          EDUSONEX LAB v1.2 · KVKK Uyumlu
        </p>
        <p className="text-[10px] text-slate-700">
          odevgpt ile ortak veritabanı kullanılmaktadır.
        </p>
      </div>
    </div>
  );
}

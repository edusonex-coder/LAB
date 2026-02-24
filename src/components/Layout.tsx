import { useLocation, useNavigate } from 'react-router-dom';
import { Home, FlaskConical, Trophy, MessageCircle, Settings, Package, MapPin, ShoppingBag, LogIn, UserCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const studentNavItems = [
  { path: '/', icon: Home, label: 'Ana Sayfa' },
  { path: '/sets', icon: FlaskConical, label: 'Deneyler' },
  { path: '/dashboard', icon: Trophy, label: 'Başarılar' },
  { path: '/assistant', icon: MessageCircle, label: 'Asistan' },
  { path: '/settings', icon: Settings, label: 'Ayarlar' },
];

const b2bNavItems = [
  { path: '/urunler', icon: Package, label: 'Ürünler' },
  { path: '/toptan-teklif', icon: ShoppingBag, label: 'Toptan' },
  { path: '/bayi-bul', icon: MapPin, label: 'Bayi Bul' },
];

// B2B sayfaları — bunlarda alt menü yerine üst header göster
const B2B_PATHS = ['/urunler', '/toptan-teklif', '/bayi-bul'];
const AUTH_PATHS = ['/login', '/register'];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const isB2B = B2B_PATHS.some(p => location.pathname.startsWith(p));
  const isAuth = AUTH_PATHS.some(p => location.pathname.startsWith(p));

  // Auth sayfalarında layout'u gizle (full screen auth)
  if (isAuth) return <>{children}</>;

  return (
    <div className={`min-h-screen ${isB2B ? '' : 'pb-20'} bg-background`}>
      {/* B2B Sayfaları için Üst Header */}
      {isB2B && (
        <header className="sticky top-0 z-50 bg-[#0a0f0d]/95 backdrop-blur-md border-b border-emerald-900/30">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            {/* Logo */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <FlaskConical size={16} className="text-white" />
              </div>
              <span className="font-bold text-white text-lg">EDUSONEX</span>
              <span className="text-slate-500 text-sm hidden sm:block">· LAB</span>
            </button>

            {/* B2B Nav */}
            <nav className="flex items-center gap-1">
              {b2bNavItems.map(item => {
                const active = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${active
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                  >
                    <item.icon size={16} />
                    <span className="hidden sm:block">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Auth/User Toggle */}
            <div className="flex items-center gap-4">
              {user ? (
                <button
                  onClick={() => navigate('/settings')}
                  className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full hover:bg-emerald-500/20 transition-all border-emerald-400/50"
                >
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-[10px] text-black font-bold">
                    {profile?.full_name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-xs text-emerald-100 hidden lg:block max-w-[100px] truncate">
                    {profile?.full_name || 'Kullanıcı'}
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-1.5 rounded-full text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
                >
                  <LogIn size={14} />
                  Giriş Yap
                </button>
              )}

              <button
                onClick={() => navigate('/')}
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors hidden md:block"
              >
                ← Öğrenci Modu
              </button>
            </div>
          </div>
        </header>
      )}

      <main>{children}</main>

      {/* Öğrenci Sayfaları için Alt Navigasyon */}
      {!isB2B && (
        <nav className="nav-bottom">
          {studentNavItems.map((item) => {
            const active =
              location.pathname === item.path ||
              (item.path === '/sets' && location.pathname.startsWith('/set/'));
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`nav-item ${active ? 'active' : ''}`}
              >
                <item.icon size={22} />
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Giriş durumu kontrolü - Eğer giriş yapmamışsa Giriş butonu göster, yapmışsa Ürünleri göster */}
          {!user ? (
            <button
              onClick={() => navigate('/login')}
              className="nav-item text-emerald-400"
            >
              <UserCircle size={22} />
              <span>Giriş Yap</span>
            </button>
          ) : (
            <button
              onClick={() => navigate('/urunler')}
              className="nav-item"
            >
              <Package size={22} />
              <span>Ürünler</span>
            </button>
          )}
        </nav>
      )}
    </div>
  );
}

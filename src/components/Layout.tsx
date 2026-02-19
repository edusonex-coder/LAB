import { useLocation, useNavigate } from 'react-router-dom';
import { Home, FlaskConical, Trophy, MessageCircle, Settings } from 'lucide-react';

const navItems = [
  { path: '/', icon: Home, label: 'Ana Sayfa' },
  { path: '/sets', icon: FlaskConical, label: 'Deneyler' },
  { path: '/dashboard', icon: Trophy, label: 'Başarılar' },
  { path: '/assistant', icon: MessageCircle, label: 'Asistan' },
  { path: '/settings', icon: Settings, label: 'Ayarlar' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-20 bg-background">
      <main>{children}</main>
      <nav className="nav-bottom">
        {navItems.map((item) => {
          const active = location.pathname === item.path || 
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
      </nav>
    </div>
  );
}

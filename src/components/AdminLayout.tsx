import { Navigate, Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
    BarChart3,
    Users,
    Settings,
    ShieldCheck,
    ArrowLeft,
    LogOut,
    Building2,
    Package,
    CheckSquare
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminLayout() {
    const { profile, isAdmin, isSuperAdmin, loading, signOut } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    if (loading) return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
        </div>
    );

    // Admin değilse ana sayfaya at
    if (!isAdmin) return <Navigate to="/" />;

    const navItems = [
        {
            label: 'Genel Bakış',
            path: '/admin',
            icon: BarChart3,
            show: true
        },
        {
            label: 'Kullanıcı Yönetimi',
            path: '/admin/users',
            icon: Users,
            show: true
        },
        {
            label: 'Toptan Talepler',
            path: '/admin/wholesale',
            icon: Package,
            show: isSuperAdmin // Sadece holding admin görsün
        },
        {
            label: 'Okul Ayarları',
            path: '/admin/tenant',
            icon: Building2,
            show: !isSuperAdmin && profile?.tenant_id // Okul admini sadece kendi okulunu görsün
        },
        {
            label: 'Sistem Onayları',
            path: '/admin/approvals',
            icon: CheckSquare,
            show: isSuperAdmin
        },
        {
            label: 'Genel Ayarlar',
            path: '/admin/settings',
            icon: Settings,
            show: true
        },
    ];

    return (
        <div className="min-h-screen bg-slate-950 flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-slate-800 flex flex-col pt-6 fixed inset-y-0">
                <div className="px-6 mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${isSuperAdmin ? 'bg-indigo-500' : 'bg-emerald-500'}`}>
                            <ShieldCheck className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-white text-sm">EDUSONEX</span>
                            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                                {isSuperAdmin ? 'Holding Admin' : 'Okul Admin'}
                            </span>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    {navItems.filter(item => item.show).map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                                    }`}
                            >
                                <item.icon className="w-4 h-4" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-900 mt-auto">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/5 transition-all w-full"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Sisteme Dön
                    </button>
                    <button
                        onClick={signOut}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-all w-full"
                    >
                        <LogOut className="w-4 h-4" />
                        Güvenli Çıkış
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 flex-1 p-8">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-white">
                                {navItems.find(i => i.path === location.pathname)?.label || 'Yönetim'}
                            </h2>
                            {profile?.tenant_id && !isSuperAdmin && (
                                <p className="text-slate-500 text-sm mt-1">Okulbazlı yetkilendirme aktif</p>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-sm font-bold text-white leading-none">{profile?.full_name}</p>
                                <p className="text-xs text-slate-500 mt-1">{profile?.role}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-emerald-500">
                                {profile?.full_name?.charAt(0)}
                            </div>
                        </div>
                    </div>
                    <Outlet />
                </motion.div>
            </main>
        </div>
    );
}

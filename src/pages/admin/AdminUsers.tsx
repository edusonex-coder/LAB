import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import {
    Users,
    Search,
    Filter,
    MoreVertical,
    UserPlus,
    Mail,
    Shield,
    School,
    Loader2,
    Trash2,
    Edit2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface Profile {
    id: string;
    full_name: string | null;
    email?: string;
    role: string;
    tenant_id: string | null;
    is_super_admin: boolean;
    xp: number;
    level: number;
}

export default function AdminUsers() {
    const { isSuperAdmin, profile: adminProfile } = useAuth();
    const [users, setUsers] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    useEffect(() => {
        fetchUsers();
    }, [adminProfile?.tenant_id, isSuperAdmin]);

    async function fetchUsers() {
        setLoading(true);
        try {
            let query = supabase.from('profiles').select('*');

            // Okul admini ise sadece kendi okulundakileri görsün
            if (!isSuperAdmin && adminProfile?.tenant_id) {
                query = query.eq('tenant_id', adminProfile.tenant_id);
            }

            const { data, error } = await query.order('full_name', { ascending: true });

            if (error) throw error;
            setUsers(data as Profile[]);
        } catch (error: any) {
            toast.error('Kullanıcılar yüklenirken hata oluştu: ' + error.message);
        } finally {
            setLoading(false);
        }
    }

    const filteredUsers = users.filter(user => {
        const matchesSearch = (user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Kullanıcı Yönetimi</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        {isSuperAdmin ? 'Tüm sistem kullanıcılarını yönetin' : 'Okulunuzdaki kullanıcıları yönetin'}
                    </p>
                </div>
                <Button className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold gap-2">
                    <UserPlus className="w-4 h-4" />
                    Yeni Kullanıcı Ekle
                </Button>
            </div>

            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
                <CardHeader className="border-b border-slate-800">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <Input
                                placeholder="İsim ile ara..."
                                className="bg-slate-950/50 border-slate-800 pl-10 text-white"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-slate-500" />
                            <select
                                className="bg-slate-950/50 border-slate-800 text-slate-300 text-sm rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-emerald-500/50"
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                            >
                                <option value="all">Tüm Roller</option>
                                <option value="student">Öğrenciler</option>
                                <option value="teacher">Öğretmenler</option>
                                <option value="admin">Adminler</option>
                            </select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3">
                            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                            <p className="text-slate-500 text-sm">Veriler çekiliyor...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="text-xs text-slate-500 uppercase tracking-wider border-b border-slate-800 bg-slate-900/20">
                                    <tr>
                                        <th className="px-6 py-4 font-bold">Kullanıcı</th>
                                        <th className="px-6 py-4 font-bold">Rol</th>
                                        <th className="px-6 py-4 font-bold">Okul ID / Kurum</th>
                                        <th className="px-6 py-4 font-bold text-right">İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/50">
                                    {filteredUsers.length > 0 ? (
                                        filteredUsers.map((user) => (
                                            <tr key={user.id} className="hover:bg-slate-800/20 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300 border border-slate-700">
                                                            {user.full_name?.charAt(0) || 'U'}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                                                                {user.full_name || 'İsimsiz Kullanıcı'}
                                                            </span>
                                                            {user.is_super_admin && (
                                                                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-tighter">Süper Admin</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase ${user.role === 'admin' ? 'bg-red-500/10 text-red-400' :
                                                            user.role === 'teacher' ? 'bg-blue-500/10 text-blue-400' : 'bg-emerald-500/10 text-emerald-400'
                                                        }`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                                        <School className="w-3 h-3" />
                                                        {user.tenant_id || (user.is_super_admin ? 'Genel / Holding' : 'Bireysel')}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0 text-slate-500 hover:text-white">
                                                                <MoreVertical className="w-4 h-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-slate-200">
                                                            <DropdownMenuItem className="gap-2 focus:bg-slate-800 focus:text-white cursor-pointer">
                                                                <Edit2 className="w-3.5 h-3.5" /> Düzenle
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="gap-2 text-red-400 focus:bg-red-500/10 focus:text-red-400 cursor-pointer">
                                                                <Trash2 className="w-3.5 h-3.5" /> Sil
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-20 text-center">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Users className="w-10 h-10 text-slate-800" />
                                                    <p className="text-slate-500 text-sm">Aradığınız kriterlere uygun kullanıcı bulunamadı.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

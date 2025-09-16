'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useToast } from '../../layout';

// Icons
import { Users, PlusCircle, LoaderCircle, Edit, Trash2, CheckCircle, XCircle, Search, Calendar, Shield } from 'lucide-react';

// --- Interfaces ---
interface User {
    id: number;
    name: string;
    email: string;
    mobile?: string;
    role?: string;
    is_active: number;
    orders_count?: number;
    orders_sum_total?: number;
    created_at: string;
    roles: { name: string }[];
}

// --- API Helper ---
const api = {
    getUsers: async (token: string) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
        });
        if (!response.ok) throw new Error('فشل في جلب المستخدمين.');
        const data = await response.json();
        return data.data || [];
    },
    deleteUser: async (id: number, token: string) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
        });
        if (!response.ok) {
             const data = await response.json();
             throw new Error(data.message || 'فشل في حذف المستخدم.');
        }
        return response.json();
    },
    toggleUserActive: async (id: number, token: string) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}/toggle-active`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
        });
        if (!response.ok) {
             const data = await response.json();
             throw new Error(data.message || 'فشل في تغيير حالة المستخدم.');
        }
        return response.json();
    }
};

// --- Confirmation Modal for Deletion ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm, loading }: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean;
}) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" dir="rtl">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                    <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mt-4">هل أنت متأكد؟</h3>
                <p className="text-sm text-gray-500 mt-2">لا يمكن التراجع عن هذا الإجراء. سيتم حذف هذا المستخدم نهائياً.</p>
                <div className="mt-6 flex justify-center gap-3">
                    <button onClick={onClose} type="button" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg">إلغاء</button>
                    <button onClick={onConfirm} disabled={loading} type="button" className="px-4 py-2 bg-red-600 text-white rounded-lg disabled:opacity-50">
                        {loading ? <LoaderCircle className="animate-spin" /> : "نعم، قم بالحذف"}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- User Table Row Component ---
const UserTableRow = ({ user, onEdit, onDelete, onToggleActive }: {
    user: User;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    onToggleActive: (id: number) => void;
}) => {
    const isActive = user.is_active === 1;
    const roleText = user.roles && user.roles.length > 0 ? user.roles[0].name : 'مستخدم';
    const roleColorClass = roleText === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';
    const createdDate = new Date(user.created_at).toLocaleDateString('ar-SA');

    return (
        <tr className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                            <span className="text-white font-medium text-sm">{user.name.charAt(0)}</span>
                        </div>
                    </div>
                    <div className="mr-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">ID: {user.id}</div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{user.email}</div>
                {user.mobile && <div className="text-sm text-gray-500">{user.mobile}</div>}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColorClass}`}>
                    <Shield size={12} className="ml-1" />
                    {roleText === 'admin' ? 'مدير' : 'عميل'}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                    {isActive ? 'نشط' : 'غير نشط'}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div className="flex items-center">
                    <Calendar size={16} className="ml-2 text-gray-400" />
                    {user.orders_count || 0} طلب
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {createdDate}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onToggleActive(user.id)}
                        className={`p-2 rounded-lg transition-colors ${
                            isActive 
                                ? 'hover:bg-red-100 text-red-600 hover:text-red-700' 
                                : 'hover:bg-green-100 text-green-600 hover:text-green-700'
                        }`}
                        title={isActive ? 'إلغاء التفعيل' : 'تفعيل'}
                    >
                        {isActive ? <XCircle size={18} /> : <CheckCircle size={18} />}
                    </button>
                    <button
                        onClick={() => onEdit(user.id)}
                        className="p-2 text-blue-600 hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors"
                        title="تعديل"
                    >
                        <Edit size={18} />
                    </button>
                    <button
                        onClick={() => onDelete(user.id)}
                        className="p-2 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-lg transition-colors"
                        title="حذف"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </td>
        </tr>
    );
};


// --- Main Users Page Component ---
const UsersPage = ({ initialUsers, token }: {
    initialUsers: User[];
    token: string;
}) => {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingUserId, setDeletingUserId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedRole, setSelectedRole] = useState('all');
    const { showToast } = useToast();

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                user.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = selectedStatus === 'all' || 
                                (selectedStatus === 'active' ? user.is_active === 1 : user.is_active === 0);
            const userRole = user.roles && user.roles.length > 0 ? user.roles[0].name : 'customer';
            const matchesRole = selectedRole === 'all' || userRole === selectedRole;
            return matchesSearch && matchesStatus && matchesRole;
        });
    }, [users, searchTerm, selectedStatus, selectedRole]);

    const stats = useMemo(() => ({
        total: users.length,
        active: users.filter(u => u.is_active === 1).length,
        inactive: users.filter(u => u.is_active === 0).length,
        totalOrders: users.reduce((sum, u) => sum + (u.orders_count || 0), 0)
    }), [users]);
    
    const refreshUsers = async () => {
        try {
            const updatedUsers = await api.getUsers(token);
            setUsers(updatedUsers);
        } catch {
            showToast('فشل في تحديث قائمة المستخدمين.', 'error');
        }
    };

    const handleDelete = (id: number) => { setDeletingUserId(id); setIsDeleteModalOpen(true); };

    const handleToggleActive = async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            await api.toggleUserActive(id, token);
            await refreshUsers();
            showToast('تم تغيير حالة المستخدم بنجاح', 'success');
        } catch (err: unknown) {
            showToast(err instanceof Error ? err.message : 'حدث خطأ غير متوقع', 'error');
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = async () => {
        if (!deletingUserId) return;
        setLoading(true);
        setError(null);
        try {
            await api.deleteUser(deletingUserId, token);
            await refreshUsers();
            setIsDeleteModalOpen(false);
            showToast('تم حذف المستخدم بنجاح', 'success');
        } catch (err: unknown) {
            showToast(err instanceof Error ? err.message : 'حدث خطأ غير متوقع', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8" dir="rtl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">إدارة المستخدمين</h1>
                    <p className="text-md text-gray-600 mt-1">إدارة وتنظيم حسابات المستخدمين.</p>
                </div>
                <div>
                    <a href="/admin/users/add" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors">
                        <PlusCircle size={20} /><span>إضافة مستخدم</span>
                    </a>
                </div>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100"><div className="flex items-center gap-4"><div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600"><Users size={24}/></div><div><p className="text-sm font-medium text-gray-500">إجمالي المستخدمين</p><p className="text-2xl font-bold text-gray-900">{stats.total}</p></div></div></div>
                <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100"><div className="flex items-center gap-4"><div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600"><CheckCircle size={24}/></div><div><p className="text-sm font-medium text-gray-500">النشطين</p><p className="text-2xl font-bold text-gray-900">{stats.active}</p></div></div></div>
                <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100"><div className="flex items-center gap-4"><div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-600"><XCircle size={24}/></div><div><p className="text-sm font-medium text-gray-500">غير النشطين</p><p className="text-2xl font-bold text-gray-900">{stats.inactive}</p></div></div></div>
                <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100"><div className="flex items-center gap-4"><div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600"><Calendar size={24}/></div><div><p className="text-sm font-medium text-gray-500">إجمالي الطلبات</p><p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p></div></div></div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"><Search className="h-5 w-5 text-gray-400" /></div>
                        <input type="text" placeholder="ابحث عن مستخدم..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                    <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="w-full py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="all">جميع الحالات</option>
                        <option value="active">نشط</option>
                        <option value="inactive">غير نشط</option>
                    </select>
                    <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} className="w-full py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="all">جميع الأدوار</option>
                        <option value="admin">مدير</option>
                        <option value="customer">عميل</option>
                    </select>
                </div>
            </div>
            
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">{error}</div>}
            
            {/* Users Table */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                {/* Table Info Bar */}
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-700">
                                عرض <span className="font-medium">{filteredUsers.length}</span> من أصل <span className="font-medium">{users.length}</span> مستخدم
                            </span>
                        </div>
                        <div className="text-sm text-gray-500">
                            {filteredUsers.length > 0 && `${Math.round((filteredUsers.length / users.length) * 100)}% من النتائج`}
                        </div>
                    </div>
                </div>
                
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    المستخدم
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    معلومات التواصل
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    الدور
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    الحالة
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    الطلبات
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    تاريخ التسجيل
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    الإجراءات
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.map((user) => (
                                <UserTableRow 
                                    key={user.id} 
                                    user={user} 
                                    onEdit={() => {}} 
                                    onDelete={handleDelete} 
                                    onToggleActive={handleToggleActive} 
                                />
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                        <div key={user.id} className="p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-start space-x-3 space-x-reverse">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">{user.name.charAt(0)}</span>
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {user.is_active ? 'نشط' : 'غير نشط'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-1">{user.email}</p>
                                    <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                                        <span>الدور: {user.role}</span>
                                        <span>الطلبات: {user.orders_count || 0}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleToggleActive(user.id)}
                                            className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${user.is_active 
                                                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                                            }`}
                                        >
                                            {user.is_active ? 'إلغاء التفعيل' : 'تفعيل'}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition-colors"
                                        >
                                            حذف
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {filteredUsers.length === 0 && !loading && (
                 <div className="text-center bg-white p-12 rounded-2xl shadow-md">
                     <p className="text-gray-500">لا توجد مستخدمين تطابق بحثك.</p>
                 </div>
            )}

            <ConfirmationModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={confirmDelete} loading={loading} />
        </div>
    );
}

// --- Data Fetching Wrapper ---
export default function UsersPageLoader() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const apiToken = localStorage.getItem('api_token');
        setToken(apiToken);
        if (!apiToken) {
            window.location.href = '/login';
            return;
        }
        api.getUsers(apiToken).then(setUsers).catch((err: Error) => setError(err.message)).finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-96"><LoaderCircle className="animate-spin text-blue-600" size={48} /></div>;
    }
    if (error) {
        return <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg">خطأ: {error}</div>;
    }
    return <UsersPage initialUsers={users} token={token!} />;
}


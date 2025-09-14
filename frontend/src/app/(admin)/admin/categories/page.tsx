'use client';

import React, { useState, useEffect, useMemo } from 'react';

// Icons
import { List, PlusCircle, LoaderCircle, Edit, Trash2, X, CheckCircle, XCircle, Package, Search, Image as ImageIcon } from 'lucide-react';

// --- Interfaces ---
interface Category {
    id: number;
    name: string;
    description: string;
    image: string;
    products_count: number;
    status: 'active' | 'inactive';
}

// --- API Helper ---
const api = {
    getCategories: async (token: string) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
        });
        if (!response.ok) throw new Error('فشل في جلب التصنيفات.');
        const data = await response.json();
        return data.data || [];
    },
    deleteCategory: async (id: number, token: string) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
        });
        if (!response.ok) {
             const data = await response.json();
             throw new Error(data.message || 'فشل في حذف التصنيف.');
        }
        return response.json();
    }
};

// --- Confirmation Modal for Deletion ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm, loading }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" dir="rtl">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                    <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mt-4">هل أنت متأكد؟</h3>
                <p className="text-sm text-gray-500 mt-2">لا يمكن التراجع عن هذا الإجراء. سيتم حذف هذا التصنيف نهائياً.</p>
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

// --- Category Card Component ---
const CategoryCard = ({ category, onEdit, onDelete }) => {
    const statusColor = category.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
    const statusText = category.status === 'active' ? 'نشط' : 'غير نشط';

    return (
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
            <div className="h-40 bg-gray-100 flex items-center justify-center">
                {category.image ? (
                     <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                ) : (
                    <ImageIcon className="w-12 h-12 text-gray-300" />
                )}
            </div>
            <div className="p-4 flex-grow flex flex-col">
                <span className={`self-start inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>{statusText}</span>
                <h3 className="text-lg font-bold text-gray-900 mt-2">{category.name}</h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2 flex-grow">{category.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500 mt-4 pt-3 border-t">
                    <span className="flex items-center gap-1.5"><Package size={16}/>{category.products_count} منتج</span>
                    <div className="flex items-center gap-2">
                        <a href={`/admin/categories/edit/${category.id}`} className="p-1.5 hover:bg-green-100 hover:text-green-700 rounded-md"><Edit size={18} /></a>
                        <button onClick={() => onDelete(category.id)} className="p-1.5 hover:bg-red-100 hover:text-red-700 rounded-md"><Trash2 size={18} /></button>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- Main Categories Page Component ---
const CategoriesPage = ({ initialCategories, token }) => {
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingCategoryId, setDeletingCategoryId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');

    const filteredCategories = useMemo(() => {
        return categories.filter(category => {
            const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = selectedStatus === 'all' || category.status === selectedStatus;
            return matchesSearch && matchesStatus;
        });
    }, [categories, searchTerm, selectedStatus]);

    const stats = useMemo(() => ({
        total: categories.length,
        active: categories.filter(c => c.status === 'active').length,
        inactive: categories.filter(c => c.status === 'inactive').length,
        totalProducts: categories.reduce((sum, c) => sum + c.products_count, 0)
    }), [categories]);
    
    const refreshCategories = async () => {
        try {
            const updatedCategories = await api.getCategories(token);
            setCategories(updatedCategories);
        } catch (err) {
            setError('فشل في تحديث قائمة التصنيفات.');
        }
    };

    const handleDelete = (id: number) => { setDeletingCategoryId(id); setIsDeleteModalOpen(true); };

    const confirmDelete = async () => {
        if (!deletingCategoryId) return;
        setLoading(true);
        setError(null);
        try {
            await api.deleteCategory(deletingCategoryId, token);
            await refreshCategories();
            setIsDeleteModalOpen(false);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8" dir="rtl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">إدارة التصنيفات</h1>
                    <p className="text-md text-gray-600 mt-1">إضافة وتنظيم تصنيفات منتجاتك.</p>
                </div>
                <div>
                    <a href="/admin/categories/add" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors">
                        <PlusCircle size={20} /><span>إضافة تصنيف</span>
                    </a>
                </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100"><div className="flex items-center gap-4"><div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600"><List size={24}/></div><div><p className="text-sm font-medium text-gray-500">إجمالي التصنيفات</p><p className="text-2xl font-bold text-gray-900">{stats.total}</p></div></div></div>
                <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100"><div className="flex items-center gap-4"><div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600"><CheckCircle size={24}/></div><div><p className="text-sm font-medium text-gray-500">النشطة</p><p className="text-2xl font-bold text-gray-900">{stats.active}</p></div></div></div>
                <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100"><div className="flex items-center gap-4"><div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-600"><XCircle size={24}/></div><div><p className="text-sm font-medium text-gray-500">غير النشطة</p><p className="text-2xl font-bold text-gray-900">{stats.inactive}</p></div></div></div>
                <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100"><div className="flex items-center gap-4"><div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600"><Package size={24}/></div><div><p className="text-sm font-medium text-gray-500">إجمالي المنتجات</p><p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p></div></div></div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative md:col-span-1">
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"><Search className="h-5 w-5 text-gray-400" /></div>
                        <input type="text" placeholder="ابحث عن تصنيف..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                    <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="w-full py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="all">جميع الحالات</option>
                        <option value="active">نشط</option>
                        <option value="inactive">غير نشط</option>
                    </select>
                </div>
            </div>
            
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">{error}</div>}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                 {filteredCategories.map((category) => (
                    <CategoryCard key={category.id} category={category} onEdit={() => {}} onDelete={handleDelete} />
                ))}
            </div>

            {filteredCategories.length === 0 && !loading && (
                 <div className="text-center bg-white p-12 rounded-2xl shadow-md">
                     <p className="text-gray-500">لا توجد تصنيفات تطابق بحثك.</p>
                 </div>
            )}

            <ConfirmationModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={confirmDelete} loading={loading} />
        </div>
    );
}

// --- Data Fetching Wrapper ---
export default function CategoriesPageLoader() {
    const [categories, setCategories] = useState<Category[]>([]);
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
        api.getCategories(apiToken).then(setCategories).catch(err => setError(err.message)).finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-96"><LoaderCircle className="animate-spin text-blue-600" size={48} /></div>;
    }
    if (error) {
        return <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg">خطأ: {error}</div>;
    }
    return <CategoriesPage initialCategories={categories} token={token} />;
}


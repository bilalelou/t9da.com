'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useToast } from '../../layout';

// Icons
import { Tag, PlusCircle, LoaderCircle, Edit, Trash2, CheckCircle, XCircle, Search, Package } from 'lucide-react';

// --- Interfaces ---
interface Brand {
    id: number;
    name: string;
    slug: string;
    logo: string;
    products_count: number;
    created_at: string;
}

// --- API Helper ---
const api = {
    getBrands: async (token: string) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/brands`, {
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
        });
        if (!response.ok) throw new Error('فشل في جلب الماركات.');
        const data = await response.json();
        return data.data || [];
    },
    deleteBrand: async (id: number, token: string) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/brands/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
        });
        if (!response.ok) {
             const data = await response.json();
             throw new Error(data.message || 'فشل في حذف الماركة.');
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
                <p className="text-sm text-gray-500 mt-2">لا يمكن التراجع عن هذا الإجراء. سيتم حذف هذه الماركة نهائياً.</p>
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

// --- Brand Table Row Component ---
const BrandTableRow = ({ brand, onEdit, onDelete }: {
    brand: Brand;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}) => {
    const createdDate = new Date(brand.created_at).toLocaleDateString('ar-SA');

    return (
        <tr className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-16 w-16">
                        {brand.logo ? (
                            <Image 
                                src={brand.logo} 
                                alt={brand.name}
                                width={64}
                                height={64}
                                className="h-16 w-16 rounded-lg object-cover border border-gray-200" 
                            />
                        ) : (
                            <div className="h-16 w-16 rounded-lg bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                                <span className="text-white font-bold text-lg">{brand.name.charAt(0)}</span>
                            </div>
                        )}
                    </div>
                    <div className="mr-4">
                        <div className="text-sm font-medium text-gray-900">{brand.name}</div>
                        <div className="text-sm text-gray-500">{brand.slug}</div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <Package size={16} className="ml-2 text-gray-400" />
                    <span className="text-sm text-gray-900">{brand.products_count || 0} منتج</span>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {createdDate}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onEdit(brand.id)}
                        className="p-2 text-blue-600 hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors"
                        title="تعديل"
                    >
                        <Edit size={18} />
                    </button>
                    <button
                        onClick={() => onDelete(brand.id)}
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


// --- Main Brands Page Component ---
const BrandsPage = ({ initialBrands, token }: {
    initialBrands: Brand[];
    token: string;
}) => {
    const [brands, setBrands] = useState<Brand[]>(initialBrands);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingBrandId, setDeletingBrandId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { showToast } = useToast();

    const filteredBrands = useMemo(() => {
        return brands.filter(brand => {
            const matchesSearch = brand.name.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesSearch;
        });
    }, [brands, searchTerm]);

    const stats = useMemo(() => ({
        total: brands.length,
        totalProducts: brands.reduce((sum, b) => sum + (b.products_count || 0), 0)
    }), [brands]);
    
    const refreshBrands = async () => {
        try {
            const updatedBrands = await api.getBrands(token);
            setBrands(updatedBrands);
        } catch {
            showToast('فشل في تحديث قائمة الماركات.', 'error');
        }
    };

    const handleEdit = (id: number) => {
        window.location.href = `/admin/brands/edit/${id}`;
    };

    const handleDelete = (id: number) => { setDeletingBrandId(id); setIsDeleteModalOpen(true); };

    const confirmDelete = async () => {
        if (!deletingBrandId) return;
        setLoading(true);
        setError(null);
        try {
            await api.deleteBrand(deletingBrandId, token);
            await refreshBrands();
            setIsDeleteModalOpen(false);
            showToast('تم حذف الماركة بنجاح', 'success');
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
                    <h1 className="text-3xl font-bold text-gray-900">إدارة الماركات</h1>
                    <p className="text-md text-gray-600 mt-1">إدارة وتنظيم الماركات التجارية.</p>
                </div>
                <div>
                    <a href="/admin/brands/add" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors">
                        <PlusCircle size={20} /><span>إضافة ماركة</span>
                    </a>
                </div>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100"><div className="flex items-center gap-4"><div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600"><Tag size={24}/></div><div><p className="text-sm font-medium text-gray-500">إجمالي الماركات</p><p className="text-2xl font-bold text-gray-900">{stats.total}</p></div></div></div>
                <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100"><div className="flex items-center gap-4"><div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600"><CheckCircle size={24}/></div><div><p className="text-sm font-medium text-gray-500">الماركات النشطة</p><p className="text-2xl font-bold text-gray-900">{stats.total}</p></div></div></div>
                <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100"><div className="flex items-center gap-4"><div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600"><Package size={24}/></div><div><p className="text-sm font-medium text-gray-500">إجمالي المنتجات</p><p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p></div></div></div>
                <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100"><div className="flex items-center gap-4"><div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600"><XCircle size={24}/></div><div><p className="text-sm font-medium text-gray-500">بدون منتجات</p><p className="text-2xl font-bold text-gray-900">{brands.filter(b => b.products_count === 0).length}</p></div></div></div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
                <div className="grid grid-cols-1 gap-4">
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"><Search className="h-5 w-5 text-gray-400" /></div>
                        <input type="text" placeholder="ابحث عن ماركة..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                </div>
            </div>
            
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">{error}</div>}
            
            {/* Brands Table */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                {/* Table Info Bar */}
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-700">
                                عرض <span className="font-medium">{filteredBrands.length}</span> من أصل <span className="font-medium">{brands.length}</span> ماركة
                            </span>
                        </div>
                        <div className="text-sm text-gray-500">
                            {filteredBrands.length > 0 && `${Math.round((filteredBrands.length / brands.length) * 100)}% من النتائج`}
                        </div>
                    </div>
                </div>
                
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    الماركة
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    عدد المنتجات
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    تاريخ الإضافة
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    الإجراءات
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredBrands.map((brand) => (
                                <BrandTableRow 
                                    key={brand.id} 
                                    brand={brand} 
                                    onEdit={handleEdit} 
                                    onDelete={handleDelete} 
                                />
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden divide-y divide-gray-200">
                    {filteredBrands.map((brand) => (
                        <div key={brand.id} className="p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-start space-x-3 space-x-reverse">
                                <div className="flex-shrink-0">
                                    {brand.logo ? (
                                        <Image 
                                            src={brand.logo} 
                                            alt={brand.name}
                                            width={48}
                                            height={48}
                                            className="w-12 h-12 rounded-lg object-cover border border-gray-200" 
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                                            <span className="text-white font-bold text-lg">{brand.name.charAt(0)}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-sm font-medium text-gray-900 truncate">{brand.name}</p>
                                        <span className="text-xs text-gray-500">{new Date(brand.created_at).toLocaleDateString('ar-SA')}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                                        <span>المنتجات: {brand.products_count || 0}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleEdit(brand.id)}
                                            className="flex-1 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors"
                                        >
                                            تعديل
                                        </button>
                                        <button
                                            onClick={() => handleDelete(brand.id)}
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

            {filteredBrands.length === 0 && !loading && (
                 <div className="text-center bg-white p-12 rounded-2xl shadow-md">
                     <p className="text-gray-500">لا توجد ماركات تطابق بحثك.</p>
                 </div>
            )}

            <ConfirmationModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={confirmDelete} loading={loading} />
        </div>
    );
}

// --- Data Fetching Wrapper ---
export default function BrandsPageLoader() {
    const [brands, setBrands] = useState<Brand[]>([]);
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
        api.getBrands(apiToken).then(setBrands).catch(err => setError(err.message)).finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-96"><LoaderCircle className="animate-spin text-blue-600" size={48} /></div>;
    }
    if (error) {
        return <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg">خطأ: {error}</div>;
    }
    return <BrandsPage initialBrands={brands} token={token || ''} />;
}


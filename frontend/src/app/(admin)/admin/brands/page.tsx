'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import api, { UnauthorizedError } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';

// Icons
import { PlusCircle, LoaderCircle, Edit, Trash2, Search, ArrowDown, ArrowUp } from 'lucide-react';

// --- Interfaces ---
interface Brand {
    id: number;
    name: string;
    logo: string;
    products_count: number;
}

// --- Main Brands Page Component ---
export default function BrandsPage() {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ name: '', sort_by: 'name', sort_direction: 'asc' });
    const { toast } = useToast();
    const router = useRouter();

    // State for confirmation dialog
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);

    const fetchBrands = useCallback(async (currentFilters: typeof filters) => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams(currentFilters).toString();
            const data = await api(`/brands?${queryParams}`);
            setBrands(data.data || []);
        } catch (error) {
            if (error instanceof UnauthorizedError) {
                router.push('/login');
            }
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        const handler = setTimeout(() => {
            fetchBrands(filters);
        }, 300); // Debounce search input
        return () => clearTimeout(handler);
    }, [filters, fetchBrands]);

    const openDeleteDialog = (id: number) => {
        setItemToDelete(id);
        setIsDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (itemToDelete === null) return;

        try {
            const result = await api(`/brands/${itemToDelete}`, {
                method: 'DELETE',
            });
            toast({
                title: "نجاح",
                description: result.message,
            });
            fetchBrands(filters);
        } catch (error) {
            if (error instanceof UnauthorizedError) {
                router.push('/login');
            }
        } finally {
            setIsDialogOpen(false);
            setItemToDelete(null);
        }
    };

    const handleSort = (key: string) => {
        setFilters(prev => {
            const direction = prev.sort_by === key && prev.sort_direction === 'asc' ? 'desc' : 'asc';
            return { ...prev, sort_by: key, sort_direction: direction };
        });
    };

    const SortableHeader = ({ title, sortKey }: { title: string, sortKey: string }) => {
        const isSorted = filters.sort_by === sortKey;
        const Icon = filters.sort_direction === 'asc' ? ArrowUp : ArrowDown;
        return (
            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                <button onClick={() => handleSort(sortKey)} className="flex items-center gap-2">
                    <span>{title}</span>
                    {isSorted ? <Icon size={14} className="text-gray-900" /> : <ArrowUp size={14} className="text-gray-300" />}
                </button>
            </th>
        );
    };

    return (
        <>
            <ConfirmationDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onConfirm={handleConfirmDelete}
                title="تأكيد الحذف"
                message="هل أنت متأكد من حذف هذه الماركة؟ لا يمكن التراجع عن هذا الإجراء."
            />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">إدارة الماركات</h1>
                    <a href="/admin/brands/add" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-blue-700"><PlusCircle size={18} /> إضافة ماركة</a>
                </div>
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase w-1/2">
                                    <div className="flex items-center gap-2">
                                        <Search size={16} />
                                        <input type="text" placeholder="ابحث بالاسم..." value={filters.name} onChange={(e) => setFilters(prev => ({ ...prev, name: e.target.value }))} className="bg-transparent border-0 focus:ring-0 p-0" />
                                    </div>
                                </th>
                                <SortableHeader title="الماركة" sortKey="name" />
                                <SortableHeader title="عدد المنتجات" sortKey="products_count" />
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr><td colSpan={4} className="text-center py-10"><LoaderCircle className="animate-spin mx-auto text-blue-600" /></td></tr>
                            ) : (
                                brands.map(brand => (
                                    <tr key={brand.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4" colSpan={2}>
                                            <div className="flex items-center gap-4">
                                                <Image src={brand.logo} alt={brand.name} width={48} height={48} className="object-contain"/>
                                                <span className="font-semibold text-gray-800">{brand.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center text-gray-700">{brand.products_count}</td>
                                        <td className="px-6 py-4 text-left">
                                            <div className="flex items-center justify-end gap-3">
                                                <a href={`/admin/brands/edit/${brand.id}`} className="text-gray-500 hover:text-green-600"><Edit size={18} /></a>
                                                <button onClick={() => openDeleteDialog(brand.id)} className="text-gray-500 hover:text-red-600"><Trash2 size={18} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}


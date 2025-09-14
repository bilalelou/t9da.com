'use client';

import React, { useState, useEffect, useMemo } from 'react';

// Icons
import { Warehouse, Search, LoaderCircle, CheckCircle, XCircle, AlertTriangle, Save, Package, DollarSign, ShoppingBasket } from 'lucide-react';

// --- Interfaces ---
interface InventoryItem {
    id: number;
    name: string;
    sku: string;
    image: string;
    quantity: number;
    category: string;
    cost_price: number;
    total_value: number;
    stock_status: 'instock' | 'outofstock' | 'lowstock' | 'overstocked';
}

// --- API Helper ---
const api = {
    getInventory: async (token: string): Promise<InventoryItem[]> => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/inventory`, {
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
        });
        if (!response.ok) throw new Error('فشل في جلب بيانات المخزون.');
        const data = await response.json();
        return data.data || [];
    },
    updateStock: async (productId: number, quantity: number, token: string) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/inventory/${productId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ quantity }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'فشل في تحديث الكمية.');
        return data;
    }
};

// --- Helper Functions ---
const formatCurrency = (amount: number) => {
    if (typeof amount !== 'number' || isNaN(amount)) return 'غير متوفر';
    return new Intl.NumberFormat('ar-MA', { style: 'currency', currency: 'MAD' }).format(amount);
};

const getStockStatusInfo = (status: InventoryItem['stock_status']) => {
    switch (status) {
        case 'instock': return { text: 'متوفر', color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-4 h-4" /> };
        case 'lowstock': return { text: 'مخزون منخفض', color: 'bg-yellow-100 text-yellow-800', icon: <AlertTriangle className="w-4 h-4" /> };
        case 'outofstock': return { text: 'نفد المخزون', color: 'bg-red-100 text-red-800', icon: <XCircle className="w-4 h-4" /> };
        case 'overstocked': return { text: 'مخزون زائد', color: 'bg-purple-100 text-purple-800', icon: <Warehouse className="w-4 h-4" /> };
        default: return { text: 'غير معروف', color: 'bg-gray-100 text-gray-800' };
    }
};

// --- Sub-components ---
const StatCard = ({ title, value, icon }) => (
    <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">{icon}</div>
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    </div>
);

const InventoryCard = ({ item, onQuantityChange, onSave, isModified, isLoading }) => {
    const status = getStockStatusInfo(item.stock_status);
    return (
        <div className="bg-white rounded-lg shadow p-4 border border-gray-100 space-y-3">
            <div className="flex items-center gap-3">
                <img src={item.image} alt={item.name} className="w-14 h-14 rounded-lg object-cover border" />
                <div>
                    <p className="font-bold text-gray-900 line-clamp-2">{item.name}</p>
                    <p className="text-sm text-gray-500 font-mono">{item.sku}</p>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm pt-3 border-t border-gray-100">
                <div>
                    <p className="text-gray-500">الحالة</p>
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>{status.icon} {status.text}</span>
                </div>
                <div>
                    <p className="text-gray-500">القيمة الإجمالية</p>
                    <p className="font-semibold text-gray-800">{formatCurrency(item.total_value)}</p>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">تحديث الكمية</label>
                <div className="flex items-center gap-2">
                    <input type="number" value={onQuantityChange.value} onChange={onQuantityChange.handler} className="w-full border-gray-300 rounded-lg text-center" />
                    <button onClick={onSave} disabled={!isModified || isLoading} className="p-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300">
                        {isLoading ? <LoaderCircle size={18} className="animate-spin" /> : <Save size={18} />}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Main Inventory Page Component ---
const InventoryPage = ({ initialItems, token }) => {
    const [items, setItems] = useState<InventoryItem[]>(initialItems);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [updatedQuantities, setUpdatedQuantities] = useState<Record<number, number>>({});
    const [loading, setLoading] = useState<Record<number, boolean>>({});
    const [globalError, setGlobalError] = useState<string | null>(null);

    const handleQuantityChange = (id: number, value: string) => {
        const quantity = parseInt(value, 10);
        if (!isNaN(quantity) && quantity >= 0) {
            setUpdatedQuantities(prev => ({...prev, [id]: quantity}));
        }
    };

    const handleSaveStock = async (id: number) => {
        const newQuantity = updatedQuantities[id];
        if (newQuantity === undefined) return;

        setLoading(prev => ({...prev, [id]: true}));
        setGlobalError(null);
        try {
            await api.updateStock(id, newQuantity, token);
            const updatedItems = await api.getInventory(token);
            setItems(updatedItems);
            setUpdatedQuantities(prev => {
                const newUpdates = {...prev};
                delete newUpdates[id];
                return newUpdates;
            });
        } catch (error) {
            setGlobalError(error.message);
        } finally {
            setLoading(prev => ({...prev, [id]: false}));
        }
    };

    const filteredItems = useMemo(() => {
        return items.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.sku.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || item.stock_status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [items, searchTerm, statusFilter]);

    const stats = useMemo(() => ({
        totalValue: items.reduce((sum, item) => sum + item.total_value, 0),
        lowStock: items.filter(item => item.stock_status === 'lowstock').length,
        outOfStock: items.filter(item => item.stock_status === 'outofstock').length,
        reorderNeeded: items.filter(item => item.stock_status === 'lowstock' || item.stock_status === 'outofstock').length,
    }), [items]);

    return (
        <div className="space-y-8" dir="rtl">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">إدارة المخزون</h1>
                <p className="text-md text-gray-600 mt-1">متابعة وتحديث كميات المنتجات المتاحة.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="قيمة المخزون" value={formatCurrency(stats.totalValue)} icon={<DollarSign size={24} />} />
                <StatCard title="مخزون منخفض" value={stats.lowStock} icon={<AlertTriangle size={24} />} />
                <StatCard title="نفد من المخزون" value={stats.outOfStock} icon={<XCircle size={24} />} />
                <StatCard title="يحتاج إعادة طلب" value={stats.reorderNeeded} icon={<ShoppingBasket size={24} />} />
            </div>

            <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div className="relative md:col-span-1">
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"><Search className="h-5 w-5 text-gray-400" /></div>
                        <input type="text" placeholder="ابحث بالاسم أو SKU..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                    </div>
                     <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="all">جميع الحالات</option>
                        <option value="instock">متوفر</option>
                        <option value="lowstock">مخزون منخفض</option>
                        <option value="outofstock">نفد المخزون</option>
                        <option value="overstocked">مخزون زائد</option>
                    </select>
                </div>
            </div>

            {globalError && <div className="bg-red-100 text-red-700 p-3 rounded-lg">{globalError}</div>}

            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto hidden md:block">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">المنتج</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">SKU</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">الحالة</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">الكمية الحالية</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">تحديث الكمية</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredItems.map((item) => {
                                const status = getStockStatusInfo(item.stock_status);
                                const isModified = updatedQuantities[item.id] !== undefined && updatedQuantities[item.id] !== item.quantity;
                                return (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4"><div className="flex items-center gap-3"><img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover border" /><div><p className="font-semibold text-gray-900">{item.name}</p></div></div></td>
                                    <td className="px-6 py-4 text-sm text-gray-500 font-mono">{item.sku}</td>
                                    <td className="px-6 py-4 text-center"><span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>{status.icon} {status.text}</span></td>
                                    <td className="px-6 py-4 text-center text-lg font-bold text-gray-800">{item.quantity}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <input type="number" value={updatedQuantities[item.id] ?? item.quantity} onChange={e => handleQuantityChange(item.id, e.target.value)} className="w-24 border-gray-300 rounded-lg text-center" />
                                            <button onClick={() => handleSaveStock(item.id)} disabled={!isModified || loading[item.id]} className="p-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300 enabled:hover:bg-blue-700">
                                                {loading[item.id] ? <LoaderCircle size={18} className="animate-spin" /> : <Save size={18} />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                 {/* [جديد] عرض البطاقات على شاشات الهاتف */}
                <div className="md:hidden p-4 space-y-4 bg-gray-50">
                     {filteredItems.map(item => (
                        <InventoryCard
                            key={item.id}
                            item={item}
                            onQuantityChange={{
                                value: updatedQuantities[item.id] ?? item.quantity,
                                handler: e => handleQuantityChange(item.id, e.target.value)
                            }}
                            onSave={() => handleSaveStock(item.id)}
                            isModified={updatedQuantities[item.id] !== undefined && updatedQuantities[item.id] !== item.quantity}
                            isLoading={loading[item.id]}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

// --- Data Fetching Wrapper ---
export default function InventoryPageLoader() {
    const [items, setItems] = useState<InventoryItem[]>([]);
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
        api.getInventory(apiToken).then(setItems).catch(err => setError(err.message)).finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-96"><LoaderCircle className="animate-spin text-blue-600" size={48} /></div>;
    }
    if (error) {
        return <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg">خطأ: {error}</div>;
    }
    return <InventoryPage initialItems={items} token={token} />;
}


'use client';

import React, { useState, useMemo, useEffect } from 'react';
import BulkProductModal from '@/components/admin/BulkProductModal';

// Icons from lucide-react for consistency
import { 
    Package, 
    PlusCircle, 
    Search, 
    MoreVertical, 
    Edit, 
    Trash2, 
    LoaderCircle, 
    Star, 
    Tag, 
    Warehouse, 
    CheckCircle,
    XCircle,
    PackageSearch,
    Video,
    Truck,
    PackagePlus
} from 'lucide-react';

// --- Interfaces ---
// تم دمج الواجهات لتشمل جميع التفاصيل
interface Product {
    id: number;
    name: string;
    thumbnail: string;
    category: string;
    price: number;
    originalPrice?: number;
    stock: number;
    sold: number; // عدد المبيعات
    status: 'published' | 'draft' | 'out_of_stock';
    rating: number; // التقييم
    reviews: number; // عدد المراجعات
    has_free_shipping?: boolean; // الشحن المجاني
    free_shipping_note?: string; // ملاحظة الشحن المجاني
}

// --- API Helper ---
const api = {
    getProducts: async (page = 1, perPage = 10) => {
        const token = localStorage.getItem('api_token');
        if (!token) {
            window.location.href = '/login';
            return [];
        }

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/products?page=${page}&per_page=${perPage}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            }
        );

        const data = await response.json();

        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem('api_token');
                window.location.href = '/login';
            }
            throw new Error(data.message || 'فشل في جلب بيانات المنتجات.');
        }

        return data;
    }
};

// --- Helper Functions ---
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-MA', { style: 'currency', currency: 'MAD' }).format(amount);
};

const getStatusInfo = (status: Product['status']) => {
    switch (status) {
        case 'published': return { text: 'منشور', color: 'bg-green-100 text-green-800' };
        case 'draft': return { text: 'مسودة', color: 'bg-yellow-100 text-yellow-800' };
        case 'out_of_stock': return { text: 'نفد المخزون', color: 'bg-red-100 text-red-800' };
        default: return { text: status, color: 'bg-gray-100 text-gray-800' };
    }
};

const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(<Star key={i} size={16} className={i <= rating ? "text-yellow-400 fill-current" : "text-gray-300 fill-current"} />);
    }
    return <div className="flex items-center gap-0.5">{stars}</div>;
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

const ProductCard = ({ product, onSelect, isSelected }) => {
    const status = getStatusInfo(product.status);
    return (
        <div className="bg-white rounded-lg shadow p-4 border border-gray-100 space-y-3">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <input type="checkbox" checked={isSelected} onChange={() => onSelect(product.id)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1" />
                    <img src={product.thumbnail.startsWith('http') ? product.thumbnail : '/' + product.thumbnail} alt={product.name} className="w-14 h-14 rounded-lg object-cover border" onError={(e) => { e.currentTarget.src = 'https://placehold.co/100x100/f0f0f0/cccccc?text=No+Image'; }}/>
                    <div>
                        <p className="font-bold text-gray-900 line-clamp-2">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.category}</p>
                    </div>
                </div>
                <button className="text-gray-400 hover:text-gray-700 p-1"><MoreVertical size={20} /></button>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm pt-3 border-t border-gray-100">
                <div>
                    <p className="text-gray-500">السعر</p>
                    <p className="font-semibold text-gray-800">{formatCurrency(product.price)}</p>
                </div>
                <div>
                    <p className="text-gray-500">المخزون</p>
                    <p className="font-semibold text-gray-800">{product.stock}</p>
                </div>
                <div>
                    <p className="text-gray-500">الحالة</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>{status.text}</span>
                </div>
                <div>
                    <p className="text-gray-500">الشحن</p>
                    {product.has_free_shipping ? (
                        <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                            <Package size={14} />
                            مجاني
                        </span>
                    ) : (
                        <span className="text-gray-600 text-xs">مدفوع</span>
                    )}
                </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button 
                    onClick={() => window.location.href = `/admin/products/${product.id}/videos`}
                    className="text-blue-600 hover:text-blue-800 p-1"
                    title="إدارة الفيديوهات"
                >
                    <Video size={18} />
                </button>
                <button 
                    onClick={() => window.location.href = `/admin/products/edit/${product.id}`}
                    className="text-green-600 hover:text-green-800 p-1"
                    title="تعديل المنتج"
                >
                    <Edit size={18} />
                </button>
                <button 
                    className="text-red-600 hover:text-red-800 p-1"
                    title="حذف المنتج"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
};

// --- Main Products Page Component ---
const ProductsPage = ({
    products,
    totalProducts,
    currentPage,
    lastPage,
    onPageChange,
}: {
    products: Product[];
    totalProducts: number;
    currentPage: number;
    lastPage: number;
    onPageChange: (page: number) => void;
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [shippingFilter, setShippingFilter] = useState('all'); // all, free_shipping, paid_shipping
    const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
    const [showBulkModal, setShowBulkModal] = useState(false);

    // حالة الترتيب
    const [sortColumn, setSortColumn] = useState<string>('id');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const categories = useMemo(() => ['all', ...Array.from(new Set(products.map(p => p.category)))], [products]);

    // دالة استخراج قيمة العمود للترتيب
    const getSortValue = (product: Product, column: string) => {
        switch (column) {
            case 'id': return product.id;
            case 'name': return product.name.toLowerCase();
            case 'price': return product.price;
            case 'stock': return product.stock;
            default: return '';
        }
    };

    // تصفية وترتيب المنتجات محلياً
    const displayedProducts = useMemo(() => {
        let filtered = products;
        if (searchTerm.trim()) {
            const term = searchTerm.trim().toLowerCase();
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(term) ||
                p.category.toLowerCase().includes(term) ||
                p.id.toString().includes(term) ||
                p.stock.toString().includes(term)
            );
        }
        // ترتيب حسب العمود المختار
        filtered = [...filtered].sort((a, b) => {
            const aValue = getSortValue(a, sortColumn);
            const bValue = getSortValue(b, sortColumn);
            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
        return filtered;
    }, [products, searchTerm, sortColumn, sortDirection]);

    const productStats = useMemo(() => ({
        total: totalProducts,
        active: products.filter(p => p.status === 'published').length,
        outOfStock: products.filter(p => p.stock === 0).length,
        lowStock: products.filter(p => p.stock > 0 && p.stock <= 10).length,
        freeShipping: products.filter(p => p.has_free_shipping).length,
        totalValue: products.reduce((acc, p) => acc + (p.price * p.stock), 0)
    }), [products, totalProducts]);

    const toggleProductSelection = (productId: number) => {
        setSelectedProducts(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
    };

    const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedProducts(e.target.checked ? displayedProducts.map((p: Product) => p.id) : []);
    };
    
    return (
        <div className="space-y-8" dir="rtl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">إدارة المنتجات</h1>
                    <p className="text-md text-gray-600 mt-1">إدارة وتنظيم منتجات المتجر.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <button 
                        onClick={() => window.location.href = '/admin/products/add'}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors"
                    >
                        <PlusCircle size={20} />
                        <span>إضافة منتج</span>
                    </button>
                    
                    <button 
                        onClick={() => setShowBulkModal(true)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition-colors"
                    >
                        <PackagePlus size={20} />
                        <span>إضافة عدة منتجات</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                 <StatCard title="إجمالي المنتجات" value={productStats.total} icon={<Package size={24} />} />
                 <StatCard title="المنتجات النشطة" value={productStats.active} icon={<CheckCircle size={24} />} />
                 <StatCard title="شحن مجاني" value={productStats.freeShipping} icon={<Truck size={24} />} />
                 <StatCard title="نفد من المخزون" value={productStats.outOfStock} icon={<XCircle size={24} />} />
                 <StatCard title="قيمة المخزون" value={formatCurrency(productStats.totalValue)} icon={<Tag size={24} />} />
            </div>

            <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="relative md:col-span-2">
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"><Search className="h-5 w-5 text-gray-400" /></div>
                        <input type="text" placeholder="ابحث عن منتج..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                    <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        {categories.map(cat => <option key={cat} value={cat}>{cat === 'all' ? 'جميع التصنيفات' : cat}</option>)}
                    </select>
                    <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="w-full py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="all">جميع الحالات</option>
                        <option value="published">منشور</option>
                        <option value="draft">مسودة</option>
                        <option value="out_of_stock">نفد من المخزون</option>
                    </select>
                    <select value={shippingFilter} onChange={(e) => setShippingFilter(e.target.value)} className="w-full py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                        <option value="all">جميع أنواع الشحن</option>
                        <option value="free_shipping">شحن مجاني</option>
                        <option value="paid_shipping">شحن مدفوع</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto hidden sm:block">
                    <table className="min-w-full divide-y divide-gray-200">
<thead className="bg-gray-50">
    <tr>
        <th className="px-6 py-3 text-right"><input type="checkbox" onChange={toggleSelectAll} checked={selectedProducts.length === displayedProducts.length && displayedProducts.length > 0} className="rounded" /></th>
        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer"
            onClick={() => {
                setSortColumn('id');
                setSortDirection(sortColumn === 'id' && sortDirection === 'asc' ? 'desc' : 'asc');
            }}>
            ID
            <span>
                {sortColumn === 'id' ? (sortDirection === 'asc' ? ' ▲' : ' ▼') : ''}
            </span>
        </th>
        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer"
            onClick={() => {
                setSortColumn('name');
                setSortDirection(sortColumn === 'name' && sortDirection === 'asc' ? 'desc' : 'asc');
            }}>
            المنتج
            <span>
                {sortColumn === 'name' ? (sortDirection === 'asc' ? ' ▲' : ' ▼') : ''}
            </span>
        </th>
        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer"
            onClick={() => {
                setSortColumn('price');
                setSortDirection(sortColumn === 'price' && sortDirection === 'asc' ? 'desc' : 'asc');
            }}>
            السعر
            <span>
                {sortColumn === 'price' ? (sortDirection === 'asc' ? ' ▲' : ' ▼') : ''}
            </span>
        </th>
        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer"
            onClick={() => {
                setSortColumn('stock');
                setSortDirection(sortColumn === 'stock' && sortDirection === 'asc' ? 'desc' : 'asc');
            }}>
            المخزون
            <span>
                {sortColumn === 'stock' ? (sortDirection === 'asc' ? ' ▲' : ' ▼') : ''}
            </span>
        </th>
        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">الشحن</th>
        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">التقييم</th>
        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">الحالة</th>
        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">الإجراءات</th>
    </tr>
</thead>
                        <tbody className="bg-white divide-y divide-gray-200">
{displayedProducts.map((product) => (
    <tr key={product.id} className="hover:bg-gray-50">
        <td className="px-6 py-4"><input type="checkbox" checked={selectedProducts.includes(product.id)} onChange={() => toggleProductSelection(product.id)} className="rounded" /></td>
        <td className="px-4 py-4 text-center font-mono text-xs text-gray-700">{product.id}</td>
        <td className="px-6 py-4"><div className="flex items-center gap-3"><img src={product.thumbnail.startsWith('http') ? product.thumbnail : '/' + product.thumbnail} alt={product.name} className="w-12 h-12 rounded-lg object-cover border" onError={(e) => { e.currentTarget.src = 'https://placehold.co/100x100/f0f0f0/cccccc?text=No+Image'; }} /><div><p className="font-semibold text-gray-900 max-w-xs truncate">{product.name}</p><p className="text-sm text-gray-500">{product.category}</p></div></div></td>
                                    <td className="px-6 py-4"><div className="font-semibold text-gray-800">{formatCurrency(product.price)}</div>{product.originalPrice && <div className="text-xs text-gray-400 line-through">{formatCurrency(product.originalPrice)}</div>}</td>
                                    <td className="px-6 py-4 text-center text-sm font-medium">{product.stock < 10 ? <span className="text-red-600">{product.stock}</span> : product.stock}</td>
                                    <td className="px-6 py-4 text-center">
                                        {product.has_free_shipping ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                                <Package size={12} />
                                                مجاني
                                            </span>
                                        ) : (
                                            <span className="text-gray-500 text-xs">مدفوع</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4"><div className="flex items-center justify-center gap-1">{renderStars(product.rating)}<span className="text-xs text-gray-500">({product.reviews})</span></div></td>
                                    <td className="px-6 py-4 text-center"><span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusInfo(product.status).color}`}>{getStatusInfo(product.status).text}</span></td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3 text-gray-500">
                                            <button 
                                                onClick={() => window.location.href = `/admin/products/${product.id}/videos`}
                                                className="hover:text-blue-600"
                                                title="إدارة الفيديوهات"
                                            >
                                                <Video size={18} />
                                            </button>
                                            <button 
                                                onClick={() => window.location.href = `/admin/products/edit/${product.id}`}
                                                className="hover:text-green-600"
                                                title="تعديل المنتج"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button 
                                                className="hover:text-red-600"
                                                title="حذف المنتج"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="sm:hidden p-4 space-y-4 bg-gray-50">
                     {displayedProducts.map((product) => (<ProductCard key={product.id} product={product} onSelect={toggleProductSelection} isSelected={selectedProducts.includes(product.id)} />))}
                </div>
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <p className="text-sm text-gray-700">
                        صفحة <span className="font-medium">{currentPage}</span> من <span className="font-medium">{lastPage}</span> | عرض <span className="font-medium">{products.length}</span> من <span className="font-medium">{totalProducts}</span> منتج
                    </p>
                    <div className="flex gap-1">
                        <button
                            className="px-3 py-1 border rounded-md text-sm hover:bg-gray-50"
                            disabled={currentPage === 1}
                            onClick={() => onPageChange(currentPage - 1)}
                        >
                            السابق
                        </button>
                        <button
                            className="px-3 py-1 border rounded-md text-sm hover:bg-gray-50"
                            disabled={currentPage === lastPage}
                            onClick={() => onPageChange(currentPage + 1)}
                        >
                            التالي
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Bulk Product Modal */}
            <BulkProductModal
                isOpen={showBulkModal}
                onClose={() => setShowBulkModal(false)}
                onSuccess={() => {
                    setShowBulkModal(false);
                    // إعادة تحميل الصفحة لعرض المنتجات الجديدة
                    window.location.reload();
                }}
            />
        </div>
    );
}

// --- Data Fetching Wrapper ---
export default function ProductsPageLoader() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const perPage = 10;

    useEffect(() => {
        const fetchAllProducts = async () => {
            setLoading(true);
            try {
                let allProducts: Product[] = [];
                let page = 1;
                let lastPage = 1;
                do {
                    const response = await api.getProducts(page, 100); // جلب دفعات كبيرة لتقليل عدد الطلبات
                    const data = response.data || [];
                    allProducts = [...allProducts, ...data];
                    lastPage = response.pagination?.last_page || 1;
                    page++;
                } while (page <= lastPage);
                setProducts(allProducts);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };
        fetchAllProducts();
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-96"><LoaderCircle className="animate-spin text-blue-600" size={48} /></div>;
    }

    if (error) {
        return <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg">خطأ: {error}</div>;
    }

    // حساب عدد الصفحات بناءً على جميع المنتجات
    const totalProducts = products.length;
    const lastPage = Math.max(1, Math.ceil(totalProducts / perPage));
    const paginatedProducts = products.slice((currentPage - 1) * perPage, currentPage * perPage);

    return (
        <ProductsPage
            products={paginatedProducts}
            totalProducts={totalProducts}
            currentPage={currentPage}
            lastPage={lastPage}
            onPageChange={setCurrentPage}
        />
    );
}

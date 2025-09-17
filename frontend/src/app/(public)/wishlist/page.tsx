'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useWishlist, useCart } from '@/contexts/Providers';
import { 
    Heart, 
    ShoppingCart, 
    Trash2, 
    Search,
    ArrowRight,
    Package,
    Star,
    Clock,
    TrendingUp,
    Tag as TagIcon,
    Gift,
    Home,
    Sparkles,
    Eye,
    Share2,
    Download
} from 'lucide-react';

// دالة مساعدة لتنسيق العملة
const formatCurrency = (price: number) => {
    return new Intl.NumberFormat('ar-MA', { 
        style: 'currency', 
        currency: 'MAD',
        minimumFractionDigits: 2
    }).format(price);
};

// دالة مساعدة لتنسيق التاريخ
const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('ar-MA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

// مكون Modal للتأكيد
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-sm mx-4 shadow-2xl">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        إلغاء
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                        تأكيد
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function WishlistPage() {
    const { wishlistItems, removeFromWishlist, clearWishlist, moveToCart } = useWishlist();
    const { addToCart } = useCart();
    
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [sortBy, setSortBy] = useState<'name' | 'price' | 'date'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [removeItemId, setRemoveItemId] = useState<number | null>(null);

    // الحصول على الفئات الفريدة
    const categories = ['all', ...Array.from(new Set(wishlistItems.map((item: any) => item.category).filter(Boolean)))];

    // تصفية وترتيب العناصر
    const filteredAndSortedItems = React.useMemo(() => {
        const filtered = wishlistItems.filter((item: any) => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 (item.brand && item.brand.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });

        // الترتيب
        filtered.sort((a: any, b: any) => {
            let aValue, bValue;
            
            switch (sortBy) {
                case 'name':
                    aValue = a.name;
                    bValue = b.name;
                    break;
                case 'price':
                    aValue = a.price;
                    bValue = b.price;
                    break;
                case 'date':
                    aValue = a.addedAt;
                    bValue = b.addedAt;
                    break;
                default:
                    return 0;
            }

            if (sortOrder === 'asc') {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            } else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
            }
        });

        return filtered;
    }, [wishlistItems, searchTerm, selectedCategory, sortBy, sortOrder]);

    // إحصائيات المفضلة
    const stats = React.useMemo(() => {
        const total = wishlistItems.length;
        const inStock = wishlistItems.filter((item: any) => item.inStock).length;
        const outOfStock = total - inStock;
        const totalValue = wishlistItems.reduce((sum: number, item: any) => sum + item.price, 0);
        const savings = wishlistItems.reduce((sum: number, item: any) => 
            sum + (item.originalPrice ? item.originalPrice - item.price : 0), 0);

        return { total, inStock, outOfStock, totalValue, savings };
    }, [wishlistItems]);

    const handleRemoveItem = (id: number) => {
        setRemoveItemId(id);
    };

    const confirmRemoveItem = () => {
        if (removeItemId) {
            removeFromWishlist(removeItemId);
            setRemoveItemId(null);
        }
    };

    const handleClearWishlist = () => {
        clearWishlist();
        setShowClearConfirm(false);
    };

    const handleAddToCart = (item: any) => {
        addToCart(item, 1);
    };

    const handleMoveAllToCart = () => {
        const inStockItems = filteredAndSortedItems.filter((item: any) => item.inStock);
        inStockItems.forEach((item: any) => {
            addToCart(item, 1);
            removeFromWishlist(item.id);
        });
    };

    const handleShareWishlist = () => {
        const wishlistUrl = `${window.location.origin}/wishlist`;
        const text = `تحقق من قائمة المفضلة الخاصة بي على T9DA.COM - ${wishlistItems.length} منتج رائع!`;
        
        if (navigator.share) {
            navigator.share({
                title: 'قائمة المفضلة - T9DA.COM',
                text: text,
                url: wishlistUrl,
            });
        } else {
            // نسخ الرابط للحافظة
            navigator.clipboard.writeText(`${text} ${wishlistUrl}`);
            // يمكن إضافة toast notification هنا
        }
    };

    const handleExportWishlist = () => {
        const wishlistData = wishlistItems.map((item: any) => ({
            'اسم المنتج': item.name,
            'السعر': formatCurrency(item.price),
            'الفئة': item.category || 'غير محدد',
            'تاريخ الإضافة': formatDate(item.addedAt),
            'الرابط': `${window.location.origin}/shop/${item.slug}`
        }));

        const csvContent = [
            Object.keys(wishlistData[0]).join(','),
            ...wishlistData.map(row => Object.values(row).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `wishlist-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                    <Link href="/" className="hover:text-blue-600 transition-colors flex items-center gap-1">
                        <Home size={16} />
                        الرئيسية
                    </Link>
                    <span className="text-gray-400">›</span>
                    <span className="text-gray-900">المفضلة</span>
                </nav>

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center">
                            <Heart size={32} className="text-white fill-current" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">قائمة المفضلة</h1>
                    <p className="text-gray-600">
                        {wishlistItems.length > 0 
                            ? `${wishlistItems.length} منتج في مفضلتك`
                            : 'قائمة المفضلة فارغة'
                        }
                    </p>
                </div>

                {/* إحصائيات سريعة */}
                {wishlistItems.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white p-4 rounded-xl shadow-sm border">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <Heart size={24} className="text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                                    <p className="text-sm text-gray-600">المنتجات</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-xl shadow-sm border">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                    <Package size={24} className="text-green-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">{stats.inStock}</p>
                                    <p className="text-sm text-gray-600">متوفر</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-xl shadow-sm border">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                    <TagIcon size={24} className="text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalValue)}</p>
                                    <p className="text-sm text-gray-600">القيمة الإجمالية</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-xl shadow-sm border">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                    <TrendingUp size={24} className="text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.savings)}</p>
                                    <p className="text-sm text-gray-600">التوفير</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {wishlistItems.length === 0 ? (
                    /* حالة السلة الفارغة */
                    <div className="text-center py-16">
                        <div className="max-w-md mx-auto">
                            <div className="bg-white p-12 rounded-3xl shadow-lg">
                                <div className="bg-gray-100 p-8 rounded-full mb-6 inline-block">
                                    <Heart size={80} className="text-gray-400" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-800 mb-4">قائمة المفضلة فارغة</h2>
                                <p className="text-gray-500 mb-8 leading-relaxed">
                                    لم تقم بإضافة أي منتجات إلى المفضلة بعد.<br />
                                    تصفح منتجاتنا وأضف ما يعجبك!
                                </p>
                                <Link 
                                    href="/shop" 
                                    className="inline-flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                                >
                                    <Package size={20} />
                                    <span>تصفح المنتجات</span>
                                    <ArrowRight size={20} />
                                </Link>
                            </div>

                            {/* اقتراحات سريعة */}
                            <div className="mt-8 grid grid-cols-3 gap-4">
                                <Link href="/shop?category=electronics" className="p-4 bg-white rounded-xl shadow hover:shadow-md transition-shadow">
                                    <Package className="mx-auto mb-2 text-blue-600" size={24} />
                                    <p className="text-sm font-medium text-gray-700">إلكترونيات</p>
                                </Link>
                                <Link href="/shop?category=fashion" className="p-4 bg-white rounded-xl shadow hover:shadow-md transition-shadow">
                                    <Sparkles className="mx-auto mb-2 text-pink-600" size={24} />
                                    <p className="text-sm font-medium text-gray-700">أزياء</p>
                                </Link>
                                <Link href="/shop?category=home" className="p-4 bg-white rounded-xl shadow hover:shadow-md transition-shadow">
                                    <Gift className="mx-auto mb-2 text-green-600" size={24} />
                                    <p className="text-sm font-medium text-gray-700">منزل</p>
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* أدوات التحكم */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                                {/* البحث */}
                                <div className="lg:col-span-4">
                                    <div className="relative">
                                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="text"
                                            placeholder="ابحث في المفضلة..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* تصفية الفئات */}
                                <div className="lg:col-span-3">
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="all">جميع الفئات</option>
                                        {categories.filter(cat => cat !== 'all').map(category => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* الترتيب */}
                                <div className="lg:col-span-2">
                                    <select
                                        value={`${sortBy}-${sortOrder}`}
                                        onChange={(e) => {
                                            const [sort, order] = e.target.value.split('-');
                                            setSortBy(sort as 'name' | 'price' | 'date');
                                            setSortOrder(order as 'asc' | 'desc');
                                        }}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="date-desc">الأحدث أولاً</option>
                                        <option value="date-asc">الأقدم أولاً</option>
                                        <option value="name-asc">الاسم (أ-ي)</option>
                                        <option value="name-desc">الاسم (ي-أ)</option>
                                        <option value="price-asc">السعر (منخفض-عالي)</option>
                                        <option value="price-desc">السعر (عالي-منخفض)</option>
                                    </select>
                                </div>

                                {/* إجراءات */}
                                <div className="lg:col-span-3 flex gap-2">
                                    <button
                                        onClick={handleMoveAllToCart}
                                        disabled={filteredAndSortedItems.filter((item: any) => item.inStock).length === 0}
                                        className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ShoppingCart size={18} />
                                        <span className="hidden sm:inline">نقل للسلة</span>
                                    </button>
                                    
                                    <button
                                        onClick={handleShareWishlist}
                                        className="flex items-center justify-center gap-2 text-blue-600 border border-blue-200 px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors"
                                    >
                                        <Share2 size={18} />
                                        <span className="hidden sm:inline">مشاركة</span>
                                    </button>
                                    
                                    <button
                                        onClick={handleExportWishlist}
                                        className="flex items-center justify-center gap-2 text-green-600 border border-green-200 px-4 py-3 rounded-lg hover:bg-green-50 transition-colors"
                                    >
                                        <Download size={18} />
                                        <span className="hidden sm:inline">تصدير</span>
                                    </button>
                                    
                                    <button
                                        onClick={() => setShowClearConfirm(true)}
                                        className="flex items-center justify-center gap-2 text-red-600 border border-red-200 px-4 py-3 rounded-lg hover:bg-red-50 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                        <span className="hidden sm:inline">مسح الكل</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* النتائج */}
                        <div className="mb-6">
                            <p className="text-gray-600">
                                عرض {filteredAndSortedItems.length} من {wishlistItems.length} منتج
                            </p>
                        </div>

                        {/* المنتجات */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredAndSortedItems.map((item: any) => (
                                <div key={item.id} className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <div className="relative mb-4">
                                        <Link href={`/shop/${item.slug}`}>
                                            <Image 
                                                src={item.thumbnail || '/images/placeholder-product.svg'} 
                                                alt={item.name}
                                                width={100}
                                                height={100}
                                                className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                                            />
                                        </Link>
                                        
                                        {/* شارة التوفر */}
                                        <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold ${
                                            item.inStock 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {item.inStock ? 'متوفر' : 'نفذت الكمية'}
                                        </div>

                                        {/* أزرار الإجراءات */}
                                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                                            <button
                                                onClick={() => handleRemoveItem(item.id)}
                                                className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors"
                                                title="إزالة من المفضلة"
                                            >
                                                <Trash2 size={16} className="text-red-500" />
                                            </button>
                                            
                                            <Link 
                                                href={`/shop/${item.slug}`}
                                                className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-blue-50 transition-colors"
                                                title="عرض التفاصيل"
                                            >
                                                <Eye size={16} className="text-blue-500" />
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <Link 
                                                href={`/shop/${item.slug}`}
                                                className="font-semibold text-gray-800 hover:text-blue-600 transition-colors block truncate"
                                            >
                                                {item.name}
                                            </Link>
                                            {item.brand && (
                                                <p className="text-sm text-gray-500">{item.brand}</p>
                                            )}
                                        </div>

                                        {/* التقييم */}
                                        {item.rating && (
                                            <div className="flex items-center gap-1">
                                                <div className="flex">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star 
                                                            key={i} 
                                                            size={16} 
                                                            className={`${
                                                                i < Math.floor(item.rating!) 
                                                                    ? 'text-yellow-400 fill-current' 
                                                                    : 'text-gray-300'
                                                            }`} 
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-sm text-gray-600">
                                                    ({item.reviewCount || 0})
                                                </span>
                                            </div>
                                        )}

                                        {/* السعر */}
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl font-bold text-blue-600">
                                                {formatCurrency(item.price)}
                                            </span>
                                            {item.originalPrice && item.originalPrice > item.price && (
                                                <span className="text-sm text-gray-500 line-through">
                                                    {formatCurrency(item.originalPrice)}
                                                </span>
                                            )}
                                        </div>

                                        {/* تاريخ الإضافة */}
                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                            <Clock size={12} />
                                            <span>أُضيف في {formatDate(item.addedAt)}</span>
                                        </div>

                                        {/* أزرار الإجراءات */}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleAddToCart(item)}
                                                disabled={!item.inStock}
                                                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <ShoppingCart size={16} />
                                                <span>أضف للسلة</span>
                                            </button>
                                            
                                            <button
                                                onClick={() => moveToCart(item.id)}
                                                disabled={!item.inStock}
                                                className="flex items-center justify-center gap-2 border border-blue-200 text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                title="نقل للسلة وإزالة من المفضلة"
                                            >
                                                <ArrowRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* متابعة التسوق */}
                        <div className="mt-12 text-center">
                            <Link
                                href="/shop"
                                className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                            >
                                <Package size={20} />
                                <span>متابعة التسوق</span>
                                <ArrowRight size={20} />
                            </Link>
                        </div>

                        {/* إحصائيات تفاعلية متقدمة */}
                        {wishlistItems.length > 0 && (
                            <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">إحصائيات المفضلة</h3>
                                
                                {/* توزيع الفئات */}
                                <div className="mb-8">
                                    <h4 className="text-lg font-semibold text-gray-800 mb-4">توزيع المنتجات حسب الفئة</h4>
                                    <div className="space-y-3">
                                        {categories.filter(cat => cat !== 'all').map(category => {
                                            const count = wishlistItems.filter((item: any) => item.category === category).length;
                                            const percentage = Math.round((count / wishlistItems.length) * 100);
                                            
                                            return (
                                                <div key={category} className="flex items-center gap-4">
                                                    <div className="w-24 text-sm text-gray-600">{category}</div>
                                                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                                                        <div 
                                                            className="bg-blue-600 h-3 rounded-full transition-all duration-1000"
                                                            style={{ width: `${percentage}%` }}
                                                        ></div>
                                                    </div>
                                                    <div className="w-16 text-sm text-gray-600 text-left">
                                                        {count} ({percentage}%)
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* نصائح ذكية */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-blue-50 p-6 rounded-xl">
                                        <h5 className="font-semibold text-blue-900 mb-2">💡 نصيحة التوفير</h5>
                                        <p className="text-blue-800 text-sm">
                                            يمكنك توفير {formatCurrency(stats.savings)} عبر العروض الحالية في مفضلتك!
                                        </p>
                                    </div>
                                    
                                    <div className="bg-green-50 p-6 rounded-xl">
                                        <h5 className="font-semibold text-green-900 mb-2">📊 إحصائية سريعة</h5>
                                        <p className="text-green-800 text-sm">
                                            متوسط سعر المنتج في مفضلتك: {formatCurrency(stats.totalValue / wishlistItems.length)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Modal تأكيد مسح الكل */}
                <ConfirmModal
                    isOpen={showClearConfirm}
                    onClose={() => setShowClearConfirm(false)}
                    onConfirm={handleClearWishlist}
                    title="مسح المفضلة"
                    message="هل أنت متأكد من رغبتك في مسح جميع المنتجات من المفضلة؟"
                />

                {/* Modal تأكيد حذف منتج */}
                <ConfirmModal
                    isOpen={removeItemId !== null}
                    onClose={() => setRemoveItemId(null)}
                    onConfirm={confirmRemoveItem}
                    title="إزالة من المفضلة"
                    message="هل أنت متأكد من رغبتك في إزالة هذا المنتج من المفضلة؟"
                />
            </div>
        </div>
    );
}

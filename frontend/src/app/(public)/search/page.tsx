"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, SlidersHorizontal, Grid3X3, List, Package, Star, Heart, ShoppingCart } from 'lucide-react';

// --- Types ---
interface Product {
    id: number;
    name: string;
    description?: string;
    image?: string;
    price: number;
    sale_price?: number;
    category?: string;
    brand?: string;
    rating?: number;
    stock_quantity?: number;
    is_featured?: boolean;
}

interface SearchFilters {
    category: string;
    brand: string;
    minPrice: number | null;
    maxPrice: number | null;
    inStock: boolean;
    featured: boolean;
    rating: number | null;
}

// --- API Helper ---
const api = {
    searchProducts: async (query: string, filters?: Partial<SearchFilters>): Promise<Product[]> => {
        try {
            const params = new URLSearchParams();
            if (query) params.append('q', query);
            if (filters?.category) params.append('category', filters.category);
            if (filters?.brand) params.append('brand', filters.brand);
            if (filters?.minPrice) params.append('min_price', filters.minPrice.toString());
            if (filters?.maxPrice) params.append('max_price', filters.maxPrice.toString());
            if (filters?.inStock) params.append('in_stock', 'true');
            if (filters?.featured) params.append('featured', 'true');
            if (filters?.rating) params.append('min_rating', filters.rating.toString());

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/test/search?${params}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                // Return filtered mock data if API fails
                return mockProducts.filter(product => 
                    !query || product.name.toLowerCase().includes(query.toLowerCase())
                );
            }

            const data = await response.json();
            return data.data || [];
        } catch (error) {
            console.error('خطأ في البحث:', error);
            return mockProducts.filter(product => 
                !query || product.name.toLowerCase().includes(query.toLowerCase())
            );
        }
    },

    getCategories: async (): Promise<string[]> => {
        return ['إلكترونيات', 'ملابس', 'منزل وحديقة', 'رياضة', 'جمال وصحة', 'كتب', 'ألعاب'];
    },

    getBrands: async (): Promise<string[]> => {
        return ['Apple', 'Samsung', 'Nike', 'Adidas', 'Zara', 'H&M', 'IKEA'];
    }
};

// --- Mock Data ---
const mockProducts: Product[] = [
    {
        id: 1,
        name: 'ساعة ذكية رياضية',
        description: 'ساعة ذكية متطورة مع مراقب اللياقة البدنية',
        image: '/images/watch.jpg',
        price: 500,
        sale_price: 350,
        category: 'إلكترونيات',
        brand: 'Apple',
        rating: 4.8,
        stock_quantity: 25,
        is_featured: true
    },
    {
        id: 2,
        name: 'حقيبة جلدية فاخرة',
        description: 'حقيبة جلد طبيعي عالية الجودة',
        image: '/images/bag.jpg',
        price: 300,
        category: 'إكسسوارات',
        brand: 'Zara',
        rating: 4.6,
        stock_quantity: 15
    },
    {
        id: 3,
        name: 'سماعات لاسلكية',
        description: 'سماعات بلوتوث عالية الجودة',
        image: '/images/headphones.jpg',
        price: 400,
        sale_price: 280,
        category: 'إلكترونيات',
        brand: 'Samsung',
        rating: 4.9,
        stock_quantity: 40,
        is_featured: true
    }
];

// --- Utility Functions ---
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-EG', {
        style: 'currency',
        currency: 'EGP',
        minimumFractionDigits: 0
    }).format(price);
};

// --- Main Search Page Component ---
export default function SearchPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState<'relevance' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('relevance');
    const [categories, setCategories] = useState<string[]>([]);
    const [brands, setBrands] = useState<string[]>([]);
    
    const [filters, setFilters] = useState<SearchFilters>({
        category: '',
        brand: '',
        minPrice: null,
        maxPrice: null,
        inStock: false,
        featured: false,
        rating: null
    });

    // Get URL parameters on load
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q') || '';
        const category = urlParams.get('category') || '';
        
        setSearchQuery(query);
        if (category) {
            setFilters(prev => ({ ...prev, category }));
        }

        // Load initial data
        const loadInitialData = async () => {
            const cats = await api.getCategories();
            setCategories(cats);
            
            const brandsList = await api.getBrands();
            setBrands(brandsList);
            
            if (query || category) {
                setLoading(true);
                const searchFilters = category ? { category } : {};
                const results = await api.searchProducts(query, searchFilters);
                const sortedResults = sortProducts(results, sortBy);
                setProducts(sortedResults);
                setLoading(false);
            }
        };

        loadInitialData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const performSearch = async (query: string, additionalFilters: Partial<SearchFilters> = {}) => {
        setLoading(true);
        const searchFilters = { ...filters, ...additionalFilters };
        const results = await api.searchProducts(query, searchFilters);
        
        // Apply client-side sorting
        const sortedResults = sortProducts(results, sortBy);
        setProducts(sortedResults);
        setLoading(false);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        performSearch(searchQuery);
    };

    const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
        const updatedFilters = { ...filters, ...newFilters };
        setFilters(updatedFilters);
        performSearch(searchQuery, updatedFilters);
    };

    const clearFilters = () => {
        const emptyFilters: SearchFilters = {
            category: '',
            brand: '',
            minPrice: null,
            maxPrice: null,
            inStock: false,
            featured: false,
            rating: null
        };
        setFilters(emptyFilters);
        performSearch(searchQuery, emptyFilters);
    };

    const sortProducts = (products: Product[], sortOption: string): Product[] => {
        return [...products].sort((a, b) => {
            switch (sortOption) {
                case 'price-asc':
                    return (a.sale_price || a.price) - (b.sale_price || b.price);
                case 'price-desc':
                    return (b.sale_price || b.price) - (a.sale_price || a.price);
                case 'rating':
                    return (b.rating || 0) - (a.rating || 0);
                case 'newest':
                    return b.id - a.id;
                default:
                    return 0;
            }
        });
    };

    const handleSortChange = (newSort: string) => {
        setSortBy(newSort as 'relevance' | 'price-asc' | 'price-desc' | 'rating' | 'newest');
        const sortedProducts = sortProducts(products, newSort);
        setProducts(sortedProducts);
    };

    return (
        <div className="min-h-screen bg-gray-50" dir="rtl">
            {/* Search Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-6">
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="ابحث عن المنتجات..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1e81b0] focus:border-transparent"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-[#1e81b0] text-white px-8 py-3 rounded-lg hover:bg-[#1e81b0]/90 transition-colors"
                        >
                            بحث
                        </button>
                    </form>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="flex gap-8">
                    {/* Filters Sidebar */}
                    <div className={`w-80 ${showFilters ? 'block' : 'hidden'} lg:block`}>
                        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold">المرشحات</h3>
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-gray-500 hover:text-gray-700"
                                >
                                    مسح الكل
                                </button>
                            </div>

                            {/* Category Filter */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">التصنيف</label>
                                <select
                                    value={filters.category}
                                    onChange={(e) => handleFilterChange({ category: e.target.value })}
                                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1e81b0]"
                                >
                                    <option value="">جميع التصنيفات</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Brand Filter */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">الماركة</label>
                                <select
                                    value={filters.brand}
                                    onChange={(e) => handleFilterChange({ brand: e.target.value })}
                                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1e81b0]"
                                >
                                    <option value="">جميع الماركات</option>
                                    {brands.map(brand => (
                                        <option key={brand} value={brand}>{brand}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Price Range */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">نطاق السعر</label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        placeholder="من"
                                        value={filters.minPrice || ''}
                                        onChange={(e) => handleFilterChange({ 
                                            minPrice: e.target.value ? Number(e.target.value) : null 
                                        })}
                                        className="flex-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1e81b0]"
                                    />
                                    <input
                                        type="number"
                                        placeholder="إلى"
                                        value={filters.maxPrice || ''}
                                        onChange={(e) => handleFilterChange({ 
                                            maxPrice: e.target.value ? Number(e.target.value) : null 
                                        })}
                                        className="flex-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1e81b0]"
                                    />
                                </div>
                            </div>

                            {/* Rating Filter */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">التقييم</label>
                                <select
                                    value={filters.rating || ''}
                                    onChange={(e) => handleFilterChange({ 
                                        rating: e.target.value ? Number(e.target.value) : null 
                                    })}
                                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1e81b0]"
                                >
                                    <option value="">جميع التقييمات</option>
                                    <option value="4">4 نجوم فأكثر</option>
                                    <option value="3">3 نجوم فأكثر</option>
                                    <option value="2">2 نجوم فأكثر</option>
                                </select>
                            </div>

                            {/* Checkboxes */}
                            <div className="space-y-3">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={filters.inStock}
                                        onChange={(e) => handleFilterChange({ inStock: e.target.checked })}
                                        className="rounded border-gray-300 text-[#1e81b0] focus:ring-[#1e81b0]"
                                    />
                                    <span className="mr-2 text-sm">متوفر في المخزن</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={filters.featured}
                                        onChange={(e) => handleFilterChange({ featured: e.target.checked })}
                                        className="rounded border-gray-300 text-[#1e81b0] focus:ring-[#1e81b0]"
                                    />
                                    <span className="mr-2 text-sm">منتجات مميزة</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Toolbar */}
                        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    {/* Mobile Filters Toggle */}
                                    <button
                                        onClick={() => setShowFilters(!showFilters)}
                                        className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                                    >
                                        <SlidersHorizontal size={16} />
                                        مرشحات
                                    </button>

                                    {/* Results Count */}
                                    <p className="text-gray-600">
                                        {loading ? 'جاري البحث...' : `${products.length} نتيجة`}
                                    </p>
                                </div>

                                <div className="flex items-center gap-4">
                                    {/* Sort Options */}
                                    <select
                                        value={sortBy}
                                        onChange={(e) => handleSortChange(e.target.value)}
                                        className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1e81b0]"
                                    >
                                        <option value="relevance">الأكثر صلة</option>
                                        <option value="price-asc">السعر: من الأقل للأعلى</option>
                                        <option value="price-desc">السعر: من الأعلى للأقل</option>
                                        <option value="rating">الأعلى تقييماً</option>
                                        <option value="newest">الأحدث</option>
                                    </select>

                                    {/* View Mode Toggle */}
                                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className={`p-2 rounded-md transition-colors ${
                                                viewMode === 'grid' 
                                                    ? 'bg-white text-[#1e81b0] shadow-sm' 
                                                    : 'text-gray-600 hover:text-gray-800'
                                            }`}
                                        >
                                            <Grid3X3 size={16} />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('list')}
                                            className={`p-2 rounded-md transition-colors ${
                                                viewMode === 'list' 
                                                    ? 'bg-white text-[#1e81b0] shadow-sm' 
                                                    : 'text-gray-600 hover:text-gray-800'
                                            }`}
                                        >
                                            <List size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Products Grid/List */}
                        {loading ? (
                            <div className="flex items-center justify-center py-16">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e81b0]"></div>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                                <Search className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                                <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد نتائج</h3>
                                <p className="text-gray-500 mb-4">
                                    لم يتم العثور على منتجات تطابق بحثك
                                </p>
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        clearFilters();
                                    }}
                                    className="px-6 py-2 bg-[#1e81b0] text-white rounded-lg hover:bg-[#1e81b0]/90 transition-colors"
                                >
                                    مسح البحث
                                </button>
                            </div>
                        ) : (
                            <div className={
                                viewMode === 'grid' 
                                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                                    : 'space-y-4'
                            }>
                                {products.map((product) => (
                                    <ProductCard 
                                        key={product.id} 
                                        product={product} 
                                        viewMode={viewMode}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Product Card Component ---
interface ProductCardProps {
    product: Product;
    viewMode: 'grid' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode }) => {
    const currentPrice = product.sale_price || product.price;
    const hasDiscount = product.sale_price && product.sale_price < product.price;

    if (viewMode === 'list') {
        return (
            <Link href={`/shop/product/${product.id}`} className="block">
                <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-100 hover:border-[#1e81b0]/20">
                    <div className="flex items-center gap-6">
                        {/* Image */}
                        <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                            {product.image ? (
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    width={128}
                                    height={128}
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                <Package className="h-12 w-12 text-gray-400" />
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-semibold text-gray-800 hover:text-[#1e81b0] transition-colors">
                                    {product.name}
                                </h3>
                                <button className="text-gray-400 hover:text-red-500 transition-colors">
                                    <Heart size={20} />
                                </button>
                            </div>
                            
                            {product.description && (
                                <p className="text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                            )}
                            
                            {/* Price */}
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-2xl font-bold text-[#1e81b0]">
                                    {formatPrice(currentPrice)}
                                </span>
                                {hasDiscount && (
                                    <span className="text-lg text-gray-500 line-through">
                                        {formatPrice(product.price)}
                                    </span>
                                )}
                            </div>

                            {/* Meta Info */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    {product.rating && (
                                        <div className="flex items-center gap-1">
                                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                            <span className="text-sm text-gray-600">{product.rating}</span>
                                        </div>
                                    )}
                                    {product.category && (
                                        <span className="text-sm text-gray-500">{product.category}</span>
                                    )}
                                </div>
                                
                                <button className="bg-[#1e81b0] text-white px-6 py-2 rounded-lg hover:bg-[#1e81b0]/90 transition-colors flex items-center gap-2">
                                    <ShoppingCart size={16} />
                                    أضف للسلة
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        );
    }

    return (
        <Link href={`/shop/product/${product.id}`} className="block group">
            <div className="bg-white rounded-xl shadow-sm group-hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-[#1e81b0]/20">
                {/* Image */}
                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    {product.image ? (
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <Package className="h-16 w-16 text-gray-400" />
                        </div>
                    )}
                    
                    {/* Discount Badge */}
                    {hasDiscount && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                            -{Math.round(((product.price - currentPrice) / product.price) * 100)}%
                        </div>
                    )}

                    {/* Featured Badge */}
                    {product.is_featured && (
                        <div className="absolute top-3 right-3 bg-[#eab676] text-white text-xs font-bold px-2 py-1 rounded-full">
                            مميز
                        </div>
                    )}

                    {/* Wishlist Button */}
                    <button className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors">
                        <Heart size={18} className="text-gray-600 hover:text-red-500" />
                    </button>
                </div>
                
                {/* Content */}
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-[#1e81b0] transition-colors">
                        {product.name}
                    </h3>
                    
                    {product.description && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {product.description}
                        </p>
                    )}
                    
                    {/* Price */}
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-xl font-bold text-[#1e81b0]">
                            {formatPrice(currentPrice)}
                        </span>
                        {hasDiscount && (
                            <span className="text-sm text-gray-500 line-through">
                                {formatPrice(product.price)}
                            </span>
                        )}
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between mb-4">
                        {product.rating && (
                            <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="text-sm text-gray-600">{product.rating}</span>
                            </div>
                        )}
                        
                        {product.category && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                {product.category}
                            </span>
                        )}
                    </div>

                    {/* Add to Cart Button */}
                    <button className="w-full bg-[#1e81b0] text-white py-3 rounded-lg hover:bg-[#1e81b0]/90 transition-colors flex items-center justify-center gap-2 font-medium">
                        <ShoppingCart size={18} />
                        أضف للسلة
                    </button>
                </div>
            </div>
        </Link>
    );
};
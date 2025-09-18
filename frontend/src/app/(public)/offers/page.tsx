"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Search, Grid3X3, List, Package, Tag, Clock, Star, Heart, ShoppingCart } from 'lucide-react';

// --- Types ---
interface Offer {
    id: number;
    name: string;
    description?: string;
    image?: string;
    original_price: number;
    sale_price: number;
    discount_percentage: number;
    start_date: string;
    end_date: string;
    is_active: boolean;
    stock_quantity?: number;
    rating?: number;
    category?: string;
}

// --- API Helper ---
const api = {
    getOffers: async (): Promise<Offer[]> => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/test/offers`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                // Return mock data if API fails
                return mockOffers;
            }

            const data = await response.json();
            return data.data || mockOffers;
        } catch (error) {
            console.error('خطأ في جلب العروض:', error);
            return mockOffers;
        }
    }
};

// --- Mock Data (for when API is not available) ---
const mockOffers: Offer[] = [
    {
        id: 1,
        name: 'ساعة ذكية رياضية',
        description: 'ساعة ذكية متطورة مع مراقب اللياقة البدنية ومقاومة للماء',
        image: '/images/watch.jpg',
        original_price: 500,
        sale_price: 350,
        discount_percentage: 30,
        start_date: '2024-01-15',
        end_date: '2024-02-15',
        is_active: true,
        stock_quantity: 25,
        rating: 4.8,
        category: 'إلكترونيات'
    },
    {
        id: 2,
        name: 'حقيبة جلدية فاخرة',
        description: 'حقيبة جلد طبيعي عالية الجودة مناسبة للأعمال والسفر',
        image: '/images/bag.jpg',
        original_price: 300,
        sale_price: 200,
        discount_percentage: 33,
        start_date: '2024-01-10',
        end_date: '2024-02-10',
        is_active: true,
        stock_quantity: 15,
        rating: 4.6,
        category: 'إكسسوارات'
    },
    {
        id: 3,
        name: 'سماعات لاسلكية',
        description: 'سماعات بلوتوث عالية الجودة مع إلغاء الضوضاء',
        image: '/images/headphones.jpg',
        original_price: 400,
        sale_price: 280,
        discount_percentage: 30,
        start_date: '2024-01-20',
        end_date: '2024-02-20',
        is_active: true,
        stock_quantity: 40,
        rating: 4.9,
        category: 'إلكترونيات'
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

const getDaysRemaining = (endDate: string) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
};

// --- Main Offers Page Component ---
export default function OffersPage() {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState<'discount' | 'price' | 'ending'>('discount');

    useEffect(() => {
        const fetchOffers = async () => {
            setLoading(true);
            const fetchedOffers = await api.getOffers();
            setOffers(fetchedOffers);
            setLoading(false);
        };

        fetchOffers();
    }, []);

    const filteredAndSortedOffers = offers
        .filter(offer => 
            offer.is_active &&
            offer.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            switch (sortBy) {
                case 'discount':
                    return b.discount_percentage - a.discount_percentage;
                case 'price':
                    return a.sale_price - b.sale_price;
                case 'ending':
                    return getDaysRemaining(a.end_date) - getDaysRemaining(b.end_date);
                default:
                    return 0;
            }
        });

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50" dir="rtl">
                <div className="container mx-auto px-4 py-16">
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e81b0]"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50" dir="rtl">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-[#eab676] via-[#1e81b0] to-[#2596be] text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex items-center justify-center mb-4">
                        <Tag className="h-12 w-12 ml-4" />
                        <h1 className="text-4xl md:text-5xl font-bold">العروض الخاصة</h1>
                    </div>
                    <p className="text-xl text-blue-100 mb-8">
                        اكتشف أفضل العروض والتخفيضات الحصرية
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-12">
                {/* Search and Filters */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="البحث في العروض..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1e81b0] focus:border-transparent"
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Sort Options */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as 'discount' | 'price' | 'ending')}
                                className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1e81b0] focus:border-transparent"
                            >
                                <option value="discount">حسب نسبة الخصم</option>
                                <option value="price">حسب السعر</option>
                                <option value="ending">حسب انتهاء العرض</option>
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
                                    <Grid3X3 size={20} />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-md transition-colors ${
                                        viewMode === 'list' 
                                            ? 'bg-white text-[#1e81b0] shadow-sm' 
                                            : 'text-gray-600 hover:text-gray-800'
                                    }`}
                                >
                                    <List size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-gray-600">
                            تم العثور على <span className="font-semibold text-[#1e81b0]">{filteredAndSortedOffers.length}</span> عرض
                        </p>
                    </div>
                </div>

                {/* Offers Display */}
                {filteredAndSortedOffers.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <Tag className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد عروض متاحة</h3>
                        <p className="text-gray-500">
                            {searchTerm ? 'لم يتم العثور على عروض تطابق بحثك' : 'لا توجد عروض نشطة حالياً'}
                        </p>
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="mt-4 px-6 py-2 bg-[#1e81b0] text-white rounded-lg hover:bg-[#1e81b0]/90 transition-colors"
                            >
                                مسح البحث
                            </button>
                        )}
                    </div>
                ) : (
                    <div className={
                        viewMode === 'grid' 
                            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                            : 'space-y-4'
                    }>
                        {filteredAndSortedOffers.map((offer) => (
                            <OfferCard 
                                key={offer.id} 
                                offer={offer} 
                                viewMode={viewMode}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// --- Offer Card Component ---
interface OfferCardProps {
    offer: Offer;
    viewMode: 'grid' | 'list';
}

const OfferCard: React.FC<OfferCardProps> = ({ offer, viewMode }) => {
    const daysRemaining = getDaysRemaining(offer.end_date);

    if (viewMode === 'list') {
        return (
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-100 hover:border-[#1e81b0]/20">
                <div className="flex items-center gap-6">
                    {/* Image */}
                    <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden relative">
                        {offer.image ? (
                            <Image
                                src={offer.image}
                                alt={offer.name}
                                width={128}
                                height={128}
                                className="object-cover w-full h-full"
                            />
                        ) : (
                            <Package className="h-12 w-12 text-gray-400" />
                        )}
                        
                        {/* Discount Badge */}
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            -{offer.discount_percentage}%
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-semibold text-gray-800">{offer.name}</h3>
                            <button className="text-gray-400 hover:text-red-500 transition-colors">
                                <Heart size={20} />
                            </button>
                        </div>
                        
                        {offer.description && (
                            <p className="text-gray-600 mb-3 line-clamp-2">{offer.description}</p>
                        )}
                        
                        {/* Price */}
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-2xl font-bold text-[#1e81b0]">
                                {formatPrice(offer.sale_price)}
                            </span>
                            <span className="text-lg text-gray-500 line-through">
                                {formatPrice(offer.original_price)}
                            </span>
                        </div>

                        {/* Meta Info */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                {offer.rating && (
                                    <div className="flex items-center gap-1">
                                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                        <span className="text-sm text-gray-600">{offer.rating}</span>
                                    </div>
                                )}
                                {daysRemaining > 0 && (
                                    <div className="flex items-center gap-1 text-red-500">
                                        <Clock size={16} />
                                        <span className="text-sm font-medium">
                                            {daysRemaining} يوم متبقي
                                        </span>
                                    </div>
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
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#1e81b0]/20 group">
            {/* Image */}
            <div className="aspect-square bg-gray-100 relative overflow-hidden">
                {offer.image ? (
                    <Image
                        src={offer.image}
                        alt={offer.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <Package className="h-16 w-16 text-gray-400" />
                    </div>
                )}
                
                {/* Discount Badge */}
                <div className="absolute top-3 left-3 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                    -{offer.discount_percentage}%
                </div>

                {/* Wishlist Button */}
                <button className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors">
                    <Heart size={18} className="text-gray-600 hover:text-red-500" />
                </button>
            </div>
            
            {/* Content */}
            <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-[#1e81b0] transition-colors">
                    {offer.name}
                </h3>
                
                {offer.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {offer.description}
                    </p>
                )}
                
                {/* Price */}
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl font-bold text-[#1e81b0]">
                        {formatPrice(offer.sale_price)}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                        {formatPrice(offer.original_price)}
                    </span>
                </div>

                {/* Meta Info */}
                <div className="flex items-center justify-between mb-4">
                    {offer.rating && (
                        <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600">{offer.rating}</span>
                        </div>
                    )}
                    
                    {daysRemaining > 0 && (
                        <div className="flex items-center gap-1 text-red-500">
                            <Clock size={14} />
                            <span className="text-xs font-medium">
                                {daysRemaining} يوم متبقي
                            </span>
                        </div>
                    )}
                </div>

                {/* Add to Cart Button */}
                <button className="w-full bg-[#1e81b0] text-white py-3 rounded-lg hover:bg-[#1e81b0]/90 transition-colors flex items-center justify-center gap-2 font-medium">
                    <ShoppingCart size={18} />
                    أضف للسلة
                </button>
            </div>
        </div>
    );
};
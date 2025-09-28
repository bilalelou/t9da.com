"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Grid3X3, List, Package } from 'lucide-react';

// --- Types ---
interface Category {
    id: number;
    name: string;
    description?: string;
    image?: string;
    products_count?: number;
}

// --- API Helper ---
const api = {
    getCategories: async (): Promise<Category[]> => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/categories`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('فشل في جلب التصنيفات');
            }

            const data = await response.json();
            return data.data || [];
        } catch (error) {
            console.error('خطأ في جلب التصنيفات:', error);
            return [];
        }
    }
};

// --- Main Categories Page Component ---
export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            const fetchedCategories = await api.getCategories();
            setCategories(fetchedCategories);
            setLoading(false);
        };

        fetchCategories();
    }, []);

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
            <div className="bg-gradient-to-r from-[#1e81b0] to-[#2596be] text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">التصنيفات</h1>
                    <p className="text-xl text-blue-100 mb-8">
                        استكشف مجموعة واسعة من المنتجات المصنفة بعناية
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-12">
                {/* Search and Filters */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="البحث في التصنيفات..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1e81b0] focus:border-transparent"
                            />
                        </div>

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

                    {/* Results Count */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-gray-600">
                            تم العثور على <span className="font-semibold text-[#1e81b0]">{filteredCategories.length}</span> تصنيف
                        </p>
                    </div>
                </div>

                {/* Categories Display */}
                {filteredCategories.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <Package className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد تصنيفات</h3>
                        <p className="text-gray-500">
                            {searchTerm ? 'لم يتم العثور على تصنيفات تطابق بحثك' : 'لم يتم إضافة أي تصنيفات بعد'}
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
                        {filteredCategories.map((category) => (
                            <CategoryCard 
                                key={category.id} 
                                category={category} 
                                viewMode={viewMode}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// --- Category Card Component ---
interface CategoryCardProps {
    category: Category;
    viewMode: 'grid' | 'list';
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, viewMode }) => {
    if (viewMode === 'list') {
        return (
            <Link href={`/shop?category=${category.id}`} className="block">
                <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-100 hover:border-[#1e81b0]/20">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                            {category.image ? (
                                <Image
                                    src={category.image}
                                    alt={category.name}
                                    width={80}
                                    height={80}
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                <Package className="h-8 w-8 text-gray-400" />
                            )}
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">{category.name}</h3>
                            {category.description && (
                                <p className="text-gray-600 mb-2 line-clamp-2">{category.description}</p>
                            )}
                            {category.products_count !== undefined && (
                                <p className="text-sm text-[#1e81b0] font-medium">
                                    {category.products_count} منتج
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        );
    }

    return (
        <Link href={`/shop?category=${category.id}`} className="block group">
            <div className="bg-white rounded-xl shadow-sm group-hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-[#1e81b0]/20">
                {/* Image */}
                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    {category.image ? (
                        <Image
                            src={category.image}
                            alt={category.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <Package className="h-16 w-16 text-gray-400" />
                        </div>
                    )}
                </div>
                
                {/* Content */}
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-[#1e81b0] transition-colors">
                        {category.name}
                    </h3>
                    {category.description && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {category.description}
                        </p>
                    )}
                    {category.products_count !== undefined && (
                        <p className="text-sm text-[#1e81b0] font-medium">
                            {category.products_count} منتج
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
};
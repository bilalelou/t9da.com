'use client';

import React, { useState, useEffect } from 'react';
import { 
    Plus, 
    Edit, 
    Trash2, 
    Eye, 
    EyeOff, 
    Image as ImageIcon,
    ArrowUp,
    ArrowDown,
    Save,
    X
} from 'lucide-react';

interface Slider {
    id: number;
    title: string;
    description: string;
    image: string;
    button_text?: string;
    button_link?: string;
    order: number;
    is_active: boolean;
    created_at: string;
}

export default function SlidersPage() {
    const [sliders, setSliders] = useState<Slider[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingSlider, setEditingSlider] = useState<Slider | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image: '',
        button_text: '',
        button_link: '',
        is_active: true
    });

    // محاكاة بيانات الشرائح
    useEffect(() => {
        const mockSliders: Slider[] = [
            {
                id: 1,
                title: 'عروض الصيف الحصرية',
                description: 'خصومات تصل إلى 70% على جميع المنتجات',
                image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
                button_text: 'تسوق الآن',
                button_link: '/shop',
                order: 1,
                is_active: true,
                created_at: '2025-01-15'
            },
            {
                id: 2,
                title: 'مجموعة الشتاء الجديدة',
                description: 'اكتشف أحدث صيحات الموضة للشتاء',
                image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800',
                button_text: 'اكتشف المزيد',
                button_link: '/categories/winter',
                order: 2,
                is_active: true,
                created_at: '2025-01-10'
            },
            {
                id: 3,
                title: 'شحن مجاني',
                description: 'شحن مجاني على جميع الطلبات فوق 500 درهم',
                image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
                button_text: 'ابدأ التسوق',
                button_link: '/shop',
                order: 3,
                is_active: false,
                created_at: '2025-01-05'
            }
        ];
        
        setTimeout(() => {
            setSliders(mockSliders);
            setLoading(false);
        }, 1000);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (editingSlider) {
            // تحديث شريحة موجودة
            setSliders(sliders.map(slider => 
                slider.id === editingSlider.id 
                    ? { ...slider, ...formData, order: slider.order }
                    : slider
            ));
            setEditingSlider(null);
        } else {
            // إضافة شريحة جديدة
            const newSlider: Slider = {
                ...formData,
                id: Math.max(...sliders.map(s => s.id), 0) + 1,
                order: sliders.length + 1,
                created_at: new Date().toISOString().split('T')[0]
            };
            setSliders([...sliders, newSlider]);
        }
        
        setFormData({
            title: '',
            description: '',
            image: '',
            button_text: '',
            button_link: '',
            is_active: true
        });
        setShowAddForm(false);
    };

    const handleEdit = (slider: Slider) => {
        setFormData({
            title: slider.title,
            description: slider.description,
            image: slider.image,
            button_text: slider.button_text || '',
            button_link: slider.button_link || '',
            is_active: slider.is_active
        });
        setEditingSlider(slider);
        setShowAddForm(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('هل أنت متأكد من حذف هذه الشريحة؟')) {
            setSliders(sliders.filter(slider => slider.id !== id));
        }
    };

    const toggleActive = (id: number) => {
        setSliders(sliders.map(slider =>
            slider.id === id ? { ...slider, is_active: !slider.is_active } : slider
        ));
    };

    const moveSlider = (id: number, direction: 'up' | 'down') => {
        const sortedSliders = [...sliders].sort((a, b) => a.order - b.order);
        const currentIndex = sortedSliders.findIndex(slider => slider.id === id);
        
        if (
            (direction === 'up' && currentIndex === 0) ||
            (direction === 'down' && currentIndex === sortedSliders.length - 1)
        ) {
            return;
        }
        
        const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        const temp = sortedSliders[currentIndex].order;
        sortedSliders[currentIndex].order = sortedSliders[newIndex].order;
        sortedSliders[newIndex].order = temp;
        
        setSliders([...sortedSliders]);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6" dir="rtl">
            {/* Header */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">إدارة الشرائح</h1>
                        <p className="text-gray-600 mt-2">إدارة شرائح الصفحة الرئيسية والعروض الترويجية</p>
                    </div>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2"
                    >
                        <Plus size={20} />
                        إضافة شريحة جديدة
                    </button>
                </div>

                {/* إحصائيات سريعة */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">إجمالي الشرائح</p>
                                <p className="text-2xl font-bold text-gray-900">{sliders.length}</p>
                            </div>
                            <ImageIcon className="text-blue-600" size={32} />
                        </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-xl border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">الشرائح النشطة</p>
                                <p className="text-2xl font-bold text-green-600">{sliders.filter(s => s.is_active).length}</p>
                            </div>
                            <Eye className="text-green-600" size={32} />
                        </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-xl border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">الشرائح المخفية</p>
                                <p className="text-2xl font-bold text-red-600">{sliders.filter(s => !s.is_active).length}</p>
                            </div>
                            <EyeOff className="text-red-600" size={32} />
                        </div>
                    </div>
                </div>
            </div>

            {/* نموذج الإضافة/التحديث */}
            {showAddForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-screen overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">
                                {editingSlider ? 'تحديث الشريحة' : 'إضافة شريحة جديدة'}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowAddForm(false);
                                    setEditingSlider(null);
                                    setFormData({
                                        title: '', description: '', image: '', 
                                        button_text: '', button_link: '', is_active: true
                                    });
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    عنوان الشريحة
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    الوصف
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={3}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    رابط الصورة
                                </label>
                                <input
                                    type="url"
                                    value={formData.image}
                                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    نص الزر (اختياري)
                                </label>
                                <input
                                    type="text"
                                    value={formData.button_text}
                                    onChange={(e) => setFormData({...formData, button_text: e.target.value})}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    رابط الزر (اختياري)
                                </label>
                                <input
                                    type="text"
                                    value={formData.button_link}
                                    onChange={(e) => setFormData({...formData, button_link: e.target.value})}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                                    className="ml-2 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                                    شريحة نشطة
                                </label>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center gap-2"
                                >
                                    <Save size={20} />
                                    {editingSlider ? 'تحديث' : 'حفظ'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddForm(false);
                                        setEditingSlider(null);
                                        setFormData({
                                            title: '', description: '', image: '', 
                                            button_text: '', button_link: '', is_active: true
                                        });
                                    }}
                                    className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
                                >
                                    إلغاء
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* قائمة الشرائح */}
            <div className="bg-white rounded-xl border overflow-hidden">
                <div className="px-6 py-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-900">الشرائح الحالية</h2>
                </div>
                
                {sliders.length === 0 ? (
                    <div className="p-8 text-center">
                        <ImageIcon size={48} className="mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600">لا توجد شرائح بعد</p>
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="mt-4 text-blue-600 hover:text-blue-700 font-semibold"
                        >
                            أضف الشريحة الأولى
                        </button>
                    </div>
                ) : (
                    <div className="divide-y">
                        {sliders.sort((a, b) => a.order - b.order).map((slider) => (
                            <div key={slider.id} className="p-6">
                                <div className="flex items-start gap-4">
                                    {/* صورة الشريحة */}
                                    <div className="flex-shrink-0">
                                        <img
                                            src={slider.image}
                                            alt={slider.title}
                                            className="w-32 h-20 object-cover rounded-lg border"
                                        />
                                    </div>
                                    
                                    {/* محتوى الشريحة */}
                                    <div className="flex-grow">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                    {slider.title}
                                                </h3>
                                                <p className="text-gray-600 mb-2">{slider.description}</p>
                                                
                                                {slider.button_text && (
                                                    <div className="flex items-center gap-2 text-sm text-blue-600">
                                                        <span>زر: {slider.button_text}</span>
                                                        {slider.button_link && (
                                                            <span className="text-gray-400">← {slider.button_link}</span>
                                                        )}
                                                    </div>
                                                )}
                                                
                                                <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                                                    <span>الترتيب: {slider.order}</span>
                                                    <span>تاريخ الإنشاء: {slider.created_at}</span>
                                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                                        slider.is_active 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {slider.is_active ? 'نشط' : 'مخفي'}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            {/* أزرار التحكم */}
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => moveSlider(slider.id, 'up')}
                                                    className="p-2 text-gray-400 hover:text-gray-600"
                                                    title="نقل للأعلى"
                                                >
                                                    <ArrowUp size={16} />
                                                </button>
                                                
                                                <button
                                                    onClick={() => moveSlider(slider.id, 'down')}
                                                    className="p-2 text-gray-400 hover:text-gray-600"
                                                    title="نقل للأسفل"
                                                >
                                                    <ArrowDown size={16} />
                                                </button>
                                                
                                                <button
                                                    onClick={() => toggleActive(slider.id)}
                                                    className="p-2 text-gray-400 hover:text-gray-600"
                                                    title={slider.is_active ? 'إخفاء' : 'إظهار'}
                                                >
                                                    {slider.is_active ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                                
                                                <button
                                                    onClick={() => handleEdit(slider)}
                                                    className="p-2 text-blue-600 hover:text-blue-700"
                                                    title="تحديث"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                
                                                <button
                                                    onClick={() => handleDelete(slider.id)}
                                                    className="p-2 text-red-600 hover:text-red-700"
                                                    title="حذف"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
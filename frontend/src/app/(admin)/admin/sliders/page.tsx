'use client';

import React, { useState, useEffect } from 'react';
import { 
    Plus, 
    Edit, 
    Trash2, 
    Eye, 
    EyeOff, 
    Image as ImageIcon,
    Save,
    X,
    Loader2
} from 'lucide-react';

interface Slider {
    id: number;
    title: string;
    description: string;
    image_url: string;
    button_text?: string;
    button_link?: string;
    order: number;
    is_active: boolean;
    created_at: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function SlidersPage() {
    const [sliders, setSliders] = useState<Slider[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingSlider, setEditingSlider] = useState<Slider | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image_url: '',
        button_text: '',
        button_link: '',
        is_active: true
    });

    // جلب الشرائح من قاعدة البيانات
    const fetchSliders = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('api_token') || localStorage.getItem('token');
            
            if (!token) {
                alert('يجب تسجيل الدخول أولاً');
                setLoading(false);
                return;
            }

            const response = await fetch(`${API_BASE_URL}/api/sliders`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'فشل في جلب الشرائح');
            }
            
            const data = await response.json();
            if (data.success && Array.isArray(data.data)) {
                setSliders(data.data);
            } else {
                console.warn('تنسيق غير متوقع للبيانات:', data);
                setSliders([]);
            }
        } catch (error) {
            console.error('خطأ في جلب الشرائح:', error);
            const errorMessage = error instanceof Error ? error.message : 'فشل في جلب الشرائح من الخادم';
            alert(errorMessage);
            setSliders([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSliders();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const token = localStorage.getItem('api_token') || localStorage.getItem('token');
            if (!token) {
                alert('يجب تسجيل الدخول أولاً');
                setSubmitting(false);
                return;
            }
            
            const url = editingSlider 
                ? `${API_BASE_URL}/api/sliders/${editingSlider.id}`
                : `${API_BASE_URL}/api/sliders`;
            
            const method = editingSlider ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'فشل في حفظ الشريحة');
            }

            alert(data.message || (editingSlider ? 'تم تحديث الشريحة بنجاح' : 'تم إضافة الشريحة بنجاح'));
            
            // إعادة جلب الشرائح
            await fetchSliders();
            
            // إغلاق النموذج
            setShowAddForm(false);
            setEditingSlider(null);
            setFormData({
                title: '',
                description: '',
                image_url: '',
                button_text: '',
                button_link: '',
                is_active: true
            });
        } catch (err) {
            const error = err as Error;
            console.error('خطأ في حفظ الشريحة:', error);
            alert(error.message || 'فشل في حفظ الشريحة');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (slider: Slider) => {
        setFormData({
            title: slider.title,
            description: slider.description,
            image_url: slider.image_url,
            button_text: slider.button_text || '',
            button_link: slider.button_link || '',
            is_active: slider.is_active
        });
        setEditingSlider(slider);
        setShowAddForm(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('هل أنت متأكد من حذف هذه الشريحة؟')) return;

        try {
            const token = localStorage.getItem('api_token') || localStorage.getItem('token');
            if (!token) {
                alert('يجب تسجيل الدخول أولاً');
                return;
            }
            
            const response = await fetch(`${API_BASE_URL}/api/sliders/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'فشل في حذف الشريحة');
            }

            alert(data.message || 'تم حذف الشريحة بنجاح');
            await fetchSliders();
        } catch (err) {
            const error = err as Error;
            console.error('خطأ في حذف الشريحة:', error);
            alert(error.message || 'فشل في حذف الشريحة');
        }
    };

    const toggleActive = async (id: number) => {
        try {
            const token = localStorage.getItem('api_token') || localStorage.getItem('token');
            if (!token) {
                alert('يجب تسجيل الدخول أولاً');
                return;
            }
            
            const response = await fetch(`${API_BASE_URL}/api/sliders/${id}/toggle-active`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'فشل في تغيير حالة الشريحة');
            }

            await fetchSliders();
        } catch (err) {
            const error = err as Error;
            console.error('خطأ في تغيير الحالة:', error);
            alert(error.message || 'فشل في تغيير حالة الشريحة');
        }
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
                                        title: '', description: '', image_url: '', 
                                        button_text: '', button_link: '', is_active: true
                                    });
                                }}
                                className="text-gray-500 hover:text-gray-700"
                                disabled={submitting}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    عنوان الشريحة <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                    disabled={submitting}
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
                                    disabled={submitting}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    رابط الصورة <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="url"
                                    value={formData.image_url}
                                    onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                    disabled={submitting}
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
                                    disabled={submitting}
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
                                    disabled={submitting}
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                                    className="ml-2 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                    disabled={submitting}
                                />
                                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                                    شريحة نشطة
                                </label>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} />
                                            جارٍ الحفظ...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={20} />
                                            {editingSlider ? 'تحديث' : 'حفظ'}
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddForm(false);
                                        setEditingSlider(null);
                                        setFormData({
                                            title: '', description: '', image_url: '', 
                                            button_text: '', button_link: '', is_active: true
                                        });
                                    }}
                                    disabled={submitting}
                                    className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50"
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
                            <div key={slider.id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-start gap-4">
                                    {/* صورة الشريحة */}
                                    <div className="flex-shrink-0">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={slider.image_url}
                                            alt={slider.title}
                                            className="w-40 h-24 object-cover rounded-lg border shadow-sm"
                                        />
                                    </div>
                                    
                                    {/* محتوى الشريحة */}
                                    <div className="flex-grow">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-grow">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                    {slider.title}
                                                </h3>
                                                <p className="text-gray-600 mb-2">{slider.description}</p>
                                                
                                                {slider.button_text && (
                                                    <div className="flex items-center gap-2 text-sm text-blue-600 mb-3">
                                                        <span className="font-medium">زر: {slider.button_text}</span>
                                                        {slider.button_link && (
                                                            <span className="text-gray-400">← {slider.button_link}</span>
                                                        )}
                                                    </div>
                                                )}
                                                
                                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <span className="font-medium">الترتيب:</span>
                                                        {slider.order}
                                                    </span>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                        slider.is_active 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {slider.is_active ? 'نشط' : 'مخفي'}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            {/* أزرار التحكم */}
                                            <div className="flex items-center gap-1 mr-4">
                                                <button
                                                    onClick={() => toggleActive(slider.id)}
                                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                                    title={slider.is_active ? 'إخفاء' : 'إظهار'}
                                                >
                                                    {slider.is_active ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                                
                                                <button
                                                    onClick={() => handleEdit(slider)}
                                                    className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="تحديث"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                
                                                <button
                                                    onClick={() => handleDelete(slider.id)}
                                                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="حذف"
                                                >
                                                    <Trash2 size={18} />
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
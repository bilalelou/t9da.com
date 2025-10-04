"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Eye, Save, Image as ImageIcon } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface SliderForm {
    title: string;
    description: string;
    image_url: string;
    button_text: string;
    button_link: string;
    is_active: boolean;
}

export default function SliderFormPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sliderId = searchParams.get('id');
    const isEdit = !!sliderId;

    const [formData, setFormData] = useState<SliderForm>({
        title: '',
        description: '',
        image_url: '',
        button_text: '',
        button_link: '',
        is_active: true
    });

    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [preview, setPreview] = useState(false);

    useEffect(() => {
        if (isEdit && sliderId) {
            fetchSlider(sliderId);
        }
    }, [isEdit, sliderId]);

    const fetchSlider = async (id: string) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('api_token') || localStorage.getItem('token');
            if (!token) {
                alert('يجب تسجيل الدخول أولاً');
                router.push('/login');
                return;
            }

            const response = await fetch(`${API_BASE_URL}/api/sliders/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'فشل في جلب بيانات الشريحة');
            }

            setFormData({
                title: data.data.title || '',
                description: data.data.description || '',
                image_url: data.data.image_url || '',
                button_text: data.data.button_text || '',
                button_link: data.data.button_link || '',
                is_active: data.data.is_active || false
            });
        } catch (error) {
            console.error('خطأ في جلب الشريحة:', error);
            alert('فشل في جلب بيانات الشريحة');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const token = localStorage.getItem('api_token') || localStorage.getItem('token');
            if (!token) {
                alert('يجب تسجيل الدخول أولاً');
                router.push('/login');
                return;
            }

            const url = isEdit 
                ? `${API_BASE_URL}/api/sliders/${sliderId}`
                : `${API_BASE_URL}/api/sliders`;
            
            const method = isEdit ? 'PUT' : 'POST';

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

            alert(data.message || (isEdit ? 'تم تحديث الشريحة بنجاح' : 'تم إضافة الشريحة بنجاح'));
            router.push('/admin/sliders');
        } catch (error) {
            console.error('خطأ في حفظ الشريحة:', error);
            const errorMessage = error instanceof Error ? error.message : 'فشل في حفظ الشريحة';
            alert(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">جار تحميل البيانات...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.push('/admin/sliders')}
                                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                            >
                                <ArrowLeft size={20} />
                                <span>العودة للقائمة</span>
                            </button>
                            <div className="h-6 w-px bg-gray-300"></div>
                            <h1 className="text-xl font-bold text-gray-800">
                                {isEdit ? 'تعديل الشريحة' : 'إضافة شريحة جديدة'}
                            </h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setPreview(!preview)}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                            >
                                <Eye size={18} />
                                {preview ? 'إخفاء المعاينة' : 'معاينة'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 max-w-7xl py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Form */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                            <h2 className="text-2xl font-bold">تفاصيل الشريحة</h2>
                            <p className="text-blue-100 mt-2">قم بملء المعلومات المطلوبة لإنشاء شريحة جذابة</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    عنوان الشريحة *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="أدخل عنوان الشريحة..."
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    الوصف *
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                                    placeholder="أدخل وصف الشريحة..."
                                />
                            </div>

                            {/* Image URL */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    رابط الصورة *
                                </label>
                                <div className="relative">
                                    <input
                                        type="url"
                                        name="image_url"
                                        value={formData.image_url}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                    <ImageIcon size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>

                            {/* Button Text */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    نص الزر
                                </label>
                                <input
                                    type="text"
                                    name="button_text"
                                    value={formData.button_text}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="مثال: تسوق الآن"
                                />
                            </div>

                            {/* Button Link */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    رابط الزر
                                </label>
                                <input
                                    type="url"
                                    name="button_link"
                                    value={formData.button_link}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="https://example.com/page"
                                />
                            </div>

                            {/* Active Status */}
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    name="is_active"
                                    checked={formData.is_active}
                                    onChange={handleInputChange}
                                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                                    تفعيل الشريحة (ستظهر في الموقع)
                                </label>
                            </div>

                            {/* Submit Button */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                                >
                                    {submitting ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    ) : (
                                        <>
                                            <Save size={20} />
                                            {isEdit ? 'تحديث الشريحة' : 'إضافة الشريحة'}
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => router.push('/admin/sliders')}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    إلغاء
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Preview */}
                    {preview && (
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6">
                                <h3 className="text-2xl font-bold">معاينة الشريحة</h3>
                                <p className="text-purple-100 mt-2">كيف ستظهر الشريحة في الموقع</p>
                            </div>

                            <div className="p-6">
                                {formData.image_url ? (
                                    <div className="relative h-64 bg-gray-900 rounded-xl overflow-hidden">
                                        <img
                                            src={formData.image_url}
                                            alt={formData.title}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://placehold.co/800x400/333/fff?text=خطأ+في+تحميل+الصورة';
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent"></div>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-6">
                                            <div className="max-w-lg space-y-4">
                                                {formData.title && (
                                                    <h1 className="text-2xl md:text-3xl font-bold leading-tight">
                                                        {formData.title}
                                                    </h1>
                                                )}
                                                {formData.description && (
                                                    <p className="text-lg text-gray-200">
                                                        {formData.description}
                                                    </p>
                                                )}
                                                {formData.button_text && (
                                                    <button className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-gray-900 font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg">
                                                        {formData.button_text}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-64 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
                                        <div className="text-center text-gray-500">
                                            <ImageIcon size={48} className="mx-auto mb-4" />
                                            <p>أدخل رابط الصورة لرؤية المعاينة</p>
                                        </div>
                                    </div>
                                )}

                                {/* Details */}
                                <div className="mt-6 space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="text-sm font-medium text-gray-600">الحالة:</span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                            formData.is_active 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {formData.is_active ? 'مفعل' : 'غير مفعل'}
                                        </span>
                                    </div>
                                    {formData.button_link && (
                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <span className="text-sm font-medium text-gray-600">رابط الزر:</span>
                                            <span className="text-sm text-blue-600 truncate max-w-xs">
                                                {formData.button_link}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
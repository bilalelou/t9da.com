'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api, { UnauthorizedError } from '@/lib/api';

// Icons
import { Save, LoaderCircle, ArrowRight, Ticket, Percent, Hash, Calendar } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// --- Interfaces ---
interface Coupon {
    id: number;
    code: string;
    type: 'fixed' | 'percent';
    value: number;
    usage_limit: number;
    expires_at: string;
    is_active: boolean;
}

// --- Main Edit Coupon Page Component ---
export default function EditCouponPage() {
    const [coupon, setCoupon] = useState<Coupon | null>(null);
    const [code, setCode] = useState('');
    const [type, setType] = useState<'fixed' | 'percent'>('percent');
    const [value, setValue] = useState('');
    const [usageLimit, setUsageLimit] = useState('');
    const [expiresAt, setExpiresAt] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const { toast } = useToast();
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    React.useEffect(() => {
        if (id) {
            setPageLoading(true);
            api(`/coupons/${id}`)
                .then(data => {
                    const couponData = data.data;
                    setCoupon(couponData);
                    setCode(couponData.code);
                    setType(couponData.type);
                    setValue(String(couponData.value));
                    setUsageLimit(String(couponData.usage_limit));
                    setIsActive(couponData.is_active);
                    setExpiresAt(new Date(couponData.expires_at).toISOString().split('T')[0]);
                })
                .catch(error => {
                    if (error instanceof UnauthorizedError) {
                        router.push('/login');
                    } else {
                        toast({
                            title: "خطأ",
                            description: "لا يمكن العثور على الكوبون.",
                            variant: "destructive",
                        });
                        router.push('/admin/coupons');
                    }
                })
                .finally(() => setPageLoading(false));
        }
    }, [id, router, toast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!code || !value || !usageLimit || !expiresAt) {
            toast({
                title: "خطأ",
                description: "الرجاء ملء جميع الحقول.",
                variant: "destructive",
            });
            return;
        }

        const formData = new FormData();
        formData.append('code', code);
        formData.append('type', type);
        formData.append('value', value);
        formData.append('usage_limit', usageLimit);
        formData.append('expires_at', expiresAt);
        formData.append('is_active', isActive ? '1' : '0');
        formData.append('_method', 'PUT');

        setLoading(true);
        try {
            const result = await api(`/coupons/${id}`, {
                method: 'POST',
                body: formData,
            });
            toast({
                title: "نجاح",
                description: result.message || 'تم تحديث الكوبون بنجاح!',
            });
            router.push('/admin/coupons');
        } catch (error) {
            if (error instanceof UnauthorizedError) {
                router.push('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) {
        return <div className="flex justify-center items-center h-64"><LoaderCircle className="animate-spin text-blue-600" size={32} /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                 <a href="/admin/coupons" className="text-gray-600 hover:text-blue-700">
                    <ArrowRight size={20} />
                </a>
                <h1 className="text-2xl font-bold text-gray-900">تعديل الكوبون: <span className="text-blue-600">{coupon?.code}</span></h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Coupon Code */}
                    <div className="space-y-2">
                        <label htmlFor="code" className="text-sm font-semibold text-gray-700">كود الكوبون</label>
                        <div className="flex items-center border border-gray-300 rounded-lg px-3">
                            <Ticket className="text-gray-400" size={18}/>
                            <input type="text" id="code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="مثال: RAMADAN25" className="w-full p-2.5 bg-transparent border-0 focus:ring-0"/>
                        </div>
                    </div>

                    {/* Coupon Type */}
                    <div className="space-y-2">
                        <label htmlFor="type" className="text-sm font-semibold text-gray-700">نوع الخصم</label>
                        <select id="type" value={type} onChange={(e) => setType(e.target.value as 'fixed' | 'percent')} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                            <option value="percent">نسبة مئوية (%)</option>
                            <option value="fixed">مبلغ ثابت (د.م.)</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Value */}
                    <div className="space-y-2">
                        <label htmlFor="value" className="text-sm font-semibold text-gray-700">قيمة الخصم</label>
                        <div className="flex items-center border border-gray-300 rounded-lg px-3">
                            {type === 'percent' ? <Percent className="text-gray-400" size={18}/> : <span className="text-gray-500 font-semibold">د.م.</span>}
                            <input type="number" id="value" value={value} onChange={(e) => setValue(e.target.value)} placeholder={type === 'percent' ? 'مثال: 10' : 'مثال: 50'} className="w-full p-2.5 bg-transparent border-0 focus:ring-0"/>
                        </div>
                    </div>

                    {/* Usage Limit */}
                    <div className="space-y-2">
                        <label htmlFor="usage_limit" className="text-sm font-semibold text-gray-700">حد الاستخدام (لكل مستخدم)</label>
                        <div className="flex items-center border border-gray-300 rounded-lg px-3">
                            <Hash className="text-gray-400" size={18}/>
                            <input type="number" id="usage_limit" value={usageLimit} onChange={(e) => setUsageLimit(e.target.value)} placeholder="مثال: 1" className="w-full p-2.5 bg-transparent border-0 focus:ring-0"/>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Expiration Date */}
                    <div className="space-y-2">
                        <label htmlFor="expires_at" className="text-sm font-semibold text-gray-700">تاريخ انتهاء الصلاحية</label>
                        <div className="flex items-center border border-gray-300 rounded-lg px-3">
                            <Calendar className="text-gray-400" size={18}/>
                            <input type="date" id="expires_at" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} className="w-full p-2.5 bg-transparent border-0 focus:ring-0"/>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                        <label htmlFor="is_active" className="text-sm font-semibold text-gray-700">الحالة</label>
                        <select
                            id="is_active"
                            value={isActive ? '1' : '0'}
                            onChange={(e) => setIsActive(e.target.value === '1')}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="1">نشط</option>
                            <option value="0">غير نشط</option>
                        </select>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                    <button type="submit" disabled={loading} className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed">
                        {loading ? <LoaderCircle className="animate-spin" size={18}/> : <Save size={18}/>}
                        <span>{loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
}

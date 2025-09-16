'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api, { UnauthorizedError } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { LoaderCircle, Save, ArrowRight, User, Mail, Key, Shield } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface User {
    id: number;
    name: string;
    email: string;
    is_active: boolean;
    roles: { name: string }[];
}

export default function EditUserPage() {
    const [user, setUser] = useState<User | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const { toast } = useToast();
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    useEffect(() => {
        if (id) {
            setPageLoading(true);
            api(`/users/${id}`)
                .then(data => {
                    setUser(data);
                    setName(data.name);
                    setEmail(data.email);
                    setRole(data.roles[0]?.name || '');
                    setIsActive(data.is_active);
                })
                .catch(error => {
                    if (error instanceof UnauthorizedError) router.push('/login');
                    else {
                        toast({ title: "خطأ", description: "لا يمكن العثور على المستخدم.", variant: "destructive" });
                        router.push('/admin/users');
                    }
                })
                .finally(() => setPageLoading(false));
        }
    }, [id, router, toast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await api(`/users/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ name, email, role, is_active: isActive }),
            });
            toast({ title: "نجاح", description: result.message || 'تم تحديث المستخدم بنجاح!' });
            router.push('/admin/users');
        } catch (error) {
            if (error instanceof UnauthorizedError) router.push('/login');
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
                <a href="/admin/users" className="text-gray-600 hover:text-blue-700"><ArrowRight size={20} /></a>
                <h1 className="text-2xl font-bold text-gray-900">تعديل المستخدم: <span className="text-blue-600">{user?.name}</span></h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">الاسم</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="pl-10" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">البريد الإلكتروني</Label>
                         <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="role">الدور</Label>
                        <Select value={role} onValueChange={setRole}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="اختر دورًا" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="customer">Customer</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>الحالة</Label>
                        <div className="flex items-center space-x-2">
                            <Switch id="is_active" checked={isActive} onCheckedChange={setIsActive} />
                            <Label htmlFor="is_active">{isActive ? 'نشط' : 'غير نشط'}</Label>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button type="submit" disabled={loading} className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-blue-700 disabled:bg-blue-300">
                        {loading ? <LoaderCircle className="animate-spin" size={18}/> : <Save size={18}/>}
                        <span>{loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
}

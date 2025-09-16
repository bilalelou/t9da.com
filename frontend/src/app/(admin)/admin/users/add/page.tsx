'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import api, { UnauthorizedError } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { LoaderCircle, Save, ArrowRight, User, Mail, Key, Shield } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AddUserPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('customer');
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await api('/users', {
                method: 'POST',
                body: JSON.stringify({ name, email, password, role }),
            });
            toast({ title: "نجاح", description: result.message || 'تم إنشاء المستخدم بنجاح!' });
            router.push('/admin/users');
        } catch (error) {
            if (error instanceof UnauthorizedError) router.push('/login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <a href="/admin/users" className="text-gray-600 hover:text-blue-700"><ArrowRight size={20} /></a>
                <h1 className="text-2xl font-bold text-gray-900">إضافة مستخدم جديد</h1>
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
                        <Label htmlFor="password">كلمة المرور</Label>
                         <div className="relative">
                            <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" />
                        </div>
                    </div>
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
                </div>

                <div className="flex justify-end pt-4">
                    <button type="submit" disabled={loading} className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-blue-700 disabled:bg-blue-300">
                        {loading ? <LoaderCircle className="animate-spin" size={18}/> : <Save size={18}/>}
                        <span>{loading ? 'جاري الإنشاء...' : 'إنشاء المستخدم'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
}

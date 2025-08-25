# إعداد الواجهة الأمامية مع Laravel Sanctum

## 1. إنشاء ملف .env.local

قم بإنشاء ملف `.env.local` في مجلد `frontend` مع المحتوى التالي:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

## 2. إعداد Axios أو Fetch مع Credentials

### باستخدام Axios:

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// إضافة interceptor للتوكن
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### باستخدام Fetch:

```typescript
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  
  const config: RequestInit = {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  return fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, config);
};
```

## 3. دالة تسجيل الدخول

```typescript
const login = async (email: string, password: string) => {
  try {
    // أولاً، احصل على CSRF token
    await fetch('http://127.0.0.1:8000/sanctum/csrf-cookie', {
      credentials: 'include',
    });

    // ثم قم بتسجيل الدخول
    const response = await fetch('http://127.0.0.1:8000/api/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return data;
    } else {
      throw new Error('فشل تسجيل الدخول');
    }
  } catch (error) {
    console.error('خطأ في تسجيل الدخول:', error);
    throw error;
  }
};
```

## 4. دالة تسجيل الخروج

```typescript
const logout = async () => {
  try {
    const token = localStorage.getItem('token');
    
    await fetch('http://127.0.0.1:8000/api/logout', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    localStorage.removeItem('token');
    localStorage.removeItem('user');
  } catch (error) {
    console.error('خطأ في تسجيل الخروج:', error);
  }
};
```

## 5. إعداد Context أو State Management

```typescript
// AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // تحقق من وجود مستخدم مسجل
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // تنفيذ دالة تسجيل الدخول
    const data = await loginUser(email, password);
    setUser(data.user);
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

## 6. استخدام في الصفحات

```typescript
// login/page.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
      // إعادة التوجيه بعد تسجيل الدخول
    } catch (error) {
      console.error('خطأ في تسجيل الدخول:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="البريد الإلكتروني"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="كلمة المرور"
        required
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
      </button>
    </form>
  );
}
```

## ملاحظات مهمة

- تأكد من أن `withCredentials: true` مضبوط في Axios
- تأكد من أن `credentials: 'include'` مضبوط في Fetch
- تأكد من أن CSRF token يتم الحصول عليه قبل تسجيل الدخول
- تأكد من أن التوكن يتم إرساله في header `Authorization`
- تأكد من أن النطاقات مضبوطة بشكل صحيح في Laravel

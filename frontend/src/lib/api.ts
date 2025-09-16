import { toast } from "@/components/ui/use-toast";

export class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

const api = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('auth_token');

  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    ...options,
  };

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, defaultOptions);

  if (response.status === 401) {
    localStorage.removeItem('auth_token');
    throw new UnauthorizedError();
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
    toast({
        title: "Error",
        description: errorData.message || "Something went wrong!",
        variant: "destructive",
    });
    throw new Error(errorData.message || 'Request failed');
  }

  if (response.headers.get('Content-Length') === '0' || response.status === 204) {
    return null;
  }

  return response.json();
};

export default api;

// --- Checkout API Functions ---
export const createOrder = async (orderData: {
  items: any[];
  shipping_address: any;
  payment_method: string;
  subtotal: number;
  shipping_cost: number;
  discount: number;
  total: number;
  coupon_code?: string;
}, token: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'فشل في إنشاء الطلب' }));
    throw new Error(errorData.message || 'فشل في إنشاء الطلب');
  }

  return response.json();
};

export const validateCoupon = async (couponCode: string, subtotal: number, token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/coupons/validate`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ code: couponCode, subtotal }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'كود الخصم غير صالح' }));
    throw new Error(errorData.message || 'كود الخصم غير صالح');
  }

  return response.json();
};

export const getShippingCosts = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shipping/costs`, {
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('فشل في جلب تكاليف الشحن');
  }

  return response.json();
};

import { useState, useEffect } from 'react';

interface ShippingCostsData {
  shippingCosts: Record<string, number>;
  cities: string[];
  loading: boolean;
  error: string | null;
}

export const useShippingCosts = (): ShippingCostsData => {
  const [shippingCosts, setShippingCosts] = useState<Record<string, number>>({});
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShippingCosts = async () => {
      try {
        setLoading(true);
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
        const response = await fetch(`${API_BASE_URL}/shipping-costs`);
        const result = await response.json();
        
        if (result.success) {
          setShippingCosts(result.data);
          setCities(result.cities);
          setError(null);
        } else {
          setError(result.message || 'فشل في جلب تكاليف الشحن');
        }
      } catch (err) {
        setError('خطأ في الاتصال بالخادم');
        console.error('خطأ في جلب تكاليف الشحن:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchShippingCosts();
  }, []);

  return { shippingCosts, cities, loading, error };
};
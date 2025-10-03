'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, MapPin, Clock, Truck, Loader2 } from 'lucide-react';
import AddCityModal from './AddCityModal';
import { toast } from '@/components/ui/use-toast';

interface City {
  id: number;
  name: string;
  price: number;
  duration: string;
  is_active: boolean;
}

export default function ShoppingPage() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCity, setNewCity] = useState({ name: '', price: 0, duration: '' });
  const [saving, setSaving] = useState(false);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(500);
  const [savingThreshold, setSavingThreshold] = useState(false);

  useEffect(() => {
    fetchCities();
    fetchFreeShippingThreshold();
  }, []);

  const fetchCities = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('api_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cities`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        setCities(result.data || []);
      }
    } catch (error) {
      console.error('خطأ في جلب المدن:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFreeShippingThreshold = async () => {
    try {
      const token = localStorage.getItem('api_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        const threshold = result.data?.find(s => s.key === 'shipping.free_shipping_threshold');
        if (threshold) {
          setFreeShippingThreshold(threshold.value);
        }
      }
    } catch (error) {
      console.error('خطأ في جلب إعدادات الشحن المجاني:', error);
    }
  };

  const updateFreeShippingThreshold = async () => {
    try {
      setSavingThreshold(true);
      const token = localStorage.getItem('api_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          key: 'shipping.free_shipping_threshold',
          value: freeShippingThreshold,
          type: 'number',
          group: 'shipping',
          description: 'الحد الأدنى للشحن المجاني'
        })
      });
      
      if (response.ok) {
        toast({
          title: 'تم الحفظ بنجاح',
          description: 'تم حفظ إعدادات الشحن المجاني بنجاح',
        });
      }
    } catch (error) {
      console.error('خطأ في حفظ إعدادات الشحن المجاني:', error);
    } finally {
      setSavingThreshold(false);
    }
  };

  const handleEditCity = (city: City) => {
    setEditingCity({ ...city });
  };

  const handleSaveEdit = async () => {
    if (!editingCity) return;
    
    try {
      setSaving(true);
      const token = localStorage.getItem('api_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cities/${editingCity.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: editingCity.name,
          price: editingCity.price,
          duration: editingCity.duration,
          is_active: editingCity.is_active
        })
      });
      
      if (response.ok) {
        await fetchCities();
        setEditingCity(null);
      }
    } catch (error) {
      console.error('خطأ في حفظ المدينة:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCity = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذه المدينة؟')) return;
    
    try {
      const token = localStorage.getItem('api_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cities/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        await fetchCities();
      }
    } catch (error) {
      console.error('خطأ في حذف المدينة:', error);
    }
  };

  const handleAddCity = async () => {
    if (!newCity.name || newCity.price <= 0 || !newCity.duration) return;
    
    try {
      setSaving(true);
      const token = localStorage.getItem('api_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cities`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: newCity.name,
          price: newCity.price,
          duration: newCity.duration,
          is_active: true
        })
      });
      
      if (response.ok) {
        await fetchCities();
        setNewCity({ name: '', price: 0, duration: '' });
        setShowAddForm(false);
      }
    } catch (error) {
      console.error('خطأ في إضافة المدينة:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Truck className="text-blue-600" />
                إعدادات التوصيل
              </h1>
              <p className="mt-2 text-gray-600">
                إدارة المدن وأسعار ومدة التوصيل
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              إضافة مدينة
            </button>
          </div>
        </div>

        {/* Free Shipping Settings */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Truck className="text-green-600 w-5 h-5" />
              إعدادات الشحن المجاني
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الحد الأدنى للشحن المجاني (درهم)
              </label>
              <input
                type="number"
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="500"
                min="0"
              />
              <p className="text-xs text-gray-500 mt-1">
                الطلبات التي تزيد عن هذا المبلغ ستحصل على شحن مجاني
              </p>
            </div>
            <button
              onClick={updateFreeShippingThreshold}
              disabled={savingThreshold}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {savingThreshold ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  حفظ
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin ml-3" />
              <span className="text-gray-600">جاري تحميل المدن...</span>
            </div>
          ) : (
            <>
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <MapPin className="text-green-600 w-5 h-5" />
                  قائمة المدن ({cities.length})
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        المدينة
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        سعر التوصيل (درهم)
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        مدة التوصيل
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {cities.map((city) => (
                      <tr key={city.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingCity?.id === city.id ? (
                            <input
                              type="text"
                              value={editingCity.name}
                              onChange={(e) => setEditingCity({ ...editingCity, name: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          ) : (
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 text-gray-400 ml-2" />
                              <span className="text-sm font-medium text-gray-900">{city.name}</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingCity?.id === city.id ? (
                            <input
                              type="number"
                              value={editingCity.price}
                              onChange={(e) => setEditingCity({ ...editingCity, price: Number(e.target.value) })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          ) : (
                            <span className="text-sm text-gray-900 font-medium">{city.price} درهم</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingCity?.id === city.id ? (
                            <input
                              type="text"
                              value={editingCity.duration}
                              onChange={(e) => setEditingCity({ ...editingCity, duration: e.target.value })}
                              placeholder="مثال: 1-2 أيام"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          ) : (
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 text-gray-400 ml-2" />
                              <span className="text-sm text-gray-600">{city.duration}</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingCity?.id === city.id ? (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={handleSaveEdit}
                                disabled={saving}
                                className="text-green-600 hover:text-green-900 p-1 disabled:opacity-50"
                              >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={() => setEditingCity(null)}
                                className="text-red-600 hover:text-red-900 p-1"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEditCity(city)}
                                className="text-blue-600 hover:text-blue-900 p-1"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteCity(city.id)}
                                className="text-red-600 hover:text-red-900 p-1"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        <AddCityModal
          showAddForm={showAddForm}
          setShowAddForm={setShowAddForm}
          newCity={newCity}
          setNewCity={setNewCity}
          handleAddCity={handleAddCity}
          saving={saving}
        />
      </div>
    </div>
  );
}
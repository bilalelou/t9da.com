'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, MapPin, Clock, Truck } from 'lucide-react';

interface City {
  id: number;
  name: string;
  price: number;
  duration: string;
}

export default function ShoppingPage() {
  const [cities, setCities] = useState<City[]>([
    { id: 1, name: 'الدار البيضاء', price: 30, duration: '1-2 أيام' },
    { id: 2, name: 'الرباط', price: 35, duration: '1-3 أيام' },
    { id: 3, name: 'مراكش', price: 45, duration: '2-4 أيام' },
    { id: 4, name: 'فاس', price: 40, duration: '2-3 أيام' },
    { id: 5, name: 'طنجة', price: 50, duration: '3-5 أيام' },
  ]);

  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCity, setNewCity] = useState({ name: '', price: 0, duration: '' });

  const handleEditCity = (city: City) => {
    setEditingCity({ ...city });
  };

  const handleSaveEdit = () => {
    if (editingCity) {
      setCities(cities.map(city => 
        city.id === editingCity.id ? editingCity : city
      ));
      setEditingCity(null);
    }
  };

  const handleDeleteCity = (id: number) => {
    setCities(cities.filter(city => city.id !== id));
  };

  const handleAddCity = () => {
    if (newCity.name && newCity.price > 0 && newCity.duration) {
      const newId = Math.max(...cities.map(c => c.id), 0) + 1;
      setCities([...cities, { id: newId, ...newCity }]);
      setNewCity({ name: '', price: 0, duration: '' });
      setShowAddForm(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
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

        {/* Cities List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
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
                            className="text-green-600 hover:text-green-900 p-1"
                          >
                            <Save className="w-4 h-4" />
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
        </div>

        {/* Add City Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">إضافة مدينة جديدة</h3>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setNewCity({ name: '', price: 0, duration: '' });
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      اسم المدينة
                    </label>
                    <input
                      type="text"
                      value={newCity.name}
                      onChange={(e) => setNewCity({ ...newCity, name: e.target.value })}
                      placeholder="أدخل اسم المدينة"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      سعر التوصيل (درهم)
                    </label>
                    <input
                      type="number"
                      value={newCity.price}
                      onChange={(e) => setNewCity({ ...newCity, price: Number(e.target.value) })}
                      placeholder="0"
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      مدة التوصيل
                    </label>
                    <input
                      type="text"
                      value={newCity.duration}
                      onChange={(e) => setNewCity({ ...newCity, duration: e.target.value })}
                      placeholder="مثال: 1-2 أيام"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleAddCity}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    إضافة المدينة
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setNewCity({ name: '', price: 0, duration: '' });
                    }}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Statistics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي المدن</p>
                <p className="text-3xl font-bold text-gray-900">{cities.length}</p>
              </div>
              <MapPin className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">متوسط سعر التوصيل</p>
                <p className="text-3xl font-bold text-gray-900">
                  {cities.length > 0 ? Math.round(cities.reduce((sum, city) => sum + city.price, 0) / cities.length) : 0} درهم
                </p>
              </div>
              <Truck className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">أقل سعر توصيل</p>
                <p className="text-3xl font-bold text-gray-900">
                  {cities.length > 0 ? Math.min(...cities.map(city => city.price)) : 0} درهم
                </p>
              </div>
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { X, Plus, Loader2 } from 'lucide-react';

interface AddCityModalProps {
  showAddForm: boolean;
  setShowAddForm: (show: boolean) => void;
  newCity: { name: string; price: number; duration: string };
  setNewCity: (city: { name: string; price: number; duration: string }) => void;
  handleAddCity: () => void;
  saving: boolean;
}

export default function AddCityModal({
  showAddForm,
  setShowAddForm,
  newCity,
  setNewCity,
  handleAddCity,
  saving
}: AddCityModalProps) {
  if (!showAddForm) return null;

  return (
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="مثال: الدار البيضاء"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="30"
                min="0"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="1-2 أيام"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewCity({ name: '', price: 0, duration: '' });
              }}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              إلغاء
            </button>
            <button
              onClick={handleAddCity}
              disabled={saving || !newCity.name || newCity.price <= 0 || !newCity.duration}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  إضافة
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
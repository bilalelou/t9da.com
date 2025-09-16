'use client';

import React, { useState, useEffect } from "react";

interface Address {
  id: string;
  type: "home" | "work" | "other";
  name: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  district: string;
  postalCode: string;
  isDefault: boolean;
}

const initialAddresses: Address[] = [
  {
    id: "1",
    type: "home",
    name: "المنزل الرئيسي",
    fullName: "عبدالله الفهيد",
    phone: "+966 50 123 4567",
    street: "شارع الملك فهد، مبنى 123",
    city: "الرياض",
    district: "العليا",
    postalCode: "12345",
    isDefault: true,
  },
  {
    id: "2",
    type: "work",
    name: "مكتب العمل",
    fullName: "عبدالله الفهيد",
    phone: "+966 50 123 4567",
    street: "برج المملكة، الطابق 20",
    city: "الرياض",
    district: "الملز",
    postalCode: "12346",
    isDefault: false,
  },
  {
    id: "3",
    type: "other",
    name: "استراحة العائلة",
    fullName: "محمد الفهيد",
    phone: "+966 55 987 6543",
    street: "طريق الثمامة، فيلا 45",
    city: "الرياض",
    district: "الروضة",
    postalCode: "12347",
    isDefault: false,
  },
];

function getTypeText(type: Address["type"]) {
  if (type === "home") return "المنزل";
  if (type === "work") return "العمل";
  return "أخرى";
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);
  const [form, setForm] = useState<Omit<Address, "id" | "isDefault">>({
    type: "home",
    name: "",
    fullName: "",
    phone: "",
    street: "",
    city: "الرياض",
    district: "",
    postalCode: "",
  });

  useEffect(() => {
    if (editing) setForm(editing);
    else setForm({
      type: "home",
      name: "",
      fullName: "",
      phone: "",
      street: "",
      city: "الرياض",
      district: "",
      postalCode: "",
    });
  }, [editing, showForm]);

  function handleSave() {
    if (editing) {
      setAddresses(addresses.map(a => a.id === editing.id ? { ...editing, ...form } : a));
    } else {
      setAddresses([
        ...addresses,
        { ...form, id: crypto.randomUUID(), isDefault: addresses.length === 0 },
      ]);
    }
    setShowForm(false);
    setEditing(null);
  }

  function handleDelete(id: string) {
    if (window.confirm("هل تريد حذف العنوان؟")) {
      const filtered = addresses.filter(a => a.id !== id);
      if (!filtered.some(a => a.isDefault) && filtered.length)
        filtered.isDefault = true;
      setAddresses(filtered);
    }
  }

  function setDefault(id: string) {
    setAddresses(addresses.map(a => ({ ...a, isDefault: a.id === id })));
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8" dir="rtl">
      {/* الهيدر */}
      <header className="bg-white shadow-sm sticky top-0 z-20 border-b border-gray-200">
        <div className="mx-auto px-4 py-3 flex items-center justify-between max-w-2xl md:max-w-4xl lg:max-w-6xl">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">عناوين الشحن</h1>
            <p className="text-sm text-gray-500">أضف وحرر عناوين التوصيل الخاصة بك بسهولة.</p>
          </div>
          <button
            onClick={() => { setEditing(null); setShowForm(true); }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-semibold shadow-sm hover:bg-indigo-700 transition"
          >
            إضافة عنوان
          </button>
        </div>
      </header>

      {/* الشبكة المتجاوبة */}
      <main className="mx-auto mt-8 px-2 max-w-2xl md:max-w-4xl lg:max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {addresses.map(a => (
            <div key={a.id} className={`bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-between pt-5 pb-4 px-4 transition hover:shadow-lg`}>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${a.isDefault ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'}`}>
                    <span className="text-xl">{a.type === 'home' ? "🏠" : a.type === 'work' ? "💼" : "📍"}</span>
                  </div>
                  <div>
                    <p className="font-bold text-lg text-gray-900">{a.name}</p>
                    <p className="text-xs text-gray-500">{getTypeText(a.type)}</p>
                  </div>
                  {a.isDefault && <span className="ml-auto text-xs bg-indigo-600 text-white px-2 py-1 rounded">{`افتراضي`}</span>}
                </div>
                <div className="text-sm text-gray-700 mt-1 leading-relaxed break-words">
                  <div><b>الاسم:</b> {a.fullName}</div>
                  <div><b>الهاتف:</b> <span dir="ltr">{a.phone}</span></div>
                  <div><b>العنوان:</b> {a.street}</div>
                  <div><b>الحي:</b> {a.district}</div>
                  <div><b>المدينة:</b> {a.city}</div>
                  <div><b>الرمز البريدي:</b> {a.postalCode}</div>
                </div>
              </div>
              <div className="flex gap-2 pt-3 mt-4 border-t border-gray-100">
                <button className="text-xs flex-1 bg-gray-50 py-2 rounded hover:bg-gray-100 transition" onClick={() => { setEditing(a); setShowForm(true); }}>تعديل</button>
                { !a.isDefault && (
                  <button className="text-xs flex-1 bg-indigo-50 text-indigo-700 py-2 rounded hover:bg-indigo-100 transition" onClick={() => setDefault(a.id)}>تعيين افتراضي</button>
                )}
                <button className="text-xs flex-1 bg-red-50 text-red-700 py-2 rounded hover:bg-red-100 transition" onClick={() => handleDelete(a.id)}>حذف</button>
              </div>
            </div>
          ))}
          {/* زر إضافة جديد بشكل بطاقة دائماً في نهاية الشبكة */}
          <button
            className="bg-white border-2 border-dashed border-indigo-200 rounded-2xl flex flex-col items-center justify-center py-8 shadow-sm hover:border-indigo-400 hover:shadow-md transition text-indigo-700"
            onClick={() => { setEditing(null); setShowForm(true); }}
          >
            <span className="text-2xl mb-2">➕</span>
            <span>إضافة عنوان جديد</span>
          </button>
        </div>
        {/* حالة فارغة لو لم توجد عناوين */}
        {addresses.length === 0 &&
          <div className="text-center py-16">
            <span className="block text-4xl mb-6 text-gray-400">📍</span>
            <p className="text-xl font-bold mb-2">لا توجد عناوين حتى الآن</p>
            <button onClick={() => setShowForm(true)} className="bg-indigo-600 text-white py-3 px-6 rounded-xl font-bold shadow hover:bg-indigo-700 transition">إضافة عنوان</button>
          </div>
        }
      </main>

      {/* المودال المتجاوب */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-30 flex items-end justify-center sm:items-center sm:p-10">
          <form
            className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:w-[400px] px-6 py-5 max-h-[96vh] overflow-y-auto flex flex-col space-y-4"
            onSubmit={e => { e.preventDefault(); handleSave(); }}
          >
            <h2 className="text-lg font-bold text-gray-900 mb-2 text-center">{editing ? "تعديل العنوان" : "إضافة عنوان جديد"}</h2>
            <div className="grid grid-cols-1 gap-3">
              <label className="text-sm">
                اسم العنوان
                <input type="text" required className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
                  value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </label>
              <label className="text-sm">
                نوع العنوان
                <select className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
                  value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as Address["type"] }))}>
                  <option value="home">المنزل</option>
                  <option value="work">العمل</option>
                  <option value="other">أخرى</option>
                </select>
              </label>
              <label className="text-sm">
                الاسم الكامل
                <input type="text" required className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
                  value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} />
              </label>
              <label className="text-sm">
                رقم الهاتف
                <input type="tel" required className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base" dir="ltr"
                  value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              </label>
              <label className="text-sm">
                الشارع
                <input type="text" required className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
                  value={form.street} onChange={e => setForm(f => ({ ...f, street: e.target.value }))} />
              </label>
              <label className="text-sm">
                الحي
                <input type="text" required className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
                  value={form.district} onChange={e => setForm(f => ({ ...f, district: e.target.value }))} />
              </label>
              <label className="text-sm">
                المدينة
                <input type="text" required className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
                  value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
              </label>
              <label className="text-sm">
                الرمز البريدي
                <input type="text" required className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
                  value={form.postalCode} onChange={e => setForm(f => ({ ...f, postalCode: e.target.value }))} />
              </label>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition" onClick={() => setShowForm(false)}>إلغاء</button>
              <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition">حفظ</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

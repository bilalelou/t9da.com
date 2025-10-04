export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-yellow-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">جاري التحميل...</h2>
        <p className="text-gray-500">يرجى الانتظار قليلاً</p>
      </div>
    </div>
  );
}
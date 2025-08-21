'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// Define interfaces
interface Section {
  id: string;
  title: string;
  content: string[];
}

// Terms and conditions data
const termsData: Section[] = [
  {
    id: 'general',
    title: 'الشروط العامة',
    content: [
      'مرحباً بكم في متجري، منصة التجارة الإلكترونية الرائدة في المملكة العربية السعودية.',
      'باستخدامكم لموقعنا الإلكتروني أو تطبيقنا المحمول، فإنكم توافقون على الالتزام بهذه الشروط والأحكام.',
      'إذا كنتم لا توافقون على أي من هذه الشروط، يرجى عدم استخدام خدماتنا.',
      'نحتفظ بالحق في تعديل هذه الشروط في أي وقت دون إشعار مسبق.',
      'يُعتبر استمراركم في استخدام الموقع بمثابة موافقة على الشروط المحدثة.'
    ]
  },
  {
    id: 'registration',
    title: 'التسجيل وإنشاء الحساب',
    content: [
      'يجب أن تكونوا بعمر 18 عاماً أو أكثر لإنشاء حساب على موقعنا.',
      'يجب تقديم معلومات صحيحة ودقيقة عند التسجيل.',
      'أنتم مسؤولون عن الحفاظ على سرية كلمة المرور وأمان حسابكم.',
      'يجب إبلاغنا فوراً في حالة الاشتباه في أي استخدام غير مصرح به لحسابكم.',
      'نحتفظ بالحق في تعليق أو إلغاء أي حساب في حالة انتهاك الشروط.'
    ]
  },
  {
    id: 'products',
    title: 'المنتجات والأسعار',
    content: [
      'نسعى لعرض معلومات دقيقة عن المنتجات، لكن لا نضمن خلو المعلومات من الأخطاء.',
      'الأسعار المعروضة تشمل ضريبة القيمة المضافة ما لم يُذكر خلاف ذلك.',
      'نحتفظ بالحق في تعديل الأسعار في أي وقت دون إشعار مسبق.',
      'في حالة وجود خطأ في السعر، سنقوم بإبلاغكم وإعطاؤكم خيار إلغاء الطلب.',
      'توفر المنتجات يخضع للمخزون المتاح وقد يتغير دون إشعار مسبق.'
    ]
  },
  {
    id: 'orders',
    title: 'الطلبات والدفع',
    content: [
      'جميع الطلبات تخضع للقبول من جانبنا ونحتفظ بالحق في رفض أي طلب.',
      'يجب دفع كامل قيمة الطلب قبل الشحن (باستثناء خدمة الدفع عند الاستلام).',
      'نقبل الدفع بالبطاقات الائتمانية، التحويل البنكي، والدفع عند الاستلام.',
      'في حالة فشل عملية الدفع، سيتم إلغاء الطلب تلقائياً.',
      'أسعار الشحن تُحدد حسب الموقع الجغرافي ووزن الطلب.'
    ]
  },
  {
    id: 'shipping',
    title: 'الشحن والتوصيل',
    content: [
      'نقدم خدمات الشحن داخل المملكة العربية السعودية ودول الخليج العربي.',
      'مدة التوصيل تتراوح من 1-7 أيام عمل حسب الموقع ونوع الشحن المختار.',
      'الشحن مجاني للطلبات التي تزيد قيمتها عن 500 ريال سعودي.',
      'العميل مسؤول عن تقديم عنوان صحيح ومفصل للتوصيل.',
      'في حالة عدم وجود المستلم، سيتم إعادة المحاولة أو ترك الطرد في مكان آمن.'
    ]
  },
  {
    id: 'returns',
    title: 'الإرجاع والاستبدال',
    content: [
      'يمكن إرجاع المنتجات خلال 14 يوماً من تاريخ الاستلام.',
      'المنتجات المُرجعة يجب أن تكون في حالتها الأصلية مع العبوة والملحقات.',
      'بعض المنتجات مثل الملابس الداخلية ومستحضرات التجميل غير قابلة للإرجاع.',
      'تكلفة الإرجاع يتحملها العميل ما لم يكن المنتج معيباً أو خاطئاً.',
      'سيتم رد المبلغ خلال 7-14 يوم عمل بعد استلام المنتج المُرجع.'
    ]
  },
  {
    id: 'warranty',
    title: 'الضمان وخدمة ما بعد البيع',
    content: [
      'جميع المنتجات تأتي بضمان الشركة المصنعة حسب الشروط المحددة.',
      'نحن لسنا مسؤولين عن أي أضرار ناتجة عن سوء الاستخدام.',
      'خدمة الصيانة متوفرة من خلال مراكز الخدمة المعتمدة.',
      'يجب الاحتفاظ بفاتورة الشراء لتفعيل الضمان.',
      'الضمان لا يشمل الأضرار الناتجة عن الحوادث أو الاستخدام الخاطئ.'
    ]
  },
  {
    id: 'privacy',
    title: 'الخصوصية وحماية البيانات',
    content: [
      'نحن ملتزمون بحماية خصوصيتكم وأمان بياناتكم الشخصية.',
      'نستخدم بياناتكم فقط لمعالجة الطلبات وتحسين خدماتنا.',
      'لن نشارك معلوماتكم مع أطراف ثالثة دون موافقتكم الصريحة.',
      'نستخدم تقنيات التشفير المتقدمة لحماية معاملاتكم المالية.',
      'يمكنكم طلب حذف بياناتكم أو تعديلها في أي وقت.'
    ]
  },
  {
    id: 'liability',
    title: 'المسؤولية والتعويض',
    content: [
      'مسؤوليتنا تقتصر على قيمة المنتج المشترى فقط.',
      'لسنا مسؤولين عن أي أضرار غير مباشرة أو تبعية.',
      'العميل مسؤول عن استخدام المنتجات وفقاً للتعليمات المرفقة.',
      'في حالة النزاعات، تطبق القوانين السعودية ويكون الاختصاص للمحاكم السعودية.',
      'نحتفظ بالحق في تحديد المسؤولية حسب كل حالة على حدة.'
    ]
  },
  {
    id: 'intellectual',
    title: 'الملكية الفكرية',
    content: [
      'جميع المحتويات على الموقع محمية بحقوق الطبع والنشر.',
      'لا يُسمح بنسخ أو توزيع أي محتوى دون إذن كتابي مسبق.',
      'العلامات التجارية المعروضة هي ملك لأصحابها المعنيين.',
      'أي انتهاك لحقوق الملكية الفكرية سيتم اتخاذ إجراءات قانونية بشأنه.',
      'نحترم حقوق الملكية الفكرية للآخرين ونتوقع نفس الاحترام.'
    ]
  }
];

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState<string>('general');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 space-x-reverse text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600 transition-colors">الرئيسية</Link>
            <span className="text-gray-400">›</span>
            <span className="text-gray-900">الشروط والأحكام</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            الشروط والأحكام
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            يرجى قراءة هذه الشروط والأحكام بعناية قبل استخدام خدماتنا
          </p>
          <div className="mt-6 text-sm text-gray-500">
            آخر تحديث: {new Date().toLocaleDateString('ar-SA', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents - Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">جدول المحتويات</h2>
              <nav className="space-y-2">
                {termsData.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-right px-3 py-2 rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
              
              {/* Contact Info */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">هل لديك أسئلة؟</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>تواصل معنا:</p>
                  <a href="mailto:legal@mystore.com" className="block text-blue-600 hover:text-blue-700">
                    legal@mystore.com
                  </a>
                  <a href="tel:+966501234567" className="block text-blue-600 hover:text-blue-700">
                    +966 50 123 4567
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg">
              {termsData.map((section) => (
                <div
                  key={section.id}
                  className={`p-6 sm:p-8 ${
                    activeSection === section.id ? 'block' : 'hidden'
                  }`}
                >
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                    {section.title}
                  </h2>
                  <div className="space-y-4">
                    {section.content.map((paragraph, index) => (
                      <p key={index} className="text-gray-700 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
              <button
                onClick={() => {
                  const currentIndex = termsData.findIndex(section => section.id === activeSection);
                  if (currentIndex > 0) {
                    setActiveSection(termsData[currentIndex - 1].id);
                  }
                }}
                disabled={termsData.findIndex(section => section.id === activeSection) === 0}
                className="flex items-center justify-center space-x-2 space-x-reverse px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>القسم السابق</span>
              </button>

              <button
                onClick={() => {
                  const currentIndex = termsData.findIndex(section => section.id === activeSection);
                  if (currentIndex < termsData.length - 1) {
                    setActiveSection(termsData[currentIndex + 1].id);
                  }
                }}
                disabled={termsData.findIndex(section => section.id === activeSection) === termsData.length - 1}
                className="flex items-center justify-center space-x-2 space-x-reverse px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>القسم التالي</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Important Notice */}
            <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
              <div className="flex items-start space-x-3 space-x-reverse">
                <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <h3 className="text-lg font-semibold text-yellow-800 mb-2">تنبيه مهم</h3>
                  <p className="text-yellow-700 leading-relaxed">
                    هذه الشروط والأحكام تشكل اتفاقية قانونية ملزمة بينكم وبين متجري. 
                    باستخدام خدماتنا، فإنكم توافقون على جميع الشروط المذكورة أعلاه. 
                    إذا كان لديكم أي استفسارات، يرجى التواصل معنا قبل إتمام أي عملية شراء.
                  </p>
                </div>
              </div>
            </div>

            {/* Related Links */}
            <div className="mt-8 bg-gray-100 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">مواضيع ذات صلة</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  href="/privacy"
                  className="flex items-center space-x-3 space-x-reverse p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
                >
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <div>
                    <h4 className="font-medium text-gray-900">سياسة الخصوصية</h4>
                    <p className="text-sm text-gray-600">كيف نحمي بياناتكم</p>
                  </div>
                </Link>

                <Link
                  href="/contact"
                  className="flex items-center space-x-3 space-x-reverse p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
                >
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <h4 className="font-medium text-gray-900">اتصل بنا</h4>
                    <p className="text-sm text-gray-600">للاستفسارات والدعم</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

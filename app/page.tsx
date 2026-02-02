'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [slug, setSlug] = useState('');

  const handleViewTenant = () => {
    const trimmedSlug = slug.trim();
    if (trimmedSlug) {
      router.push(`/t/${trimmedSlug}`);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            نظام متعدد المستأجرين
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            منصة متكاملة لإدارة الشركات والمستأجرين بكفاءة عالية
          </p>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Admin Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">👨‍💼</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">لوحة التحكم</h2>
              <p className="text-gray-600">
                إدارة الشركات والمستأجرين من لوحة تحكم موحدة
              </p>
            </div>
            <Link
              href="/admin/login"
              className="block w-full bg-blue-600 text-white text-center py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              تسجيل الدخول
            </Link>
          </div>

          {/* Tenant Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">🏢</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">موقع الشركة</h2>
              <p className="text-gray-600">
                تصفح معلومات الشركات والإحصائيات
              </p>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="أدخل رابط الشركة..."
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleViewTenant();
                  }
                }}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-colors text-gray-900 placeholder-gray-500"
              />
              <button
                onClick={handleViewTenant}
                disabled={!slug.trim()}
                className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                عرض الموقع
              </button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">أداء سريع</h3>
            <p className="text-gray-600 text-sm">
              واجهة سريعة وسلسة لتجربة استخدام ممتازة
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">آمن ومحمي</h3>
            <p className="text-gray-600 text-sm">
              نظام أمان متقدم لحماية بياناتك
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">تقارير شاملة</h3>
            <p className="text-gray-600 text-sm">
              إحصائيات وتقارير مفصلة عن نشاطك
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-600">
          <p>© {new Date().getFullYear()} نظام متعدد المستأجرين. جميع الحقوق محفوظة.</p>
        </footer>
      </div>
    </div>
  );
}

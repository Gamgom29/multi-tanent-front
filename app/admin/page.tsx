'use client';

import Link from 'next/link';
import Card from '@/components/ui/Card';

export default function AdminHomePage() {

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">لوحة التحكم الرئيسية</h1>
        <p className="text-gray-600 mt-1">مرحباً بك في لوحة تحكم المشرف</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/admin/tenants">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <div className="text-center p-6">
              <div className="text-5xl mb-4">🏢</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">الشركات</h3>
              <p className="text-gray-600 text-sm">
                إدارة وعرض جميع الشركات والمستأجرين
              </p>
            </div>
          </Card>
        </Link>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full opacity-50">
          <div className="text-center p-6">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">الإحصائيات</h3>
            <p className="text-gray-600 text-sm">
              نظرة عامة على إحصائيات النظام
            </p>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full opacity-50">
          <div className="text-center p-6">
            <div className="text-5xl mb-4">👥</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">المستخدمون</h3>
            <p className="text-gray-600 text-sm">
              إدارة المستخدمين والصلاحيات
            </p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">إحصائيات سريعة</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">إجمالي الشركات</span>
              <span className="text-lg font-bold text-gray-900">-</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">إجمالي العملاء</span>
              <span className="text-lg font-bold text-gray-900">-</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">إجمالي الفواتير</span>
              <span className="text-lg font-bold text-gray-900">-</span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">إجراءات سريعة</h3>
          <div className="space-y-3">
            <Link
              href="/admin/tenants"
              className="block w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center font-medium"
            >
              عرض جميع الشركات
            </Link>
            <Link
              href="/admin/tenants/new"
              className="block w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center font-medium"
            >
              إضافة شركة جديدة
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

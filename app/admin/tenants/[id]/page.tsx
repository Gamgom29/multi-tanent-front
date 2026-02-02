'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { adminTenantAPI } from '@/src/lib/api';
import Card from '@/components/ui/Card';
import Table from '@/components/ui/Table';

interface Invoice {
  id: string;
  number?: string;
  amount?: number;
  status?: string;
  createdAt?: string;
  [key: string]: any;
}

interface Payment {
  id: string;
  amount?: number;
  createdAt?: string;
  [key: string]: any;
}

interface TenantDetails {
  id: string;
  name: string;
  code?: string;
  slug?: string;
  createdAt?: string;
  stats?: {
    customersCount?: number;
    invoicesCount?: number;
    revenueSum?: number;
    outstandingSum?: number;
  };
  invoices?: Invoice[];
  payments?: Payment[];
  [key: string]: any;
}

export default function TenantDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [tenant, setTenant] = useState<TenantDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (id) {
      loadTenant();
    }
  }, [id]);

  const loadTenant = async () => {
    try {
      setLoading(true);
      setError('');
      setNotFound(false);
      const data = await adminTenantAPI.getById(id);
      setTenant(data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setNotFound(true);
      } else if (err.response?.status === 401 || err.response?.status === 403) {
        setError('غير مصرح لك بالوصول. يرجى تسجيل الدخول مرة أخرى.');
      } else {
        setError('حدث خطأ غير متوقع');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatNumber = (num?: number) => {
    if (num === undefined || num === null) return '0';
    return num.toLocaleString('ar-EG');
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">جاري التحميل...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">الشركة غير موجودة</h2>
        <button
          onClick={() => router.push('/admin/tenants')}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          رجوع إلى قائمة الشركات
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
        <button
          onClick={() => router.push('/admin/tenants')}
          className="text-blue-600 hover:text-blue-800"
        >
          رجوع
        </button>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">لا توجد بيانات</p>
        <button
          onClick={() => router.push('/admin/tenants')}
          className="mt-4 text-blue-600 hover:text-blue-800"
        >
          رجوع
        </button>
      </div>
    );
  }

  // Get last 5 invoices
  const lastInvoices = tenant.invoices?.slice(0, 5) || [];
  const lastPayments = tenant.payments?.slice(0, 5) || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">تفاصيل الشركة</h1>
        <button
          onClick={() => router.push('/admin/tenants')}
          className="px-4 py-2 text-gray-600 hover:text-gray-900"
        >
          رجوع
        </button>
      </div>

      {/* Tenant Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card title="الاسم">
          <p className="text-lg text-gray-900">{tenant.name}</p>
        </Card>

        <Card title="الكود">
          <p className="text-lg text-gray-900">{tenant.code || tenant.slug || '-'}</p>
        </Card>

        <Card title="تاريخ الإنشاء">
          <p className="text-lg text-gray-900">{formatDate(tenant.createdAt)}</p>
        </Card>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">عدد العملاء</p>
            <p className="text-3xl font-bold text-gray-900">{formatNumber(tenant.stats?.customersCount)}</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">عدد الفواتير</p>
            <p className="text-3xl font-bold text-gray-900">{formatNumber(tenant.stats?.invoicesCount)}</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">إجمالي الإيراد</p>
            <p className="text-3xl font-bold text-green-600">{formatNumber(tenant.stats?.revenueSum)}</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">إجمالي المستحق</p>
            <p className="text-3xl font-bold text-orange-600">{formatNumber(tenant.stats?.outstandingSum)}</p>
          </div>
        </Card>
      </div>

      {/* Last Invoices Table */}
      {lastInvoices.length > 0 && (
        <Card title="آخر الفواتير" className="mb-6">
          <Table headers={['الرقم', 'المبلغ', 'الحالة', 'التاريخ']}>
            {lastInvoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {invoice.number || invoice.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatNumber(invoice.amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-800">
                    {invoice.status || '-'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(invoice.createdAt)}
                </td>
              </tr>
            ))}
          </Table>
        </Card>
      )}

      {/* Last Payments Table */}
      {lastPayments.length > 0 && (
        <Card title="آخر المدفوعات">
          <Table headers={['المبلغ', 'التاريخ']}>
            {lastPayments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {formatNumber(payment.amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(payment.createdAt)}
                </td>
              </tr>
            ))}
          </Table>
        </Card>
      )}
    </div>
  );
}

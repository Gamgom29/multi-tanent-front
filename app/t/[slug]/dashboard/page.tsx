'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { tenantAdminAPI } from '@/src/lib/api';
import Card from '@/components/ui/Card';
import Table from '@/components/ui/Table';

interface DashboardSummary {
  customersCount?: number;
  invoicesCount?: number;
  revenueSum?: number;
  dueSum?: number;
  recentInvoices?: any[];
  recentPayments?: any[];
}

export default function TenantDashboardPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState<DashboardSummary>({});

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await tenantAdminAPI.getDashboardSummary();
      setSummary(data);
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError('غير مصرح لك بالوصول. يرجى تسجيل الدخول مرة أخرى.');
      } else {
        setError('حدث خطأ غير متوقع');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num?: number) => {
    if (num === undefined || num === null) return '0';
    return num.toLocaleString('ar-EG');
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ar-EG');
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600 text-lg">جاري التحميل...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  const recentInvoices = summary.recentInvoices || [];
  const recentPayments = summary.recentPayments || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">لوحة التحكم</h1>
        <p className="text-gray-600 mt-1">نظرة عامة على نشاط الشركة</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">عدد العملاء</p>
            <p className="text-3xl font-bold text-gray-900">{formatNumber(summary.customersCount)}</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">عدد الفواتير</p>
            <p className="text-3xl font-bold text-gray-900">{formatNumber(summary.invoicesCount)}</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">إجمالي الإيراد</p>
            <p className="text-3xl font-bold text-green-600">{formatNumber(summary.revenueSum)}</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">إجمالي المستحق</p>
            <p className="text-3xl font-bold text-orange-600">{formatNumber(summary.dueSum)}</p>
          </div>
        </Card>
      </div>

      {/* Recent Invoices */}
      {recentInvoices.length > 0 && (
        <Card title="آخر الفواتير">
          <Table headers={['الرقم', 'العميل', 'المبلغ', 'التاريخ', 'الحالة']}>
            {recentInvoices.map((invoice: any) => (
              <tr key={invoice.id} className="hover:bg-blue-50 transition-colors border-b border-gray-200">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  {invoice.number || invoice.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {invoice.customerName || invoice.customer?.name || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  {formatNumber(invoice.total || invoice.amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {formatDate(invoice.createdAt || invoice.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-800">
                    {invoice.status || 'معلقة'}
                  </span>
                </td>
              </tr>
            ))}
          </Table>
        </Card>
      )}

      {/* Recent Payments */}
      {recentPayments.length > 0 && (
        <Card title="آخر المدفوعات">
          <Table headers={['الفاتورة', 'المبلغ', 'الطريقة', 'التاريخ']}>
            {recentPayments.map((payment: any) => (
              <tr key={payment.id} className="hover:bg-blue-50 transition-colors border-b border-gray-200">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  {payment.invoiceNumber || payment.invoiceId || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                  {formatNumber(payment.amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {payment.method || 'نقد'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {formatDate(payment.createdAt || payment.date)}
                </td>
              </tr>
            ))}
          </Table>
        </Card>
      )}

      {recentInvoices.length === 0 && recentPayments.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-600">لا توجد بيانات حديثة</p>
          </div>
        </Card>
      )}
    </div>
  );
}

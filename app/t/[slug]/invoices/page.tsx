'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { tenantAdminAPI } from '@/src/lib/api';
import Card from '@/components/ui/Card';
import Table from '@/components/ui/Table';

interface Invoice {
  id: string;
  number?: string;
  customerId?: string;
  customerName?: string;
  customer?: { name: string };
  total?: number;
  amount?: number;
  status?: string;
  createdAt?: string;
  date?: string;
}

export default function InvoicesPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await tenantAdminAPI.getInvoices();
      const invoicesList = Array.isArray(data) ? data : data?.data || data?.invoices || [];
      setInvoices(invoicesList);
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">الفواتير</h1>
          <p className="text-gray-600 mt-1">إدارة الفواتير</p>
        </div>
        <button
          onClick={() => router.push(`/t/${slug}/invoices/new`)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
        >
          إنشاء فاتورة
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <Card>
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600 text-lg">جاري التحميل...</p>
          </div>
        ) : invoices.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📄</div>
            <p className="text-gray-600 text-lg mb-2">لا توجد بيانات</p>
            <p className="text-gray-500 text-sm">لم يتم إنشاء فواتير بعد</p>
          </div>
        ) : (
          <Table headers={['الرقم', 'العميل', 'المبلغ', 'الحالة', 'التاريخ', 'الإجراءات']}>
            {invoices.map((invoice) => (
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
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-800">
                    {invoice.status || 'معلقة'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {formatDate(invoice.createdAt || invoice.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => router.push(`/t/${slug}/invoices/${invoice.id}`)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm shadow-sm"
                  >
                    عرض
                  </button>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { tenantAdminAPI } from '@/src/lib/api';
import Card from '@/components/ui/Card';
import Table from '@/components/ui/Table';

interface InvoiceItem {
  id?: string;
  name: string;
  qty: number;
  unitPrice: number;
  lineTotal?: number;
}

interface Invoice {
  id: string;
  number?: number;
  customerId?: string;
  customerName?: string;
  customer?: { name: string };
  items?: InvoiceItem[];
  subTotal?: number;
  taxTotal?: number;
  total?: number;
  status?: string;
  issuedAt?: string;
  createdAt?: string;
  [key: string]: any;
}

export default function InvoiceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [invoice, setInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    if (id) {
      loadInvoice();
    }
  }, [id]);

  const loadInvoice = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await tenantAdminAPI.getInvoiceById(id);
      setInvoice(data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('الفاتورة غير موجودة');
      } else if (err.response?.status === 401 || err.response?.status === 403) {
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
    return num.toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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
      <div>
        <div className="bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
        <button
          onClick={() => router.push(`/t/${slug}/invoices`)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          رجوع
        </button>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">الفاتورة غير موجودة</p>
        <button
          onClick={() => router.push(`/t/${slug}/invoices`)}
          className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          رجوع
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">تفاصيل الفاتورة</h1>
          <p className="text-gray-600 mt-1">رقم الفاتورة: {invoice.number || invoice.id}</p>
        </div>
        <button
          onClick={() => router.push(`/t/${slug}/invoices`)}
          className="px-4 py-2 text-gray-600 hover:text-gray-900"
        >
          رجوع
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="معلومات الفاتورة">
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">العميل</p>
              <p className="text-lg font-semibold text-gray-900">
                {invoice.customerName || invoice.customer?.name || '-'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">الحالة</p>
              <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
                {invoice.status || 'معلقة'}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600">تاريخ الإصدار</p>
              <p className="text-lg text-gray-900">{formatDate(invoice.issuedAt || invoice.createdAt)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Invoice Items */}
      {invoice.items && invoice.items.length > 0 && (
        <Card title="عناصر الفاتورة">
          <Table headers={['اسم العنصر', 'الكمية', 'سعر الوحدة', 'الإجمالي']}>
            {invoice.items.map((item, index) => {
              const itemTotal = item.lineTotal || (item.qty * item.unitPrice);
              return (
                <tr key={item.id || index} className="hover:bg-blue-50 transition-colors border-b border-gray-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.qty}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatNumber(item.unitPrice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {formatNumber(itemTotal)}
                  </td>
                </tr>
              );
            })}
          </Table>
        </Card>
      )}

      {/* Invoice Summary */}
      <Card title="ملخص الفاتورة">
        <div className="space-y-3">
          <div className="flex justify-between text-lg">
            <span className="text-gray-600">المجموع الفرعي:</span>
            <span className="font-semibold text-gray-900">{formatNumber(invoice.subTotal)}</span>
          </div>
          <div className="flex justify-between text-lg">
            <span className="text-gray-600">ضريبة 15%:</span>
            <span className="font-semibold text-gray-900">{formatNumber(invoice.taxTotal)}</span>
          </div>
          <div className="flex justify-between text-xl pt-3 border-t-2 border-gray-300">
            <span className="font-bold text-gray-900">الإجمالي:</span>
            <span className="font-bold text-blue-600">{formatNumber(invoice.total)}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

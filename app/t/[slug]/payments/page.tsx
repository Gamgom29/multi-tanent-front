'use client';

import { useEffect, useState } from 'react';
import { tenantAdminAPI } from '@/src/lib/api';
import Card from '@/components/ui/Card';
import Table from '@/components/ui/Table';

interface Payment {
  id: string;
  invoiceId?: string;
  invoiceNumber?: string;
  amount?: number;
  method?: string;
  createdAt?: string;
  date?: string;
}

interface Invoice {
  id: string;
  number?: string;
}

export default function PaymentsPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    invoiceId: '',
    amount: '',
    method: 'نقد',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [paymentsData, invoicesData] = await Promise.all([
        tenantAdminAPI.getPayments(),
        tenantAdminAPI.getInvoices(),
      ]);
      
      const paymentsList = Array.isArray(paymentsData) ? paymentsData : paymentsData?.data || paymentsData?.payments || [];
      const invoicesList = Array.isArray(invoicesData) ? invoicesData : invoicesData?.data || invoicesData?.invoices || [];
      
      setPayments(paymentsList);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await tenantAdminAPI.createPayment({
        invoiceId: formData.invoiceId,
        amount: parseFloat(formData.amount),
        method: formData.method,
      });
      setShowForm(false);
      setFormData({ invoiceId: '', amount: '', method: 'نقد' });
      loadData();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'حدث خطأ غير متوقع';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const formatNumber = (num?: number) => {
    if (num === undefined || num === null) return '0';
    return num.toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ar-EG');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">المدفوعات</h1>
          <p className="text-gray-600 mt-1">سجل المدفوعات</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
        >
          إضافة دفعة
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Payment Form */}
      {showForm && (
        <Card title="إضافة دفعة جديدة">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2 text-right">
                الفاتورة *
              </label>
              <select
                value={formData.invoiceId}
                onChange={(e) => setFormData({ ...formData, invoiceId: e.target.value })}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-colors text-gray-900"
              >
                <option value="">اختر الفاتورة</option>
                {invoices.map((invoice) => (
                  <option key={invoice.id} value={invoice.id}>
                    {invoice.number || invoice.id}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2 text-right">
                المبلغ *
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-colors text-gray-900 placeholder-gray-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2 text-right">
                طريقة الدفع *
              </label>
              <select
                value={formData.method}
                onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-colors text-gray-900"
              >
                <option value="نقد">نقد</option>
                <option value="تحويل بنكي">تحويل بنكي</option>
                <option value="شيك">شيك</option>
                <option value="بطاقة">بطاقة</option>
              </select>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setFormData({ invoiceId: '', amount: '', method: 'نقد' });
                }}
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
              >
                {submitting ? 'جاري الحفظ...' : 'حفظ'}
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* Payments List */}
      <Card>
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600 text-lg">جاري التحميل...</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">💰</div>
            <p className="text-gray-600 text-lg mb-2">لا توجد بيانات</p>
            <p className="text-gray-500 text-sm">لم يتم تسجيل مدفوعات بعد</p>
          </div>
        ) : (
          <Table headers={['الفاتورة', 'المبلغ', 'طريقة الدفع', 'التاريخ']}>
            {payments.map((payment) => (
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
        )}
      </Card>
    </div>
  );
}

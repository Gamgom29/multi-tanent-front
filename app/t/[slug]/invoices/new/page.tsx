'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { tenantAdminAPI } from '@/src/lib/api';
import Card from '@/components/ui/Card';

interface InvoiceItem {
  name: string;
  qty: number;
  unitPrice: number;
}

interface Customer {
  id: string;
  name: string;
}

export default function NewInvoicePage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [formData, setFormData] = useState({
    customerId: '',
    items: [{ name: '', qty: 1, unitPrice: 0 }] as InvoiceItem[],
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await tenantAdminAPI.getCustomers();
      const customersList = Array.isArray(data) ? data : data?.data || data?.customers || [];
      setCustomers(customersList);
    } catch (err: any) {
      setError('فشل تحميل قائمة العملاء');
    } finally {
      setLoading(false);
    }
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { name: '', qty: 1, unitPrice: 0 }],
    });
  };

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      setFormData({
        ...formData,
        items: formData.items.filter((_, i) => i !== index),
      });
    }
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => sum + (item.qty * item.unitPrice), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.15;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await tenantAdminAPI.createInvoice({
        customerId: formData.customerId,
        items: formData.items.map(item => ({
          name: item.name,
          qty: Math.max(1, Math.floor(item.qty)), // Ensure qty is at least 1 and is an integer
          unitPrice: item.unitPrice,
        })),
      });
      router.push(`/t/${slug}/invoices`);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'حدث خطأ غير متوقع';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">فاتورة جديدة</h1>
        <p className="text-gray-600 mt-1">إنشاء فاتورة جديدة</p>
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2 text-right">
                العميل *
              </label>
              <select
                value={formData.customerId}
                onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                required
                disabled={loading}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-colors text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">اختر العميل</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        <Card title="عناصر الفاتورة">
          <div className="space-y-4">
            {formData.items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 items-end">
                <div className="col-span-5">
                  <label className="block text-sm font-medium text-gray-900 mb-2 text-right">
                    اسم العنصر
                  </label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateItem(index, 'name', e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-colors text-gray-900 placeholder-gray-500"
                    placeholder="اسم العنصر"
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-sm font-medium text-gray-900 mb-2 text-right">
                    الكمية
                  </label>
                  <input
                    type="number"
                    value={item.qty}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 1;
                      updateItem(index, 'qty', Math.max(1, value));
                    }}
                    required
                    min="1"
                    step="1"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-colors text-gray-900"
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-sm font-medium text-gray-900 mb-2 text-right">
                    سعر الوحدة
                  </label>
                  <input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-colors text-gray-900"
                  />
                </div>
                <div className="col-span-1">
                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addItem}
              className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
            >
              + إضافة عنصر
            </button>
          </div>
        </Card>

        <Card title="ملخص الفاتورة">
          <div className="space-y-3">
            <div className="flex justify-between text-lg">
              <span className="text-gray-600">المجموع الفرعي:</span>
              <span className="font-semibold text-gray-900">{formatNumber(calculateSubtotal())}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="text-gray-600">ضريبة 15%:</span>
              <span className="font-semibold text-gray-900">{formatNumber(calculateTax())}</span>
            </div>
            <div className="flex justify-between text-xl pt-3 border-t-2 border-gray-300">
              <span className="font-bold text-gray-900">الإجمالي:</span>
              <span className="font-bold text-blue-600">{formatNumber(calculateTotal())}</span>
            </div>
          </div>
        </Card>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={submitting || !formData.customerId}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
          >
            {submitting ? 'جاري الحفظ...' : 'حفظ الفاتورة'}
          </button>
        </div>
      </form>
    </div>
  );
}

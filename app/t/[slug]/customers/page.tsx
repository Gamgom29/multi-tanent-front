'use client';

import { useEffect, useState } from 'react';
import { tenantAdminAPI } from '@/src/lib/api';
import Card from '@/components/ui/Card';
import Table from '@/components/ui/Table';
import Modal from '@/components/ui/Modal';

interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  createdAt?: string;
}

export default function CustomersPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await tenantAdminAPI.getCustomers();
      const customersList = Array.isArray(data) ? data : data?.data || data?.customers || [];
      setCustomers(customersList);
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
      await tenantAdminAPI.createCustomer(formData);
      setShowModal(false);
      setFormData({ name: '', email: '', phone: '' });
      loadCustomers();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'حدث خطأ غير متوقع';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ar-EG');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">العملاء</h1>
          <p className="text-gray-600 mt-1">إدارة قائمة العملاء</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
        >
          إضافة عميل
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
        ) : customers.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">👥</div>
            <p className="text-gray-600 text-lg mb-2">لا توجد بيانات</p>
            <p className="text-gray-500 text-sm">لم يتم إضافة عملاء بعد</p>
          </div>
        ) : (
          <Table headers={['الاسم', 'البريد الإلكتروني', 'الهاتف', 'تاريخ الإضافة']}>
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-blue-50 transition-colors border-b border-gray-200">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  {customer.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {customer.email || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {customer.phone || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {formatDate(customer.createdAt)}
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      {/* Create Customer Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="إضافة عميل جديد">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2 text-right">
              الاسم *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-colors text-gray-900 placeholder-gray-500"
              placeholder="اسم العميل"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2 text-right">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-colors text-gray-900 placeholder-gray-500"
              placeholder="البريد الإلكتروني"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2 text-right">
              الهاتف
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-colors text-gray-900 placeholder-gray-500"
              placeholder="رقم الهاتف"
            />
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-lg text-right">
              {error}
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
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
      </Modal>
    </div>
  );
}

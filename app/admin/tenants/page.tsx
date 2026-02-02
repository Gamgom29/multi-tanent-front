'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminTenantAPI } from '@/src/lib/api';
import Card from '@/components/ui/Card';
import Table from '@/components/ui/Table';

interface Tenant {
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
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function TenantsPage() {
  const router = useRouter();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    loadTenants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, pagination.limit]);

  const loadTenants = async () => {
    try {
      setLoading(true);
      setError('');
      const params: any = {
        page: pagination.page,
        limit: pagination.limit,
      };
      
      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }
      
      const data = await adminTenantAPI.getAll(params);
      
      // Handle response structure: { items: [], meta: {} }
      if (data.items && Array.isArray(data.items)) {
        setTenants(data.items);
        if (data.meta) {
          setPagination({
            page: data.meta.page || pagination.page,
            limit: data.meta.limit || pagination.limit,
            total: data.meta.totalItems || data.items.length,
            totalPages: data.meta.totalPages || 1,
          });
        }
      } else if (Array.isArray(data)) {
        // Fallback for array response
        setTenants(data);
        setPagination(prev => ({ ...prev, total: data.length, totalPages: 1 }));
      } else if (data.data && Array.isArray(data.data)) {
        // Fallback for { data: [] } structure
        setTenants(data.data);
        setPagination({
          page: data.page || pagination.page,
          limit: data.limit || pagination.limit,
          total: data.total || data.data.length,
          totalPages: data.totalPages || Math.ceil((data.total || data.data.length) / (data.limit || pagination.limit)),
        });
      } else {
        setTenants([]);
      }
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError('غير مصرح لك بالوصول. يرجى تسجيل الدخول مرة أخرى.');
      } else {
        setError('حدث خطأ غير متوقع');
      }
      setTenants([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    loadTenants();
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ar-EG');
  };

  const formatNumber = (num?: number) => {
    if (num === undefined || num === null) return '0';
    return num.toLocaleString('ar-EG');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">الشركات</h1>
          <p className="text-gray-600 mt-1">إدارة وعرض جميع الشركات</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Search Card */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="flex-1 w-full sm:w-auto">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              placeholder="ابحث بالاسم أو الكود..."
              className="flex-1 w-full md:max-w-md px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-colors text-gray-900 placeholder-gray-500"
            />
          </div>
          <button
            onClick={handleSearch}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
          >
            بحث
          </button>
        </div>
      </Card>

      {/* Main Content Card */}
      <Card>
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600 text-lg">جاري التحميل...</p>
          </div>
        ) : tenants.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-gray-600 text-lg mb-2">لا توجد بيانات</p>
            <p className="text-gray-500 text-sm">جرب البحث بكلمات مختلفة</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table
                headers={['الاسم', 'الكود', 'العملاء', 'الفواتير', 'الإيراد', 'المستحق', 'تاريخ الإنشاء', 'عرض']}
              >
                {tenants.map((tenant) => (
                  <tr key={tenant.id} className="hover:bg-blue-50 transition-colors border-b border-gray-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {tenant.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <span className="px-2 py-1 bg-gray-100 rounded text-gray-700">
                        {tenant.code || tenant.slug || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatNumber(tenant.stats?.customersCount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatNumber(tenant.stats?.invoicesCount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                      {formatNumber(tenant.stats?.revenueSum)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-orange-600">
                      {formatNumber(tenant.stats?.outstandingSum)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(tenant.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => router.push(`/admin/tenants/${tenant.id}`)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm shadow-sm"
                      >
                        عرض
                      </button>
                    </td>
                  </tr>
                ))}
              </Table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  عرض <span className="font-semibold text-gray-900">{pagination.page}</span> من{' '}
                  <span className="font-semibold text-gray-900">{pagination.totalPages}</span> صفحة{' '}
                  ({pagination.total} نتيجة)
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    السابق
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages}
                    className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    التالي
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}

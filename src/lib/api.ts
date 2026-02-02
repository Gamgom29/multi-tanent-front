import axios, { AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token automatically
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('admin_token') || localStorage.getItem('tenant_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle 401/403 errors with Arabic messages
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      if (typeof window !== 'undefined') {
        const pathname = window.location.pathname;
        localStorage.removeItem('admin_token');
        localStorage.removeItem('tenant_token');
        document.cookie = 'admin_token=; path=/; max-age=0';
        document.cookie = 'tenant_token=; path=/; max-age=0';
        
        // Redirect based on route
        if (pathname.startsWith('/admin')) {
          sessionStorage.setItem('auth_error', 'غير مصرح لك بالوصول. يرجى تسجيل الدخول مرة أخرى.');
          window.location.href = '/admin/login';
        } else if (pathname.startsWith('/t/')) {
          const slug = pathname.split('/')[2];
          sessionStorage.setItem('auth_error', 'غير مصرح لك بالوصول. يرجى تسجيل الدخول مرة أخرى.');
          window.location.href = `/t/${slug}/login`;
        }
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  // Admin login
  adminLogin: async (email: string, password: string) => {
    const response = await apiClient.post('/admin/auth/login', { email, password });
    return response.data;
  },
  // Tenant login
  tenantLogin: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },
  // Backward compatibility
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },
};

// Tenant API
export const tenantAPI = {
  getBySlug: async (slug: string) => {
    const response = await apiClient.get(`/tenants/by-slug/${slug}`);
    return response.data;
  },
  getAll: async () => {
    const response = await apiClient.get('/tenants');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await apiClient.get(`/tenants/${id}`);
    return response.data;
  },
};

// Admin Tenant API
export const adminTenantAPI = {
  getAll: async (params?: { search?: string; page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const queryString = queryParams.toString();
    const url = `/admin/tenants${queryString ? `?${queryString}` : ''}`;
    const response = await apiClient.get(url);
    return response.data;
  },
  getById: async (id: string) => {
    const response = await apiClient.get(`/admin/tenants/${id}`);
    return response.data;
  },
  create: async (data: { name: string; slug: string }) => {
    const response = await apiClient.post('/admin/tenants', data);
    return response.data;
  },
};

// Tenant Admin API
export const tenantAdminAPI = {
  // Dashboard summary
  getDashboardSummary: async () => {
    const response = await apiClient.get('/dashboard');
    return response.data;
  },
  // Customers
  getCustomers: async () => {
    const response = await apiClient.get('/customers');
    return response.data;
  },
  createCustomer: async (data: any) => {
    const response = await apiClient.post('/customers', data);
    return response.data;
  },
  // Invoices
  getInvoices: async () => {
    const response = await apiClient.get('/invoices');
    return response.data;
  },
  getInvoiceById: async (id: string) => {
    const response = await apiClient.get(`/invoices/${id}`);
    return response.data;
  },
  createInvoice: async (data: any) => {
    const response = await apiClient.post('/invoices', data);
    return response.data;
  },
  // Payments
  getPayments: async () => {
    const response = await apiClient.get('/payments');
    return response.data;
  },
  createPayment: async (data: any) => {
    const response = await apiClient.post('/payments', data);
    return response.data;
  },
};

export default apiClient;

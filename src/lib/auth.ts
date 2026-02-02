'use client';

// Token helpers for authentication
export const authHelpers = {
  // Get admin token from localStorage
  getAdminToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('admin_token');
  },

  // Get tenant token from localStorage
  getTenantToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('tenant_token');
  },

  // Set admin token in localStorage and cookie
  setAdminToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('admin_token', token);
    document.cookie = `admin_token=${token}; path=/; max-age=86400; SameSite=Lax`;
  },

  // Set tenant token in localStorage and cookie
  setTenantToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('tenant_token', token);
    document.cookie = `tenant_token=${token}; path=/; max-age=86400; SameSite=Lax`;
  },

  // Set token (backward compatibility)
  setToken: (token: string): void => {
    authHelpers.setAdminToken(token);
  },

  // Remove all tokens from localStorage and cookies
  removeToken: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('admin_token');
    localStorage.removeItem('tenant_token');
    document.cookie = 'admin_token=; path=/; max-age=0';
    document.cookie = 'tenant_token=; path=/; max-age=0';
  },

  // Check if admin is authenticated
  isAdminAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('admin_token');
  },

  // Check if tenant is authenticated
  isTenantAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('tenant_token');
  },

  // Check if user is authenticated (backward compatibility)
  isAuthenticated: (): boolean => {
    return authHelpers.isAdminAuthenticated();
  },
};

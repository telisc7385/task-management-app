'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { adminApi } from '@/lib/api';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  email: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedEmail = localStorage.getItem('adminEmail');
    const storedToken = localStorage.getItem('adminToken');
    if (storedEmail && storedToken) {
      setEmail(storedEmail);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await adminApi.login({ email, password });
    const { token } = response.data.data;
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminEmail', email);
    setEmail(email);
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    setEmail(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{ isAuthenticated: !!email, email, loading, login, logout }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}

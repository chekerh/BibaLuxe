import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Spin } from 'antd';

interface AuthContextType {
  isLoggedIn: boolean;
  user: { username: string; role: string } | null;
  login: (token: string, username: string, role: string) => void;
  logout: () => void;
}

const AdminAuthContext = createContext<AuthContextType | undefined>(undefined);

export function AdminAuthWrapper({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin-token') : null;
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('admin-user') : null;

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setIsLoggedIn(true);
        setUser(parsedUser);
      } catch (e) {
        console.error("Failed to parse admin user from localStorage:", e);
        typeof window !== 'undefined' && localStorage.removeItem('admin-token');
        typeof window !== 'undefined' && localStorage.removeItem('admin-user');
        setIsLoggedIn(false);
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !isLoggedIn && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [isLoggedIn, loading, pathname, router]);

  const login = (token: string, username: string, role: string) => {
    console.log("AdminAuthContext: login function called", { token, username, role });
    typeof window !== 'undefined' && localStorage.setItem('admin-token', token);
    const userData = { username, role };
    typeof window !== 'undefined' && localStorage.setItem('admin-user', JSON.stringify(userData));
    setIsLoggedIn(true);
    setUser(userData);
    router.push('/admin');
  };

  const logout = () => {
    typeof window !== 'undefined' && localStorage.removeItem('admin-token');
    typeof window !== 'undefined' && localStorage.removeItem('admin-user');
    setIsLoggedIn(false);
    setUser(null);
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  // If not logged in and not on the login page, redirect to login and return null
  if (!isLoggedIn && pathname !== '/admin/login') {
    router.push('/admin/login');
    return null;
  }

  // Render children only if logged in, or if on the login page
  if (isLoggedIn || pathname === '/admin/login') {
    return (
      <AdminAuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
        {children}
      </AdminAuthContext.Provider>
    );
  }

  return null; // Fallback, should not be reached
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthWrapper');
  }
  return context;
}

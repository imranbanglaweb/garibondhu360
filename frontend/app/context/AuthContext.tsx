'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { authAPI } from '../services/api';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  department?: string;
  designation?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    password_confirmation: string;
    department?: string;
    designation?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = Cookies.get('token');
    if (token) {
      try {
        const response = await authAPI.user();
        setUser(response.data);
      } catch (error) {
        Cookies.remove('token');
      }
    }
    setLoading(false);
  };

  const login = async (email: string, password: string) => {
    const response = await authAPI.login({ email, password });
    const { user, token } = response.data;
    Cookies.set('token', token, { expires: 7 });
    setUser(user);
  };

  const register = async (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    password_confirmation: string;
    department?: string;
    designation?: string;
  }) => {
    const response = await authAPI.register(data);
    const { user, token } = response.data;
    Cookies.set('token', token, { expires: 7 });
    setUser(user);
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } finally {
      Cookies.remove('token');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

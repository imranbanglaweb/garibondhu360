'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../services/api';

const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

const setToken = (token: string) => {
  if (typeof window !== 'undefined') localStorage.setItem('token', token);
};

const removeToken = () => {
  if (typeof window !== 'undefined') localStorage.removeItem('token');
};

interface User {
  id: number;
  name: string;
  email: string;
  cell_phone: string;
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
    cell_phone: string;
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
    const token = getToken();
    if (token) {
      try {
        const response = await authAPI.user();
        setUser(response.data);
      } catch (error) {
        removeToken();
      }
    }
    setLoading(false);
  };

  const login = async (email: string, password: string) => {
    const response = await authAPI.login({ email, password });
    const { user, token } = response.data;
    setToken(token);
    setUser(user);
  };

  const register = async (data: {
    name: string;
    email: string;
    cell_phone: string;
    password: string;
    password_confirmation: string;
    department?: string;
    designation?: string;
  }) => {
    const response = await authAPI.register(data);
    const { user, token } = response.data;
    setToken(token);
    setUser(user);
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } finally {
      removeToken();
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

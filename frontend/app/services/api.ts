import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('token');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    password_confirmation: string;
    department?: string;
    designation?: string;
  }) => api.post('/register', data),

  login: (data: { email: string; password: string }) =>
    api.post('/login', data),

  logout: () => api.post('/logout'),

  user: () => api.get('/user'),
};

// Dashboard API
export const dashboardAPI = {
  stats: () => api.get('/dashboard/stats'),
  recentRequisitions: () => api.get('/dashboard/recent-requisitions'),
};

// Vehicles API
export const vehiclesAPI = {
  list: (params?: { status?: string; search?: string; page?: number }) =>
    api.get('/vehicles', { params }),
  get: (id: number) => api.get(`/vehicles/${id}`),
  create: (data: any) => api.post('/vehicles', data),
  update: (id: number, data: any) => api.put(`/vehicles/${id}`, data),
  delete: (id: number) => api.delete(`/vehicles/${id}`),
};

// Drivers API
export const driversAPI = {
  list: (params?: { status?: string; search?: string; page?: number }) =>
    api.get('/drivers', { params }),
  get: (id: number) => api.get(`/drivers/${id}`),
  create: (data: any) => api.post('/drivers', data),
  update: (id: number, data: any) => api.put(`/drivers/${id}`, data),
  delete: (id: number) => api.delete(`/drivers/${id}`),
};

// Requisitions API
export const requisitionsAPI = {
  list: (params?: { status?: string; department?: string; page?: number }) =>
    api.get('/requisitions', { params }),
  get: (id: number) => api.get(`/requisitions/${id}`),
  create: (data: any) => api.post('/requisitions', data),
  update: (id: number, data: any) => api.put(`/requisitions/${id}`, data),
  delete: (id: number) => api.delete(`/requisitions/${id}`),
  approve: (id: number) => api.patch(`/requisitions/${id}/approve`),
  reject: (id: number, reason: string) =>
    api.patch(`/requisitions/${id}/reject`, { rejection_reason: reason }),
};

// Contact API
export const contactAPI = {
  send: (data: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }) => api.post('/contact', data),
};

export default api;

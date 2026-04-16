import axios from 'axios';

// Simple token helpers
const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors - just reject, don't redirect
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Just reject - pages handle their own auth redirects
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: {
    name: string;
    email: string;
    cell_phone: string;
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

  list: (params?: { page?: number; per_page?: number }) =>
    api.get('/contacts', { params }),

  get: (id: number) => api.get(`/contacts/${id}`),

  updateStatus: (id: number, status: string) =>
    api.patch(`/contacts/${id}/status`, { status }),

  delete: (id: number) => api.delete(`/contacts/${id}`),
};

// Demo Request API
export const demoRequestAPI = {
  submit: (data: {
    name: string;
    email: string;
    phone: string;
    company: string;
    vehicles: string;
    drivers: string;
  }) => api.post('/demo-request', data),

  list: (params?: { page?: number; per_page?: number }) =>
    api.get('/demo-requests', { params }),

  get: (id: number) => api.get(`/demo-requests/${id}`),

  updateStatus: (id: number, status: string) =>
    api.patch(`/demo-requests/${id}/status`, { status }),

  delete: (id: number) => api.delete(`/demo-requests/${id}`),
};

// Subscription & Payment API
export const subscriptionAPI = {
  // Public
  packages: () => api.get('/packages'),
  package: (id: number) => api.get(`/packages/${id}`),

  // User - Subscribe
  subscribe: (data: { 
    package_id: number;
    customer_name?: string;
    customer_email?: string;
    customer_phone?: string;
  }) =>
    api.post('/subscribe', data),

  // User - Get subscriptions
  mySubscriptions: () => api.get('/my-subscriptions'),
  myActiveSubscription: () => api.get('/my-active-subscription'),

  // User - Submit payment
  submitPayment: (data: {
    subscription_id: number;
    payment_method: string;
    transaction_id: string;
    sender_number: string;
    amount: number;
    customer_name?: string;
    customer_email?: string;
    customer_phone?: string;
  }) => api.post('/submit-payment', data),

  // User - Get payments
  myPayments: () => api.get('/my-payments'),
  payment: (id: number) => api.get(`/my-payments/${id}`),

  // Admin - Get all payments
  allPayments: (params?: { status?: string; page?: number }) =>
    api.get('/all-payments', { params }),

  // Admin - Verify payment
  verifyPayment: (id: number, data: { status: string; notes?: string }) =>
    api.patch(`/payments/${id}/verify`, data),

  // Admin - Approve payment
  approvePayment: (id: number, data?: { notes?: string }) =>
    api.patch(`/payments/${id}/approve`, data),
};

// Public API (no auth required)
export const publicAPI = {
  stats: () => api.get('/public-stats'),
};

// Users API (Admin/TransportAdmin)
export const usersAPI = {
  list: (params?: { role?: string; department?: string; search?: string; page?: number; per_page?: number }) =>
    api.get('/users', { params }),
  get: (id: number) => api.get(`/users/${id}`),
  create: (data: any) => api.post('/users', data),
  update: (id: number, data: any) => api.put(`/users/${id}`, data),
  delete: (id: number) => api.delete(`/users/${id}`),
};

export default api;

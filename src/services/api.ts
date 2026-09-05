import axios from 'axios';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mplads_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('mplads_token');
      localStorage.removeItem('mplads_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
};

export const dashboardService = {
  getStats: () => api.get('/dashboard'),
};

export const worksService = {
  getWorks: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    stateId?: string;
    districtId?: string;
    category?: string;
    status?: string;
    riskLevel?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => api.get('/works', { params }),
  getWorkById: (id: string) => api.get(`/works/${id}`),
};

export const riskService = {
  getHighRisk: (limit?: number) => api.get('/risk/high', { params: { limit } }),
  getRiskByWorkId: (workId: string) => api.get(`/risk/${workId}`),
};

export const mapService = {
  getMapWorks: (params?: {
    riskLevel?: string;
    category?: string;
    stateId?: string;
    districtId?: string;
    limit?: number;
  }) => api.get('/map/works', { params }),
};

export const alertService = {
  getAlerts: (params?: { riskLevel?: string; status?: string; alertType?: string }) =>
    api.get('/alerts', { params }),
  updateStatus: (id: string, data: { status: string; remarks?: string }) =>
    api.patch(`/alerts/${id}`, data),
};

export const inspectionService = {
  getInspections: () => api.get('/inspections'),
  createInspection: (data: {
    workId: string;
    status: string;
    remarks: string;
    evidenceFileName?: string;
    latitude?: number;
    longitude?: number;
  }) => api.post('/inspections', data),
};

export const dataQualityService = {
  getReport: () => api.get('/data-quality'),
};

export default api;

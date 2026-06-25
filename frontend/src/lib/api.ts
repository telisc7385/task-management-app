import axios from 'axios';
import { AuthResponse, Task, TaskFormData, TaskStats, ApiResponse } from '@/types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post<{ success: boolean; message: string }>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data),
};

export const taskApi = {
  getAll: (params?: { status?: string; search?: string; page?: number; limit?: number }) =>
    api.get<ApiResponse<Task[]>>('/tasks', { params }),

  getById: (id: number) =>
    api.get<ApiResponse<Task>>(`/tasks/${id}`),

  create: (data: TaskFormData) =>
    api.post<ApiResponse<Task>>('/tasks', data),

  update: (id: number, data: Partial<TaskFormData>) =>
    api.put<ApiResponse<Task>>(`/tasks/${id}`, data),

  delete: (id: number) =>
    api.delete<ApiResponse<void>>(`/tasks/${id}`),

  getStats: () =>
    api.get<ApiResponse<TaskStats>>('/tasks/stats'),
};

export default api;

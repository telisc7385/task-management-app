import axios from 'axios';
import {
  AuthResponse,
  Task,
  TaskFormData,
  TaskStats,
  ApiResponse,
  Job,
  JobFormData,
  JobStats,
  EmailTemplate,
  WhatsappTemplate,
  AdminLoginResponse,
  ImportResult,
  ResumeFile,
} from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const userApi = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

userApi.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

userApi.interceptors.response.use(
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

const adminApiInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

adminApiInstance.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

adminApiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminEmail');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    userApi.post<{ success: boolean; message: string }>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    userApi.post<AuthResponse>('/auth/login', data),
};

export const taskApi = {
  getAll: (params?: { status?: string; search?: string; page?: number; limit?: number }) =>
    userApi.get<ApiResponse<Task[]>>('/tasks', { params }),

  getById: (id: number) =>
    userApi.get<ApiResponse<Task>>(`/tasks/${id}`),

  create: (data: TaskFormData) =>
    userApi.post<ApiResponse<Task>>('/tasks', data),

  update: (id: number, data: Partial<TaskFormData>) =>
    userApi.put<ApiResponse<Task>>(`/tasks/${id}`, data),

  delete: (id: number) =>
    userApi.delete<ApiResponse<void>>(`/tasks/${id}`),

  getStats: () =>
    userApi.get<ApiResponse<TaskStats>>('/tasks/stats'),
};

export const adminApi = {
  login: (data: { email: string; password: string }) =>
    userApi.post<AdminLoginResponse>('/admin/login', data),
};

export const jobApi = {
  getAll: (params?: { search?: string; emailStatus?: string; page?: number; limit?: number }) =>
    adminApiInstance.get<ApiResponse<Job[]>>('/jobs', { params }),

  getById: (id: number) =>
    adminApiInstance.get<ApiResponse<Job>>(`/jobs/${id}`),

  create: (data: JobFormData) =>
    adminApiInstance.post<ApiResponse<Job>>('/jobs', data),

  update: (id: number, data: Partial<JobFormData>) =>
    adminApiInstance.put<ApiResponse<Job>>(`/jobs/${id}`, data),

  delete: (id: number) =>
    adminApiInstance.delete<ApiResponse<void>>(`/jobs/${id}`),

  importCsv: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return adminApiInstance.post<ApiResponse<ImportResult>>('/jobs/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  getStats: () =>
    adminApiInstance.get<ApiResponse<JobStats>>('/jobs/stats'),
};

export const emailApi = {
  send: (jobId: number) =>
    adminApiInstance.post<ApiResponse<{ success: boolean; message: string }>>(`/email/send/${jobId}`),
};

export const templateApi = {
  listEmail: () =>
    adminApiInstance.get<ApiResponse<EmailTemplate[]>>('/template/email'),

  getEmail: (id: number) =>
    adminApiInstance.get<ApiResponse<EmailTemplate>>(`/template/email/${id}`),

  createEmail: (data: { name: string; subject: string; body: string }) =>
    adminApiInstance.post<ApiResponse<EmailTemplate>>('/template/email', data),

  updateEmail: (id: number, data: { name?: string; subject?: string; body?: string }) =>
    adminApiInstance.put<ApiResponse<EmailTemplate>>(`/template/email/${id}`, data),

  deleteEmail: (id: number) =>
    adminApiInstance.delete<ApiResponse<void>>(`/template/email/${id}`),

  listWhatsapp: () =>
    adminApiInstance.get<ApiResponse<WhatsappTemplate[]>>('/template/whatsapp'),

  getWhatsapp: (id: number) =>
    adminApiInstance.get<ApiResponse<WhatsappTemplate>>(`/template/whatsapp/${id}`),

  createWhatsapp: (data: { name: string; body: string }) =>
    adminApiInstance.post<ApiResponse<WhatsappTemplate>>('/template/whatsapp', data),

  updateWhatsapp: (id: number, data: { name?: string; body?: string }) =>
    adminApiInstance.put<ApiResponse<WhatsappTemplate>>(`/template/whatsapp/${id}`, data),

  deleteWhatsapp: (id: number) =>
    adminApiInstance.delete<ApiResponse<void>>(`/template/whatsapp/${id}`),
};

export const resumeApi = {
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('resume', file);
    return adminApiInstance.post<ApiResponse<{ filename: string }>>('/resume/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  list: () =>
    adminApiInstance.get<ApiResponse<ResumeFile[]>>('/resume'),

  delete: (filename: string) =>
    adminApiInstance.delete<ApiResponse<void>>(`/resume/${encodeURIComponent(filename)}`),
};

export default userApi;

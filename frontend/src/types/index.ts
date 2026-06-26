export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: User;
  };
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface TaskStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
}

// Job Manager Types
export interface Job {
  id: number;
  companyName: string;
  role: string;
  hrName: string;
  email: string;
  phone: string | null;
  location: string | null;
  emailStatus: 'Pending' | 'Sent' | 'Failed';
  whatsappStatus: 'Pending' | 'Opened';
  notes: string | null;
  resumeFileName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface JobFormData {
  companyName: string;
  role: string;
  hrName: string;
  email: string;
  phone?: string;
  location?: string;
  notes?: string;
  resumeFileName?: string;
}

export interface JobStats {
  total: number;
  pending: number;
  sent: number;
  failed: number;
}

export interface EmailTemplate {
  id?: number;
  subject: string;
  body: string;
}

export interface WhatsappTemplate {
  id?: number;
  body: string;
}

export interface AdminLoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    email: string;
  };
}

export interface ImportResult {
  imported: number;
  skipped: number;
}

export interface ResumeFile {
  filename: string;
  size: number;
  uploadedAt: string;
}

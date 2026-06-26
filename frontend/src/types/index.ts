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
  emailTemplateId: number | null;
  whatsappTemplateId: number | null;
  emailTemplate: EmailTemplate | null;
  whatsappTemplate: WhatsappTemplate | null;
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
  emailTemplateId?: number | null;
  whatsappTemplateId?: number | null;
}

export interface JobStats {
  total: number;
  pending: number;
  sent: number;
  failed: number;
}

export interface EmailTemplate {
  id?: number;
  name: string;
  subject: string;
  body: string;
}

export interface WhatsappTemplate {
  id?: number;
  name: string;
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

import { Request } from 'express';

export interface AuthPayload {
  userId: number;
  email: string;
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}

export interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface CreateTaskBody {
  title: string;
  description: string;
  status?: string;
}

export interface UpdateTaskBody {
  title?: string;
  description?: string;
  status?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
}

export interface TaskResponse {
  id: number;
  title: string;
  description: string;
  status: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

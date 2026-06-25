import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { TaskService } from '../services/taskService';
import { sendSuccess } from '../utils/apiResponse';

const taskService = new TaskService();

export const getAllTasks = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { status, search, page, limit } = req.query;

    const result = await taskService.getAll(userId, {
      status: status as string,
      search: search as string,
      page: page ? parseInt(page as string, 10) : undefined,
      limit: limit ? parseInt(limit as string, 10) : undefined,
    });

    sendSuccess(res, result.tasks, 'Tasks fetched successfully', 200, {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages,
    });
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const id = parseInt(req.params.id, 10);
    const task = await taskService.getById(id, userId);
    sendSuccess(res, task, 'Task fetched successfully');
  } catch (error) {
    next(error);
  }
};

export const createTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const task = await taskService.create(userId, req.body);
    sendSuccess(res, task, 'Task created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const id = parseInt(req.params.id, 10);
    const task = await taskService.update(id, userId, req.body);
    sendSuccess(res, task, 'Task updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const id = parseInt(req.params.id, 10);
    await taskService.delete(id, userId);
    sendSuccess(res, undefined, 'Task deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const getTaskStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const stats = await taskService.getStats(userId);
    sendSuccess(res, stats, 'Stats fetched successfully');
  } catch (error) {
    next(error);
  }
};

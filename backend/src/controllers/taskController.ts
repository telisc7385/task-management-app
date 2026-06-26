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
    const status = req.query.status as string | undefined;
    const search = req.query.search as string | undefined;
    const pageStr = req.query.page as string | undefined;
    const limitStr = req.query.limit as string | undefined;

    const result = await taskService.getAll(userId, {
      status,
      search,
      page: pageStr ? parseInt(pageStr, 10) : undefined,
      limit: limitStr ? parseInt(limitStr, 10) : undefined,
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
    const id = parseInt(req.params.id as string, 10);
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
    const id = parseInt(req.params.id as string, 10);
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
    const id = parseInt(req.params.id as string, 10);
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

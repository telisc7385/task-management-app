import { Request, Response, NextFunction } from 'express';
import { JobService } from '../services/jobService';
import { sendSuccess } from '../utils/apiResponse';

const jobService = new JobService();

export const getAllJobs = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const search = req.query.search as string | undefined;
    const emailStatus = req.query.emailStatus as string | undefined;
    const pageStr = req.query.page as string | undefined;
    const limitStr = req.query.limit as string | undefined;
    const result = await jobService.getAll({
      search,
      emailStatus,
      page: pageStr ? parseInt(pageStr, 10) : undefined,
      limit: limitStr ? parseInt(limitStr, 10) : undefined,
    });
    sendSuccess(res, result.jobs, 'Jobs fetched successfully', 200, {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages,
    });
  } catch (error) {
    next(error);
  }
};

export const getJobById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const job = await jobService.getById(id);
    sendSuccess(res, job, 'Job fetched successfully');
  } catch (error) {
    next(error);
  }
};

export const createJob = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const job = await jobService.create(req.body);
    sendSuccess(res, job, 'Job created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updateJob = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const job = await jobService.update(id, req.body);
    sendSuccess(res, job, 'Job updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteJob = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string, 10);
    await jobService.delete(id);
    sendSuccess(res, undefined, 'Job deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const importJobs = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      sendSuccess(res, { imported: 0, skipped: 0 }, 'No file uploaded', 400);
      return;
    }
    const result = await jobService.importCsv(req.file.path);
    sendSuccess(res, result, 'CSV import completed');
  } catch (error) {
    next(error);
  }
};

export const getJobStats = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const stats = await jobService.getStats();
    sendSuccess(res, stats, 'Stats fetched successfully');
  } catch (error) {
    next(error);
  }
};

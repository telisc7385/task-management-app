import { Request, Response, NextFunction } from 'express';
import { EmailService } from '../services/emailService';
import { sendSuccess } from '../utils/apiResponse';

const emailService = new EmailService();

export const sendJobEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const jobId = parseInt(req.params.jobId as string, 10);
    const result = await emailService.sendEmail(jobId);
    sendSuccess(res, result, result.message, result.success ? 200 : 500);
  } catch (error) {
    next(error);
  }
};

import { Request, Response, NextFunction } from 'express';
import { AdminAuthService } from '../services/adminAuthService';
import { sendSuccess } from '../utils/apiResponse';

const adminAuthService = new AdminAuthService();

export const adminLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const result = adminAuthService.login(email, password);
    sendSuccess(res, result, 'Admin login successful');
  } catch (error) {
    next(error);
  }
};

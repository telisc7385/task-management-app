import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { sendSuccess } from '../utils/apiResponse';

const RESUME_DIR = path.join(process.cwd(), 'uploads', 'resumes');

function ensureDir() {
  if (!fs.existsSync(RESUME_DIR)) {
    fs.mkdirSync(RESUME_DIR, { recursive: true });
  }
}

export const uploadResume = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      sendSuccess(res, undefined, 'No file uploaded', 400);
      return;
    }
    sendSuccess(res, { filename: req.file.filename }, 'Resume uploaded successfully');
  } catch (error) {
    next(error);
  }
};

export const listResumes = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    ensureDir();
    const files = fs.readdirSync(RESUME_DIR).filter((f) => f.endsWith('.pdf'));
    const resumes = files.map((filename) => {
      const stat = fs.statSync(path.join(RESUME_DIR, filename));
      return {
        filename,
        size: stat.size,
        uploadedAt: stat.birthtime.toISOString(),
      };
    });
    sendSuccess(res, resumes, 'Resumes fetched');
  } catch (error) {
    next(error);
  }
};

export const deleteResume = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const filename = req.params.filename as string;
    const filePath = path.join(RESUME_DIR, filename);
    if (!fs.existsSync(filePath)) {
      sendSuccess(res, undefined, 'Resume not found', 404);
      return;
    }
    fs.unlinkSync(filePath);
    sendSuccess(res, undefined, 'Resume deleted successfully');
  } catch (error) {
    next(error);
  }
};

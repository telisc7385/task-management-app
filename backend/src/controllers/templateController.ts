import { Request, Response, NextFunction } from 'express';
import { TemplateService } from '../services/templateService';
import { sendSuccess } from '../utils/apiResponse';

const templateService = new TemplateService();

export const getEmailTemplate = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const template = await templateService.getEmailTemplate();
    sendSuccess(res, template, 'Email template fetched');
  } catch (error) {
    next(error);
  }
};

export const updateEmailTemplate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { subject, body } = req.body;
    const template = await templateService.updateEmailTemplate(subject, body);
    sendSuccess(res, template, 'Email template updated');
  } catch (error) {
    next(error);
  }
};

export const getWhatsappTemplate = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const template = await templateService.getWhatsappTemplate();
    sendSuccess(res, template, 'WhatsApp template fetched');
  } catch (error) {
    next(error);
  }
};

export const updateWhatsappTemplate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { body } = req.body;
    const template = await templateService.updateWhatsappTemplate(body);
    sendSuccess(res, template, 'WhatsApp template updated');
  } catch (error) {
    next(error);
  }
};

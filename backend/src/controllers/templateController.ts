import { Request, Response, NextFunction } from 'express';
import { TemplateService } from '../services/templateService';
import { sendSuccess } from '../utils/apiResponse';

const templateService = new TemplateService();

// Email Templates
export const listEmailTemplates = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const templates = await templateService.listEmailTemplates();
    sendSuccess(res, templates, 'Email templates fetched');
  } catch (error) {
    next(error);
  }
};

export const getEmailTemplate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const template = await templateService.getEmailTemplateById(id);
    sendSuccess(res, template, 'Email template fetched');
  } catch (error) {
    next(error);
  }
};

export const createEmailTemplate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, subject, body } = req.body;
    const template = await templateService.createEmailTemplate({
      name: name || 'Untitled',
      subject,
      body,
    });
    sendSuccess(res, template, 'Email template created', 201);
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
    const id = parseInt(req.params.id as string, 10);
    const { name, subject, body } = req.body;
    const template = await templateService.updateEmailTemplate(id, { name, subject, body });
    sendSuccess(res, template, 'Email template updated');
  } catch (error) {
    next(error);
  }
};

export const deleteEmailTemplate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string, 10);
    await templateService.deleteEmailTemplate(id);
    sendSuccess(res, undefined, 'Email template deleted');
  } catch (error) {
    next(error);
  }
};

// WhatsApp Templates
export const listWhatsappTemplates = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const templates = await templateService.listWhatsappTemplates();
    sendSuccess(res, templates, 'WhatsApp templates fetched');
  } catch (error) {
    next(error);
  }
};

export const getWhatsappTemplate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const template = await templateService.getWhatsappTemplateById(id);
    sendSuccess(res, template, 'WhatsApp template fetched');
  } catch (error) {
    next(error);
  }
};

export const createWhatsappTemplate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, body } = req.body;
    const template = await templateService.createWhatsappTemplate({
      name: name || 'Untitled',
      body,
    });
    sendSuccess(res, template, 'WhatsApp template created', 201);
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
    const id = parseInt(req.params.id as string, 10);
    const { name, body } = req.body;
    const template = await templateService.updateWhatsappTemplate(id, { name, body });
    sendSuccess(res, template, 'WhatsApp template updated');
  } catch (error) {
    next(error);
  }
};

export const deleteWhatsappTemplate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string, 10);
    await templateService.deleteWhatsappTemplate(id);
    sendSuccess(res, undefined, 'WhatsApp template deleted');
  } catch (error) {
    next(error);
  }
};

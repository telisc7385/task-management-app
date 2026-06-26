import { Router } from 'express';
import { body } from 'express-validator';
import { adminAuthenticate } from '../middleware/adminAuth';
import { validate } from '../middleware/validate';
import {
  listEmailTemplates,
  getEmailTemplate,
  createEmailTemplate,
  updateEmailTemplate,
  deleteEmailTemplate,
  listWhatsappTemplates,
  getWhatsappTemplate,
  createWhatsappTemplate,
  updateWhatsappTemplate,
  deleteWhatsappTemplate,
} from '../controllers/templateController';

const router = Router();

router.use(adminAuthenticate);

// Email templates
router.get('/email', listEmailTemplates);
router.get('/email/:id', getEmailTemplate);
router.post(
  '/email',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('subject').notEmpty().withMessage('Subject is required'),
    body('body').notEmpty().withMessage('Body is required'),
  ],
  validate,
  createEmailTemplate
);
router.put(
  '/email/:id',
  updateEmailTemplate
);
router.delete('/email/:id', deleteEmailTemplate);

// WhatsApp templates
router.get('/whatsapp', listWhatsappTemplates);
router.get('/whatsapp/:id', getWhatsappTemplate);
router.post(
  '/whatsapp',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('body').notEmpty().withMessage('Body is required'),
  ],
  validate,
  createWhatsappTemplate
);
router.put(
  '/whatsapp/:id',
  updateWhatsappTemplate
);
router.delete('/whatsapp/:id', deleteWhatsappTemplate);

export default router;

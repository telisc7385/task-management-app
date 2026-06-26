import { Router } from 'express';
import { body } from 'express-validator';
import { adminAuthenticate } from '../middleware/adminAuth';
import { validate } from '../middleware/validate';
import {
  getEmailTemplate,
  updateEmailTemplate,
  getWhatsappTemplate,
  updateWhatsappTemplate,
} from '../controllers/templateController';

const router = Router();

router.use(adminAuthenticate);

router.get('/email', getEmailTemplate);
router.put(
  '/email',
  [
    body('subject').notEmpty().withMessage('Subject is required'),
    body('body').notEmpty().withMessage('Body is required'),
  ],
  validate,
  updateEmailTemplate
);

router.get('/whatsapp', getWhatsappTemplate);
router.put(
  '/whatsapp',
  [body('body').notEmpty().withMessage('Body is required')],
  validate,
  updateWhatsappTemplate
);

export default router;

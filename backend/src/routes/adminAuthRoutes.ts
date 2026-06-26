import { Router } from 'express';
import { body } from 'express-validator';
import { adminLogin } from '../controllers/adminAuthController';
import { validate } from '../middleware/validate';

const router = Router();

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  adminLogin
);

export default router;

import { Router } from 'express';
import { adminAuthenticate } from '../middleware/adminAuth';
import { sendJobEmail } from '../controllers/emailController';

const router = Router();

router.use(adminAuthenticate);

router.post('/send/:jobId', sendJobEmail);

export default router;

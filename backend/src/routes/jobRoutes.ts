import { Router } from 'express';
import { body } from 'express-validator';
import multer from 'multer';
import path from 'path';
import { adminAuthenticate } from '../middleware/adminAuth';
import { validate } from '../middleware/validate';
import {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  importJobs,
  getJobStats,
} from '../controllers/jobController';

const router = Router();

const csvUpload = multer({
  dest: path.join(process.cwd(), 'uploads'),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files allowed'));
    }
  },
});

router.use(adminAuthenticate);

router.get('/stats', getJobStats);
router.get('/', getAllJobs);
router.get('/:id', getJobById);

router.post(
  '/',
  [
    body('companyName').notEmpty().withMessage('Company name is required'),
    body('role').notEmpty().withMessage('Role is required'),
    body('hrName').notEmpty().withMessage('HR name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
  ],
  validate,
  createJob
);

router.put('/:id', updateJob);
router.delete('/:id', deleteJob);
router.post('/import', csvUpload.single('file'), importJobs);

export default router;

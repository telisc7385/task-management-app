import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { adminAuthenticate } from '../middleware/adminAuth';
import { uploadResume, listResumes, deleteResume } from '../controllers/resumeController';

const router = Router();

const RESUME_DIR = path.join(process.cwd(), 'uploads', 'resumes');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, RESUME_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    cb(null, `${baseName}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files allowed'));
    }
  },
});

router.use(adminAuthenticate);

router.get('/', listResumes);
router.post('/upload', upload.single('resume'), uploadResume);
router.delete('/:filename', deleteResume);

export default router;

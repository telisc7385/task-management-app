import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
} from '../controllers/taskController';

const router = Router();

router.use(authenticate);

router.get('/stats', getTaskStats);

router.get('/', getAllTasks);

router.get('/:id', getTaskById);

router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('status')
      .optional()
      .isIn(['Pending', 'In Progress', 'Completed'])
      .withMessage('Invalid status'),
  ],
  validate,
  createTask
);

router.put(
  '/:id',
  [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('description')
      .optional()
      .notEmpty()
      .withMessage('Description cannot be empty'),
    body('status')
      .optional()
      .isIn(['Pending', 'In Progress', 'Completed'])
      .withMessage('Invalid status'),
  ],
  validate,
  updateTask
);

router.delete('/:id', deleteTask);

export default router;

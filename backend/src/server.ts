import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';
import adminAuthRoutes from './routes/adminAuthRoutes';
import jobRoutes from './routes/jobRoutes';
import emailRoutes from './routes/emailRoutes';
import templateRoutes from './routes/templateRoutes';
import resumeRoutes from './routes/resumeRoutes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000', credentials: true }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/admin', adminAuthRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/template', templateRoutes);
app.use('/api/resume', resumeRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;

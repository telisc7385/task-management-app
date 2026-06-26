import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../utils/errors';

export class AdminAuthService {
  login(email: string, password: string): { token: string; email: string } {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      throw new UnauthorizedError('Admin credentials not configured');
    }

    if (email !== adminEmail || password !== adminPassword) {
      throw new UnauthorizedError('Invalid admin credentials');
    }

    const secret = process.env.JWT_SECRET || 'fallback-secret';
    const token = jwt.sign({ isAdmin: true, email }, secret, { expiresIn: '7d' });

    return { token, email };
  }
}

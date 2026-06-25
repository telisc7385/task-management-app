import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/userRepository';
import { ConflictError, UnauthorizedError } from '../utils/errors';
import { AuthPayload, UserResponse } from '../types';

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(name: string, email: string, password: string): Promise<void> {
    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new ConflictError('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await this.userRepository.create({ name, email, password: hashedPassword });
  }

  async login(
    email: string,
    password: string
  ): Promise<{ token: string; user: UserResponse }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const payload: AuthPayload = { userId: user.id, email: user.email };
    const secret = process.env.JWT_SECRET || 'fallback-secret';
    const token = jwt.sign(payload, secret, { expiresIn: '7d' });

    return {
      token,
      user: { id: user.id, name: user.name, email: user.email },
    };
  }
}

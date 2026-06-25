import { TaskRepository } from '../repositories/taskRepository';
import { NotFoundError } from '../utils/errors';
import { CreateTaskBody, UpdateTaskBody, TaskResponse } from '../types';

export class TaskService {
  private taskRepository: TaskRepository;

  constructor() {
    this.taskRepository = new TaskRepository();
  }

  async getAll(
    userId: number,
    options?: { status?: string; search?: string; page?: number; limit?: number }
  ) {
    return this.taskRepository.findAllByUserId(userId, options);
  }

  async getById(id: number, userId: number): Promise<TaskResponse> {
    const task = await this.taskRepository.findById(id);
    if (!task || task.userId !== userId) {
      throw new NotFoundError('Task');
    }
    return task;
  }

  async create(
    userId: number,
    data: CreateTaskBody
  ): Promise<TaskResponse> {
    return this.taskRepository.create({
      title: data.title,
      description: data.description,
      status: data.status || 'Pending',
      userId,
    });
  }

  async update(
    id: number,
    userId: number,
    data: UpdateTaskBody
  ): Promise<TaskResponse> {
    await this.getById(id, userId);
    return this.taskRepository.update(id, data);
  }

  async delete(id: number, userId: number): Promise<void> {
    await this.getById(id, userId);
    await this.taskRepository.delete(id);
  }

  async getStats(userId: number) {
    return this.taskRepository.getStats(userId);
  }
}

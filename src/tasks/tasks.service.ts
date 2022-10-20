import { Injectable } from '@nestjs/common';
import { User } from '../auth/entities/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { FindTaskDto } from './dto/find-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TaskRepository) {}

  create(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.tasksRepository.create(createTaskDto, user);
  }

  findAll(filterDto: FindTaskDto, user: User): Promise<Task[]> {
    return this.tasksRepository.findAll(filterDto, user);
  }

  findOne(id: string, user: User): Promise<Task> {
    return this.tasksRepository.findOne(id, user);
  }

  update(id: string, updateTaskDto: UpdateTaskDto, user: User): Promise<Task> {
    return this.tasksRepository.update(id, updateTaskDto, user);
  }

  remove(id: string, user: User): Promise<void> {
    return this.tasksRepository.remove(id, user);
  }
}

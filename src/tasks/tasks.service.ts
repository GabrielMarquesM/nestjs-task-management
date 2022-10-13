import { Injectable } from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskDto } from './dto/update-task-status.dto';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TaskRepository) {}

  getAllTasks(user: User): Promise<Task[]> {
    return this.tasksRepository.getAllTasks(user);
  }

  getTasksWithFilters(
    filterDto: GetTasksFilterDto,
    user: User,
  ): Promise<Task[]> {
    return this.tasksRepository.getTasksWithFilters(filterDto, user);
  }

  getTask(id: string, user: User): Promise<Task> {
    return this.tasksRepository.getTask(id, user);
  }

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto, user);
  }

  deleteTask(id: string, user: User): Promise<void> {
    return this.tasksRepository.deleteTask(id, user);
  }

  updateTask(
    id: string,
    updateTaskDto: UpdateTaskDto,
    user: User,
  ): Promise<Task> {
    return this.tasksRepository.updateTask(id, updateTaskDto, user);
  }
}

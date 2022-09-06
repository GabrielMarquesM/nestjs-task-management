import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskDto } from './dto/update-task-status.dto';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TaskRepository) {}

  getAllTasks(): Promise<Task[]> {
    return this.tasksRepository.getAllTasks();
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.tasksRepository.getTasksWithFilters(filterDto);
  }

  getTask(id: string): Promise<Task> {
    return this.tasksRepository.getTask(id);
  }

  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto);
  }

  deleteTask(id: string): Promise<void> {
    return this.tasksRepository.deleteTask(id);
  }

  updateTask(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    return this.tasksRepository.updateTask(id, updateTaskDto);
  }
}

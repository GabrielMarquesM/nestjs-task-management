import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskDto } from './dto/update-task-status.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';

@Injectable()
export class TaskRepository {
  private logger = new Logger('TaskRepository', { timestamp: true });
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
  ) {}

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const task = this.tasksRepository.create({
      ...createTaskDto,
      status: TaskStatus.OPEN,
      user,
    });
    return this.tasksRepository.save(task);
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const result = await this.tasksRepository.delete({ id, user });
    if (!result.affected) {
      throw new NotFoundException(`Task ${id} not found`);
    }
  }

  async getTask(id: string, user: User): Promise<Task> {
    const found = await this.tasksRepository.findOneBy({ id, user });
    if (!found) {
      throw new NotFoundException(`Task ${id} not found`);
    }
    return found;
  }

  async getTasksWithFilters(
    filterDto: GetTasksFilterDto,
    user: User,
  ): Promise<Task[]> {
    const { status, search } = filterDto;

    const baseWhere: FindOptionsWhere<Task> = {
      user: { id: user.id },
      status: status ? status : undefined,
    };

    try {
      const tasks = this.tasksRepository.find({
        where: [
          { ...baseWhere, title: search ? ILike(`%${search}%`) : undefined },
          {
            ...baseWhere,
            description: search ? ILike(`%${search}%`) : undefined,
          },
        ],
      });
      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to get tasks for user "${
          user.username
        }. Filters ${JSON.stringify(filterDto)}"`,
      );
      throw new InternalServerErrorException();
    }
  }

  async getAllTasks(user: User): Promise<Task[]> {
    return this.tasksRepository.findBy({ user: { id: user.id } });
  }

  async updateTask(
    id: string,
    updateTaskDto: UpdateTaskDto,
    user: User,
  ): Promise<Task> {
    const isUserTask = await this.getTask(id, user);
    if (!isUserTask) {
      throw new NotFoundException(`Task ${id} not found`);
    }

    const task = await this.tasksRepository.preload({
      id,
      ...updateTaskDto,
    });

    return this.tasksRepository.save(task);
  }
}

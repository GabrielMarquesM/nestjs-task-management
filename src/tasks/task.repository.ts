import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { FindTaskDto } from './dto/find-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TaskRepository {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const task = this.tasksRepository.create({
      ...createTaskDto,
      status: TaskStatus.OPEN,
      user,
    });
    return this.tasksRepository.save(task);
  }

  async remove(id: string, user: User): Promise<void> {
    const result = await this.tasksRepository.delete({ id, user });
    if (!result.affected) {
      throw new NotFoundException(`Task ${id} not found`);
    }
  }

  async findOne(id: string, user: User): Promise<Task> {
    const found = await this.tasksRepository.findOneBy({ id, user });
    if (!found) {
      throw new NotFoundException(`Task ${id} not found`);
    }
    return found;
  }

  async findAll(filterDto: FindTaskDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;

    const baseWhere: FindOptionsWhere<Task> = {
      user: { id: user.id },
      status: status ? status : undefined,
    };

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
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    user: User,
  ): Promise<Task> {
    const isUserTask = await this.findOne(id, user);
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

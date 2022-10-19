import { Test } from '@nestjs/testing';
import { TaskStatus } from './task-status.enum';
import { TaskRepository } from './task.repository';
import { TasksService } from './tasks.service';

const mockTasksRepository = () => ({ getTasks: jest.fn(), getTask: jest.fn() });

const mockUser = {
  id: 'TestId',
  username: 'Gabriel',
  password: 'somePassword',
  tasks: [],
};

const mockTask = {
  id: 'testId',
  title: 'Test title',
  description: 'Test description',
  status: TaskStatus.OPEN,
};

describe('TasksService', () => {
  let tasksService: TasksService;
  let tasksRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTasksRepository },
      ],
    }).compile();
    tasksService = module.get(TasksService);
    tasksRepository = module.get(TaskRepository);
  });
  describe('getTasks', () => {
    it('calls TasksRepository.getTasks and returns the result', async () => {
      tasksRepository.getTasks.mockResolvedValue('someValue');
      const result = await tasksService.getTasks(null, mockUser);
      expect(result).toEqual('someValue');
    });
  });
  describe('getTask', () => {
    it('calls TaskRepository.getTask and returns the result', async () => {
      tasksRepository.getTask.mockResolvedValue(mockTask);
      const result = await tasksService.getTask('testId', mockUser);
      expect(result).toEqual(mockTask);
    });
    //   it('calls TasksRepository.getTask and handles an error', async () => {
    //     tasksRepository.getTask.mockResolvedValue(null);
    //     expect(tasksService.getTask('testId', mockUser)).rejects.toThrow(
    //       NotFoundException,
    //     );
    //   });
  });
});

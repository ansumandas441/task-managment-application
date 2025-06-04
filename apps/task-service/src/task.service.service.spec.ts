import { Test, TestingModule } from '@nestjs/testing';
import { TaskServiceRepository } from './task.service.repository';
import { KafkaService, NOTIFICATION_TYPE } from './kafka/kafka.service';
import { CacheRepoService } from '../cacherepo/cacherepo.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { TaskStatus } from '../generated/prisma';
import { TaskService } from './task-service.service';

const mockTaskRepo = {
  create: jest.fn(),
  update: jest.fn(),
  getById: jest.fn(),
  updateStatus: jest.fn(),
  getAllTasks: jest.fn(),
  delete: jest.fn(),
};

const mockKafkaService = {
  sendNotification: jest.fn(),
};

const mockCacheService = {
  get: jest.fn(),
  set: jest.fn(),
  deleteByPattern: jest.fn(),
  delete: jest.fn(),
  getSingleTaskCacheKey: jest.fn().mockImplementation((uid, tid) => `task:${uid}:${tid}`),
  getAllTaskCacheKey: jest.fn().mockImplementation((uid) => `tasks:${uid}`),
  userCacheKeyPatterns: jest.fn().mockImplementation((uid) => [`task:${uid}:*`, `tasks:${uid}`]),
};

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        { provide: TaskServiceRepository, useValue: mockTaskRepo },
        { provide: KafkaService, useValue: mockKafkaService },
        { provide: CacheRepoService, useValue: mockCacheService },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    jest.clearAllMocks();
  });

  it('should create a task and send notification', async () => {
    const mockTask = { id: '1', title: 'New Task' };
    mockTaskRepo.create.mockResolvedValue(mockTask);

    const result = await service.create('user1', { title: 'New Task' } as any);

    expect(result).toEqual(mockTask);
    expect(mockKafkaService.sendNotification).toHaveBeenCalled();
    expect(mockCacheService.deleteByPattern).toHaveBeenCalled();
    expect(mockCacheService.delete).toHaveBeenCalled();
  });

  it('should update a task and send notification', async () => {
    const existingTask = { id: '1', title: 'Old Task' };
    const updatedTask = { id: '1', title: 'Updated Task' };
    mockTaskRepo.getById.mockResolvedValue(existingTask);
    mockTaskRepo.update.mockResolvedValue(updatedTask);

    const result = await service.update('user1', '1', { title: 'Updated Task' } as any);

    expect(result).toEqual(updatedTask);
    expect(mockKafkaService.sendNotification).toHaveBeenCalled();
  });

  it('should complete a task and send notification', async () => {
    const task = { id: '1', title: 'Task', status: TaskStatus.PENDING };
    const updatedTask = { ...task, status: TaskStatus.COMPLETED };
    mockTaskRepo.getById.mockResolvedValue(task);
    mockTaskRepo.updateStatus.mockResolvedValue(updatedTask);

    const result = await service.taskCompletion('user1', '1');

    expect(result).toEqual(updatedTask);
    expect(mockKafkaService.sendNotification).toHaveBeenCalled();
  });

  it('should get task by id with cache', async () => {
    const task = { id: '1', title: 'Task' };
    mockCacheService.get.mockResolvedValue(task);

    const result = await service.getById('user1', '1');
    expect(result).toEqual(task);
    expect(mockTaskRepo.getById).not.toHaveBeenCalled();
  });

  it('should get task by id and set cache if not cached', async () => {
    const task = { id: '1', title: 'Task' };
    mockCacheService.get.mockResolvedValue(null);
    mockTaskRepo.getById.mockResolvedValue(task);

    const result = await service.getById('user1', '1');

    expect(result).toEqual(task);
    expect(mockCacheService.set).toHaveBeenCalled();
  });

  it('should get all tasks with cache', async () => {
    const tasks = [{ id: '1' }];
    mockCacheService.get.mockResolvedValue(tasks);

    const result = await service.getAllPaginated('user1', {} as any);
    expect(result).toEqual(tasks);
  });

  it('should get all tasks from repo and cache it if not cached', async () => {
    const tasks = [{ id: '1' }];
    mockCacheService.get.mockResolvedValue(null);
    mockTaskRepo.getAllTasks.mockResolvedValue(tasks);

    const result = await service.getAllPaginated('user1', {} as any);
    expect(result).toEqual(tasks);
    expect(mockCacheService.set).toHaveBeenCalled();
  });

  it('should delete task and send notification', async () => {
    const task = { id: '1', title: 'Task' };
    mockTaskRepo.delete.mockResolvedValue(task);

    const result = await service.delete('user1', '1');
    expect(result).toEqual(task);
    expect(mockKafkaService.sendNotification).toHaveBeenCalled();
  });

  it('should throw not found on update if task does not exist', async () => {
    mockTaskRepo.getById.mockResolvedValue(null);
    await expect(service.update('user1', '999', {} as any)).rejects.toThrow(HttpException);
  });

  it('should throw not found on complete if task does not exist', async () => {
    mockTaskRepo.getById.mockResolvedValue(null);
    await expect(service.taskCompletion('user1', '999')).rejects.toThrow(HttpException);
  });

  it('should return null if task creation fails', async () => {
    mockTaskRepo.create.mockResolvedValue(null);
    const result = await service.create('user1', { title: 'Fail Task' } as any);
    expect(result).toBeNull();
  });

  it('should return null if task deletion fails', async () => {
    mockTaskRepo.delete.mockResolvedValue(null);
    const result = await service.delete('user1', '1');
    expect(result).toBeNull();
  });
});

import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { TaskDto } from './task.dto';
import { GetAllTaskRequestDto } from './get-all-task.dto';
import { TaskStatus } from '@task/generated/prisma';
import { TaskUpdateDto } from './task-update.dto';

describe('GetAllTaskRequestDto', () => {
  it('should validate correct input', async () => {
    const dto = plainToInstance(GetAllTaskRequestDto, {
      page: '0',
      limit: '10',
      order: 'asc',
      status: TaskStatus.PENDING,
      search: 'fix',
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail with invalid order', async () => {
    const dto = plainToInstance(GetAllTaskRequestDto, {
      order: 'invalid_order',
    });

    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'order')).toBe(true);
  });

  it('should fail if search exceeds 6 characters', async () => {
    const dto = plainToInstance(GetAllTaskRequestDto, {
      search: 'toolongsearch',
    });

    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'search')).toBe(true);
  });
});

describe('TaskDto', () => {
  it('should validate correct input', async () => {
    const dto = plainToInstance(TaskDto, {
      title: 'Fix bug',
      dueDate: 1720000000,
      description: 'Fix the memory leak in service',
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail if title is missing', async () => {
    const dto = plainToInstance(TaskDto, {
      dueDate: 1720000000,
    });

    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'title')).toBe(true);
  });

  it('should fail if dueDate is not a number', async () => {
    const dto = plainToInstance(TaskDto, {
      title: 'Fix bug',
      dueDate: 'not-a-number',
    });

    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'dueDate')).toBe(true);
  });
});

describe('TaskUpdateDto', () => {
  it('should validate partial update with only title', async () => {
    const dto = plainToInstance(TaskUpdateDto, {
      title: 'New Title',
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate update with all optional fields', async () => {
    const dto = plainToInstance(TaskUpdateDto, {
      title: 'New Title',
      description: 'Update description',
      dueDate: 1720000000,
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail if dueDate is invalid', async () => {
    const dto = plainToInstance(TaskUpdateDto, {
      dueDate: 'tomorrow',
    });

    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'dueDate')).toBe(true);
  });
});

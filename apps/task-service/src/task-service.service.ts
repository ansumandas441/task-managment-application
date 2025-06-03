import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TaskServiceRepository } from './task.service.repository';
import { TaskDto } from './dto/task.dto';
import { GetAllTaskRequestDto } from './dto/get-all-task.dto';
import { TaskUpdateDto } from './dto/task-update.dto';
import { KafkaService, NOTIFICATION_TYPE, NotificationMessage } from './kafka/kafka.service';
import { TaskStatus } from '../generated/prisma';
import { CacheRepoService } from '../cacherepo/cacherepo.service';
import { TaskNotificationMap } from './dto/notification-records';

@Injectable()
export class TaskService {
  constructor(
    private readonly taskRepository: TaskServiceRepository,
    private readonly kafkaService: KafkaService,
    private readonly cachearaepo: CacheRepoService,
  ) {}

  async create(userId: string, taskDto: TaskDto){
    console.log(`Creating task for user: ${userId}`);
    try {
      const task = await this.taskRepository.create(userId, taskDto);
      if(!task){
        console.warn(`Failed to create task for user: ${userId}`);
        return null;
      }

      console.log(`Task created successfully`);

      await this.notifyAndInvalidateCache(userId, NOTIFICATION_TYPE.TASK_CREATED, task.title); 

      return task
    } catch (error) {
      console.log(`Error creating task for user: ${userId} , error: ${error.message}`);
      throw error;
    }
  }

  async update(userId: string, taskId: string, taskUpdateDto: TaskUpdateDto){
    console.log(`Updating task for user: ${userId}`);

    try {
      const existingTask = await this.taskRepository.getById(userId, taskId);
      if(!existingTask){
        console.error(`Task does not exists`);
        throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
      }

      const updatedTask = await this.taskRepository.update(userId, taskId, taskUpdateDto);
      if(!updatedTask){
        console.warn(`Failed to update task or task not found`);
        return null;
      }

      console.log(`Task updated successfully`);

      await this.notifyAndInvalidateCache(userId, NOTIFICATION_TYPE.TASK_UPDATED, updatedTask.title); 

      return updatedTask;
    } catch (error) {
      `Error creating task for user: ${userId} , error: ${error.message}`
      throw error;
    }

  }

    async taskCompletion(userId: string, taskId: string){
    console.log(`Completing task for user: ${userId}`);

    try {
      const existingTask = await this.taskRepository.getById(userId, taskId);
      if(!existingTask){
        console.error(`Task does not exists`);
        throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
      }

      const updatedTask = await this.taskRepository.updateStatus(userId, taskId, TaskStatus.COMPLETED);
      if(!updatedTask){
        console.warn(`Failed to update task or task not found`);
        return null;
      }

      console.log(`Task updated successfully`);

      await this.notifyAndInvalidateCache(userId, NOTIFICATION_TYPE.TASK_COMPLETED, updatedTask.title); 

      return updatedTask;
    } catch (error) {
      `Error creating task for user: ${userId} , error: ${error.message}`
      throw error;
    }

  }

  async getById(userId: string, taskId: string){
    console.log(`Fetching task by ID for user: ${userId}, taskId: ${taskId}`);

    try {
      const key = this.cachearaepo.getSingleTaskCacheKey(userId, taskId);
      const cachedTask = await this.cachearaepo.get(key);
      if(cachedTask) {
        return cachedTask;
      }

      const task = await this.taskRepository.getById(userId, taskId);
      if (!task) {
        console.warn(`Task not found or user doesn't have access for taskId: ${taskId}`);
        throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
      }

      console.log(`Task retrieved successfully`);

      await this.cachearaepo.set(key, task);

      return task;
    } catch (error) {
      console.log(`Error fetching task by ID for user: ${userId} , error: ${error.message}`);
      throw error;
    }
  }

  async getAllPaginated(userId: string, getAllTaskDto: GetAllTaskRequestDto){
    console.log(`Fetching paginated tasks for user: ${userId}`);

    try {

      const key = this.cachearaepo.getAllTaskCacheKey(userId, getAllTaskDto);
      const cachedTasks = await this.cachearaepo.get(key);
      if(cachedTasks) {
        return cachedTasks;
      }

      const tasks = await this.taskRepository.getAllTasks(userId, getAllTaskDto);
      console.log('Tasks: ', tasks);

      if (!tasks) {
        console.warn(`No tasks found for user with given criteria`);
        throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
      }

      console.log(`Tasks retrieved successfully`);

      await this.cachearaepo.set(key, tasks);

      return tasks;
    } catch (error) {
      console.log(`Error fetching paginated tasks for user: ${userId} , error: ${error.message}`);
      throw error;
    }
  }

  async delete(userId: string, taskId: string){
    console.log(`Deleting task for user: ${userId}`);

    try {
      const deletedTask = await this.taskRepository.delete(userId, taskId);
      if(!deletedTask){
        console.warn(`Failed to delete task or task not found`);
        return null;
      }

      console.log(`Task deleted successfully`);

      await this.notifyAndInvalidateCache(userId, NOTIFICATION_TYPE.TASK_DELETED, deletedTask.title); 

      return deletedTask;
    } catch (error) {
      console.log(`Error deleting task for user: ${userId}, taskId: ${taskId}: error: ${error.message}`);
      throw error;
    }
  }

  private async notifyAndInvalidateCache(userId: string, notificationType: NOTIFICATION_TYPE, taskTitle: string) {
    const pattern = this.cachearaepo.userCacheKeyPatterns(userId);

    const notification = this.createTaskNotification(userId, notificationType, taskTitle);

    await Promise.all([
      this.kafkaService.sendNotification(notification),
      this.cachearaepo.deleteByPattern(pattern),
    ]);
  }

  private createTaskNotification(
    userId: string,
    type: NOTIFICATION_TYPE,
    taskTitle: string
  ): NotificationMessage {
    const { title, getMessage } = TaskNotificationMap[type];

    return {
      userId,
      type,
      title,
      message: getMessage(taskTitle),
      timestamp: new Date(),
    };
  }

}

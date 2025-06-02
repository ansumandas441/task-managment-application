import { Injectable } from '@nestjs/common';
import { TaskServiceRepository } from './task.service.repository';
import { TaskDto } from './dto/task.dto';
import { GetAllTaskRequestDto } from './dto/get-all-task.dto';
import { TaskUpdateDto } from './dto/task-update.dto';

@Injectable()
export class TaskService {
  constructor(
    private readonly taskRepository: TaskServiceRepository,
  ) {}

  async create(userId: string, taskDto: TaskDto){
    console.log(`Creating task for user: ${userId}`);
    try {
      const task = await this.taskRepository.create(userId, taskDto);
      if(!task){
        console.warn(`Failed to create task for user: ${userId}`);
        return null;
      }

      `Task created successfully`

      return task
    } catch (error) {
      `Error creating task for user: ${userId} , error: ${error.message}`
      return null;
    }
  }

  async update(userId: string, taskUpdateDto: TaskUpdateDto){
    `Updating task for user: ${userId}`

    try {
      const updatedTask = await this.taskRepository.update(userId, taskUpdateDto);
      if(!updatedTask){
        console.warn(`Failed to update task or task not found`);
        return null;
      }

      `Task updated successfully`

      return updatedTask;
    } catch (error) {
      `Error creating task for user: ${userId} , error: ${error.message}`
      return null
    }

  }

  async getById(userId: string, taskId: string){
    `Fetching task by ID for user: ${userId}, taskId: ${taskId}`

    try {
      const task = await this.taskRepository.getById(userId, taskId);
      if (!task) {
        `Task not found or user doesn't have access for taskId: ${taskId}`;
        return null;
      }

      `Task retrieved successfully`

      return task;
    } catch (error) {
      `Error fetching task by ID for user: ${userId} , error: ${error.message}`
      return null;
    }
  }

  async getAllPaginated(userId: string, getAllTaskDto: GetAllTaskRequestDto){
    try {
      `Fetching paginated tasks for user: ${userId}`
      const tasks = await this.taskRepository.getAllTasks(userId, getAllTaskDto);

      if (!tasks) {
        console.warn(`No tasks found for user with given criteria`);
        return null;
      }

      return tasks;
    } catch (error) {
      `Error fetching paginated tasks for user: ${userId} , error: ${error.message}`
      return null
    }
  }

  async delete(userId: string, taskId: string){
    `Deleting task for user: ${userId}`

    try {
      const updatedTask = await this.taskRepository.delete(userId, taskId);
      if(!updatedTask){
        console.warn(`Failed to delete task or task not found`);
        return null;
      }

      `Task deleted successfully`

      return updatedTask;
    } catch (error) {
      `Error deleting task for user: ${userId}, taskId: ${taskId}`
      return null;
    }
  }
}

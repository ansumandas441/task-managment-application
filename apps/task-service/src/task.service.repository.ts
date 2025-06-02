import { Injectable } from "@nestjs/common";
import { TaskDto } from "./dto/task.dto";
import { Task } from "../generated/prisma";
import { PrismaService } from "../prisma/prisma.service";
import { ResultPagination } from "./response.ts/response.dto";
import { GetAllTaskRequestDto } from "./dto/get-all-task.dto";
import { skip } from "node:test";
import { TaskUpdateDto } from "./dto/task-update.dto";

@Injectable()
export class TaskServiceRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(userId: string, taskDto: TaskDto): Promise<Omit<Task, 'user_id'> | null> {
    try {
        const { title, description, status, dueDate } = taskDto;
        const dueDateFormatted = new Date(dueDate * 1000);
        const task = await this.prismaService.getClient().task.create({
            data: {
                title,
                description,
                status,
                user_id: userId,
                due_date: dueDateFormatted,
            },
            select: {
                id: true,
                title: true,
                description: true,
                status: true,
                due_date: true,
                createdAt: true,
                updatedAt: true,
            }
        });

        return task;
    } catch (error) {
        console.log(`UserServiceRepository::create ${error}`);
        return null;
    }
  }

  async update(userId: string, taskUpdateDto: TaskUpdateDto): Promise<Omit<Task, 'user_id'> | null> {
    try {
        const task = await this.prismaService.getClient().task.findUnique({
            where: {
                id: taskUpdateDto.taskId,
                user_id: userId,
            },
            select: {
                id: true,
                title: true,
                description: true,
                status: true,
                due_date: true,
                createdAt: true,
                updatedAt: true,
            }
        });

        return task;
    } catch (error) {
        console.log(`UserServiceRepository::create ${error}`);
        return null;
    }
  }

  async delete(userId: string, taskId: string): Promise<Omit<Task, 'user_id'> | null> {
    try {
        const task = await this.prismaService.getClient().task.delete({
            where: {
                id: taskId,
                user_id: userId
            }
        });

        return task;
    } catch (error) {
        console.log(`UserServiceRepository::create ${error}`);
        return null;
    }
  }

    async getAllTasks(
        userId: string,
        getAllTaskDto: GetAllTaskRequestDto,
    ): Promise<ResultPagination<Omit<Task, 'user_id'>>> {
        const { page, limit, order, status, search } = getAllTaskDto;

        const offset = (page - 1) * limit;
        const outputOrder = order === 'asc' ? 'asc' : 'desc';

        const query: any = { user_id: userId, outputOrder };
        const orderBy: any = { outputOrder };

        if(status) {
            query.status = status;
        }

        if(search) {
            query.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        const tasks = await this.prismaService.getClient().task.findMany({
            where: query,
            skip: offset,
            take: limit,
            orderBy: orderBy,
            select: {
                id: true,
                title: true,
                description: true,
                status:  true,
                due_date: true,
                createdAt: true,
                updatedAt: true,
            }
        });

        const totalCount = await this.prismaService.getClient().task.count({ where: query });
        const totalPages = Math.ceil(totalCount / limit);

        return new ResultPagination(tasks, totalPages, page, limit, totalCount);
    }

    async getById(
        userId: string,
        taskId: string,
    ): Promise<Task | null> {
        try {
            const task = await this.prismaService.getClient().task.findUnique({
                where: {
                    id: taskId,
                    user_id: userId,
                }
            });
            
            return task;
        } catch (error) {
            console.log(error.message);
            return null;
        }
    }
}
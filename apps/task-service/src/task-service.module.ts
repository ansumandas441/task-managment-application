import { Module } from '@nestjs/common';
import { TaskServiceController } from './task-service.controller';
import { TaskService } from './task-service.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [],
  controllers: [TaskServiceController],
  providers: [TaskService, PrismaService],
})
export class TaskServiceModule {}

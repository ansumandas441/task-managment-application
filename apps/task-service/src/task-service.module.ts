import { Module } from '@nestjs/common';
import { TaskServiceController } from './task-service.controller';
import { TaskService } from './task-service.service';
import { PrismaService } from '../prisma/prisma.service';
import { TaskServiceRepository } from './task.service.repository';
import { JwtModule } from '@nestjs/jwt';
import { KafkaModule } from './kafka/kafka.module';
import { ConfigModule } from '@nestjs/config';
import { CacherepoModule } from '../cacherepo/cacherepo.module';

@Module({
  imports: [
    ConfigModule.forRoot({
          isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '2h' },
    }),
    KafkaModule,
    CacherepoModule,
  ],
  controllers: [TaskServiceController],
  providers: [TaskService, TaskServiceRepository, PrismaService],
})
export class TaskServiceModule {}

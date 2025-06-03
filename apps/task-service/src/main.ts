import { NestFactory } from '@nestjs/core';
import { TaskServiceModule } from './task-service.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(TaskServiceModule, new FastifyAdapter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, 
    }),
  );

  app.setGlobalPrefix('tasks');
  await app.listen(process.env.TASK_SERVICE_PORT ?? 3000);
}
bootstrap();

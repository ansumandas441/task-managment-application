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

  const port = process.env.TASK_SERVICE_PORT ?? 3001;
  const host = '0.0.0.0';

  await app.listen(port, host, ()=>{
    console.log(`🚀 User service running on http://${host}:${port}`);
  });
}
bootstrap();

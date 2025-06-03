import { NestFactory } from '@nestjs/core';
import { UserServiceModule } from './user-service.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(UserServiceModule, new FastifyAdapter());
  app.setGlobalPrefix('users');
  await app.listen(process.env.USER_SERVICE_PORT ?? 3000);
}
bootstrap();

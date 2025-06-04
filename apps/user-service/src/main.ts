import { NestFactory } from '@nestjs/core';
import { UserServiceModule } from './user-service.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(UserServiceModule, new FastifyAdapter());
  app.setGlobalPrefix('users');

  const port = process.env.USER_SERVICE_PORT ?? 3000;
  const host = '0.0.0.0';

  await app.listen(port, host, ()=>{
    console.log(`🚀 User service running on http://${host}:${port}`);
  });

}
bootstrap();

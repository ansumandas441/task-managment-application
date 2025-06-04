import { NestFactory } from '@nestjs/core';
import { NotificationServiceModule } from './notification-service.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(NotificationServiceModule, new FastifyAdapter());
    const port = process.env.NOTIFICATION_SERVICE_PORT ?? 3002;
  const host = '0.0.0.0';

  await app.listen(port, host, ()=>{
    console.log(`🚀 User service running on http://${host}:${port}`);
  });
}
bootstrap();

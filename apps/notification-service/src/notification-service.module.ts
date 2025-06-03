import { Module } from '@nestjs/common';
import { NotificationService } from './notification-service.service';
import { ConfigModule } from '@nestjs/config';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    KafkaModule,
  ],
  providers: [NotificationService],
})
export class NotificationServiceModule {}

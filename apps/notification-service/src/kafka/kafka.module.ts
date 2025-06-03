import { Module } from '@nestjs/common';
import { KafkaConfig } from './kafka.config';
import { KafkaService } from './kafka.service';

@Module({
  providers: [KafkaConfig, KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {}
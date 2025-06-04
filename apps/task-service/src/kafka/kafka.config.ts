import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Consumer, Kafka, Producer } from "kafkajs";

const CLIENT_ID = 'task-notification-app';
const GROUP_ID = 'notification-group';

@Injectable()
export class KafkaConfig {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;

  constructor(private configService: ConfigService) {
    const brokers = this.configService.get<string>('KAFKA_BROKERS', 'kafka:9092').split(',');

    this.kafka = new Kafka({
      clientId: CLIENT_ID,
      brokers: brokers, // Update with your Kafka broker addresses
      retry: {
        initialRetryTime: 100,
        retries: 8,
      },
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: GROUP_ID });
  }

  async createProducer(): Promise<Producer> {
    await this.producer.connect();
    return this.producer;
  }

  async createConsumer(): Promise<Consumer> {
    await this.consumer.connect();
    return this.consumer;
  }

  async disconnectProducer(): Promise<void> {
    await this.producer.disconnect();
  }

  async disconnectConsumer(): Promise<void> {
    await this.consumer.disconnect();
  }
}
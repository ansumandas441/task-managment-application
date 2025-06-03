import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Producer, Consumer } from 'kafkajs';
import { KafkaConfig } from './kafka.config';

export enum NOTIFICATION_TYPE {
  TASK_CREATED = 'TASK_CREATED',
  TASK_UPDATED = 'TASK_UPDATED',
  TASK_COMPLETED = 'TASK_COMPLETED',
  TASK_DELETED = 'TASK_DELETED',
}

export interface NotificationMessage {
  userId: string;
  type: NOTIFICATION_TYPE;
  title: string;
  message: string;
  timestamp: Date;
}

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private producer: Producer;
  private consumer: Consumer;

  constructor(private kafkaConfig: KafkaConfig) {}

  async onModuleInit() {
    this.producer = await this.kafkaConfig.createProducer();
    this.consumer = await this.kafkaConfig.createConsumer();
  }

  async onModuleDestroy() {
    await this.kafkaConfig.disconnectProducer();
    await this.kafkaConfig.disconnectConsumer();
  }

  async sendNotification(message: NotificationMessage): Promise<void> {
    try {
      await this.producer.send({
        topic: 'notifications',
        messages: [
          {
            key: message.userId, 
            value: JSON.stringify(message),
            headers: {
              'message-type': message.type,
              'timestamp': new Date().toISOString(),
            },
          },
        ],
      });
      console.log('Notification sent successfully:', message.type);
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }

  async subscribeToNotifications(callback: (message: NotificationMessage) => void): Promise<void> {
    try {
      await this.consumer.subscribe({ topic: 'notifications', fromBeginning: false });

      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          try {
            const notificationData = JSON.parse(message.value?.toString() || '{}') as NotificationMessage;
            console.log(`Received notification: ${notificationData.type} for user: ${notificationData.userId}`);
            await callback(notificationData);
          } catch (error) {
            console.error('Error processing notification message:', error);
          }
        },
      });
    } catch (error) {
      console.error('Error subscribing to notifications:', error);
      throw error;
    }
  }
}
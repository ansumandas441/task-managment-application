import { Injectable, OnModuleInit } from '@nestjs/common';
import { KafkaService, NotificationMessage } from './kafka/kafka.service';

export enum NOTIFICATION_TYPE {
  TASK_CREATED = 'TASK_CREATED',
  TASK_UPDATED = 'TASK_UPDATED',
  TASK_COMPLETED = 'TASK_COMPLETED',
  TASK_DELETED = 'TASK_DELETED',
}

export interface UserNotification {
  id: string;
  userId: string;
  type: NOTIFICATION_TYPE;
  title: string;
  message: string;
  createdAt: Date;
}

@Injectable()
export class NotificationService implements OnModuleInit {
  private notifications: UserNotification[] = [];

  constructor(private kafkaService: KafkaService) {}

  async onModuleInit() {
    await this.kafkaService.subscribeToNotifications(this.handleNotification.bind(this));
  }

  private async handleNotification(message: NotificationMessage): Promise<void> {
    try {
      const notification: UserNotification = {
        id: Math.random().toString(36).substr(2, 9),
        userId: message.userId,
        title: message.title,
        message: message.message,
        type: message.type,
        createdAt: message.timestamp,
      };

      this.notifications.push(notification);

      console.log(`Notification processed for user ${message.userId}:`, notification);

      await this.sendPushNotification(notification);

    } catch (error) {
      console.error('Error handling notification:', error);
    }
  }

  private async sendPushNotification(notification: UserNotification): Promise<void> {
    console.log(`Push notification sent to user ${notification.userId}`);
  }
}

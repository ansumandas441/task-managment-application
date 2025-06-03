import { NOTIFICATION_TYPE } from "../kafka/kafka.service";

export const TaskNotificationMap: Record<
  NOTIFICATION_TYPE,
  { title: string; getMessage: (taskTitle: string) => string }
> = {
  [NOTIFICATION_TYPE.TASK_CREATED]: {
    title: 'New Task Created',
    getMessage: (title) => `Your task "${title}" has been created successfully.`,
  },
  [NOTIFICATION_TYPE.TASK_UPDATED]: {
    title: 'Task Updated',
    getMessage: (title) => `Your task "${title}" has been updated successfully.`,
  },
  [NOTIFICATION_TYPE.TASK_COMPLETED]: {
    title: 'Task Completed',
    getMessage: (title) => `Your task "${title}" has been completed successfully.`,
  },
  [NOTIFICATION_TYPE.TASK_DELETED]: {
    title: 'Task Deleted',
    getMessage: (title) => `Your task "${title}" has been deleted.`,
  },
};
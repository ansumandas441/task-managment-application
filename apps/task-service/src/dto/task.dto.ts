import { TaskStatus } from "apps/task-service/generated/prisma";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

export class TaskDto {
    @IsString()
    title: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsEnum(TaskStatus)
    status: TaskStatus;

    @IsNumber()
    dueDate: number; //In seconds
}

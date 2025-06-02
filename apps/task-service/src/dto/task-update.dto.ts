import { IsNumber, IsOptional, IsString } from "class-validator";

export class TaskUpdateDto {
    @IsString()
    taskId: string;

    @IsString()
    @IsOptional()
    title: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsNumber()
    @IsOptional()
    dueDate: number; //In seconds
}
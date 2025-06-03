import { IsNumber, IsOptional, IsString } from "class-validator";

export class TaskDto {
    @IsString()
    title: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsNumber()
    dueDate: number; //In seconds
}

import { TaskStatus } from "apps/task-service/generated/prisma";
import { Transform } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class GetAllTaskRequestDto {
    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => Number(value))
    @Min(0)
    page: number;

    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => Number(value))
    @Min(0)
    limit: number;

    @IsString()
    @IsOptional()
    order: string;

    @IsEnum(TaskStatus)
    @IsOptional()
    status: TaskStatus;

    @IsOptional()
    @IsString()
    search?: string;
}
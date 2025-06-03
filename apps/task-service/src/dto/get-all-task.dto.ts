import { TaskStatus } from "@task/generated/prisma";
import { Transform } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, IsString, MaxLength, Min } from "class-validator";

enum ORDER {
    ASCENDING = 'asc',
    DESCENDING = 'desc',
}

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

    @IsEnum(ORDER)
    @IsOptional()
    order: ORDER;

    @IsEnum(TaskStatus)
    @IsOptional()
    status: TaskStatus;

    @IsOptional()
    @IsString()
    @MaxLength(6)
    search?: string;
}
import { IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class UserRegisterDto {
    @IsString()
    @IsOptional()
    firstname: string;

    @IsString()
    lastname: string;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(8)
    password: string;
}

export class UserLoginDto {
    @IsString()
    email: string;

    @IsString()
    password: string;
}

export type JwtPayload = {
    sub: string,
    name: string,
    createdAt: number,
}
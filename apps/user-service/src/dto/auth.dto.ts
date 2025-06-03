import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class UserRegisterDto {
    @IsString()
    firstname: string;

    @IsString()
    lastname: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    password: string;
}

export class UserLoginDto {
    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(8)
    password: string;
}

export type JwtPayload = {
    sub: string,
    name: string,
    createdAt: number,
}
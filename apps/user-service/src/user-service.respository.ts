import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { User } from "../generated/prisma";
import { UserRegisterDto } from "./dto/auth.dto";

@Injectable()
export class UserServiceRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createStepDto: UserRegisterDto, password_hash: string): Promise<Omit<User, 'password_hash'> | null> {
    try {
    const { firstname, lastname, email } = createStepDto;
    const user = await this.prismaService.getClient().user.create({
        data: {
            email,
            firstname,
            lastname,
            password_hash,
        },
        select: {
            id: true,
            email: true,
            firstname: true,
            lastname: true,
            createdAt: true,
            updatedAt: true,
        }
    });

    return user;
    } catch (error) {
        console.log(`UserServiceRepository::create ${error}`);
        return null;
    }
  }

  async findByEmailAddress(email: string) {
    try {
        const user = await this.prismaService.getClient().user.findUnique({
            where: {
                email: email
            }
        });

        return user;
    } catch (error) {
        console.log(`UserServiceRepository::create ${error}`);
        return null;
    }
  }
}
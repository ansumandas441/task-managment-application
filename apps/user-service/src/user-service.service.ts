import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { hashPassword, verifyPassword } from './utils/password-utils';
import { UserServiceRepository } from './user-service.respository';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, UserLoginDto, UserRegisterDto } from './dto/auth.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserServiceRepository,
    private jwtService: JwtService
  ) {}

  async register(userRegisterDto: UserRegisterDto) {
    try {
      const hashedPassword = await hashPassword(userRegisterDto.password);

      const user = await this.userRepository.create(userRegisterDto, hashedPassword);
      if(!user) {
        console.warn('User creation failed');
        return null;
      }

      return user;
    } catch (error) {
      console.log(`UserService::register ${error.message}`);
      throw new HttpException('Registration failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  async login(userLoginDto: UserLoginDto) {
    try {
      const user = await this.userRepository.findByEmailAddress(userLoginDto.email);
      if(!user) {
        return null;
      }

      const isPasswordValid = await verifyPassword(user.password_hash, userLoginDto.password)

      if (!isPasswordValid) {
        console.warn('Invalid password');
        return null;
      }

      const payload: JwtPayload = {
        sub: user.id,
        name: user.firstname,
        createdAt: Math.floor(user.createdAt.getTime()),
      }

      const jwtToken = await this.jwtService.signAsync(payload);

      return {
        accessToken: jwtToken
      }

    } catch (error) {
      console.log(`UserService::login ${error}`);
      throw new HttpException('Login failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  // async refreshToken(refreshToken: string): Promise<TokenResponse> {
  //   try {
  //     // Verify refresh token
  //     const payload = await this.jwtService.verifyRefreshToken(refreshToken);
      
  //     // Get user to ensure they still exist
  //     const user = await this.usersService.findById(payload.sub);
  //     if (!user) {
  //       throw new UnauthorizedException('User not found');
  //     }

  //     // Generate new tokens
  //     return this.jwtService.generateTokens({
  //       id: user.id,
  //       email: user.email,
  //     });
  //   } catch (error) {
  //     throw new UnauthorizedException('Invalid refresh token');
  //   }
  // }


}

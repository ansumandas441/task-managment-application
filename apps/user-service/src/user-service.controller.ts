import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { UserService } from './user-service.service';
import { UserLoginDto, UserRegisterDto } from './dto/auth.dto';

@Controller()
export class UserServiceController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async register(
    @Body() userRegisterDto: UserRegisterDto
  ) {
    const result = await this.userService.register(userRegisterDto);
    if(!result) {
      throw new HttpException('INTERNAL_SERVER_ERROR' , HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return result;
  }

  @Post('login')
  async login(
    @Body() userLoginDto: UserLoginDto
  ) {
    const result = await this.userService.login(userLoginDto);
    if(!result) {
      throw new HttpException('INTERNAL_SERVER_ERROR' , HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return result;
  }
}

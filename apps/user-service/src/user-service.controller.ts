import { Controller, Get, Post } from '@nestjs/common';
import { UserServiceService } from './user-service.service';

@Controller()
export class UserServiceController {
  constructor(private readonly userServiceService: UserServiceService) {}

  @Post('signup')
  signUp() {
    
  }

  @Post('login')
  login() {

  }

  @Post('logout')
  logout() {

  }
}

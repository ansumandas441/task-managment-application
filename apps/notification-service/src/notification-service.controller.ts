import { Controller, Get, Post } from '@nestjs/common';
import { NotificationServiceService } from './notification-service.service';

@Controller('users')
export class NotificationServiceController {
  constructor(private readonly notificationServiceService: NotificationServiceService) {}

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

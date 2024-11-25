import { Controller,  } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // function when user was created (for RabitMQ) 
  @EventPattern('user_created')
  handleRegisterUser(@Payload() user){
    return this.appService.confirmUserRegistration(user.user, user.token);
  }
}

import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class AppService {
    constructor(private readonly emailServer:EmailService){}

    // for send email when user successfully registered
    async confirmUserRegistration(user:CreateUserDto, token:string){
        console.log(`REceived a new user registration request for ${user}`)

        await this.emailServer.sendUserConfirnation(user.email,user.userName, token)
    }
}

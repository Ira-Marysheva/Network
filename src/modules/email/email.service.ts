import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
    constructor(private mailerService: MailerService){}
    
    async sendUserConfirnation(email:string, userName:string, token:string){
        const url = `http://localhost:3000/api/auth/confirm/${token}`
        const unsubscribe = `http://localhost:3000/api/auth/deleteConfirm/${token}`

        await this.mailerService.sendMail({
            to:email,
            subject:'Welcome to Network application! Pleace confirm your email',
            template:'./confirm',
            context:{
                name:userName,
                url,
                unsubscribe
            } 
        })
    }
}

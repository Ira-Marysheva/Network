import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      imports:[ConfigModule],
      useFactory:(configService:ConfigService)=>({
        transport: {
          host: configService.get('EMAIL_HOST'),
          secure: false,
          auth: {
            user: configService.get('EMAIL_USER'),
            pass: configService.get('EMAIL_PASSWORD')
          },
        },
        defaults: {
          from: '"No Reply" <noreply@example.com>',
        },
        template:{
          dir:join(__dirname,'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          }
        }
      }),
      inject:[ConfigService],
    })
  ],
  providers: [EmailService],
  exports:[EmailService]
})
export class EmailModule {}

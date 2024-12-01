import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import * as cookieParser from 'cookie-parser';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); // it iw need for use pipe decorator @IsString/IsNumber.. in local object DTO
  app.setGlobalPrefix('api');
  app.enableCors(); // для забезпечення безпеки та захисту користувачів від зловмисників через протокол НТТР

  // cookie
  app.use(cookieParser())
  //create folder for upload files
  const uploadDir= join(process.cwd(), 'upload');
  if(!existsSync(uploadDir)){
    mkdirSync(uploadDir);
  }
  //initialize Swagger http://localhost:3000/api
  const config = new DocumentBuilder()
    .setTitle('Network')
    .setDescription('Networks API')
    .setVersion('1.0')
    // .addTag('Network')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);

  const emailMicroservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options:{
      urls:['amqp://localhost:5672'],
      queue:'registered_queue', // need add new queue 'updateUser_queue'
      queueOptions: {
        durable: false
      },
    },
  })
  await emailMicroservice.listen()
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); // it iw need for use pipe decorator @IsString/IsNumber.. in local object DTO
  app.setGlobalPrefix('api');
  app.enableCors(); // для забезпечення безпеки та захисту користувачів від зловмисників через протокол НТТР

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
}
bootstrap();

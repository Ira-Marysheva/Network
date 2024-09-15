import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); // it iw need for use pipe decorator @IsString/IsNumber.. in local object DTO
  app.setGlobalPrefix('api');
  app.enableCors(); // для забезпечення безпеки та захисту користувачів від зловмисників через протокол НТТР
  await app.listen(3000);
}
bootstrap();

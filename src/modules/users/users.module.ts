import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { extname, join } from 'path';
import { MulterModule } from '@nestjs/platform-express';
import{ diskStorage } from 'multer';
import User from './entities/user.entity';

// create 'uploads' file to root
const uploadDir = join(process.cwd(), 'upload');

@Module({
  imports: [
    // multer middleware
    MulterModule.register({
      // where to store the file
      storage:diskStorage({ 
        destination:(req, file, callback) => {
          callback(null, uploadDir)
        },
        // unic name of the file
      filename(req, file, callback) {
        const ext = extname(file.originalname);
        const filename = `${Date.now()}${ext}`;
        callback(null, filename);
      },
      }),
      //check file type
      fileFilter: (req, file, callback) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
          callback(null, true);
        } else {
          callback(new Error('Only images are allowed...'), false);
        }}
    }),
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '30d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

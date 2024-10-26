import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import{ diskStorage } from 'multer';
import { extname, join } from 'path';

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
    })
  ],
  controllers: [UploadController]
})
export class UploadModule {}
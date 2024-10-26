import { Controller, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
    @Post('/uploadImage')
    @UseInterceptors(FileInterceptor('file'))
    async uploadImage(@UploadedFile() file) {
        return "upload success"
    }
}

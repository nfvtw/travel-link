import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Controller('files')
export class FilesController {

  @Post('upload')
  @UseInterceptors(FileInterceptor('image', { 
    storage: diskStorage({
      destination: './uploads', 
      filename: (req, file, cb) => {
        const uniqueName = uuidv4() + extname(file.originalname);
        cb(null, uniqueName);
      }
    })
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    const fileUrl = `/uploads/${file.filename}`;

    return {
      message: 'Файл успешно сохранен',
      url: fileUrl,
    };
  }
}
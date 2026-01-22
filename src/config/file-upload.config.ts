import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestException } from '@nestjs/common';

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads/courses',
    filename: (req, file, callback) => {
      const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
      callback(null, uniqueName);
    },
  }),
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
  fileFilter: (req, file, callback) => {
    if (file.fieldname === 'banner') {
      
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
        return callback(
          new BadRequestException('Only image files are allowed for banner'),
          false,
        );
      }
    } else if (file.fieldname === 'introVideo') {
      
      if (!file.mimetype.match(/\/(mp4|avi|mov|wmv|flv|webm)$/)) {
        return callback(
          new BadRequestException('Only video files are allowed for introVideo'),
          false,
        );
      }
    }
    callback(null, true);
  },
};

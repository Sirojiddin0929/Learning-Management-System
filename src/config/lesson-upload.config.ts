import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestException } from '@nestjs/common';

export const lessonMulterConfig = {
  storage: diskStorage({
    destination: './uploads/lessons',
    filename: (req, file, callback) => {
      const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
      callback(null, uniqueName);
    },
  }),
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
  fileFilter: (req, file, callback) => {
    if (file.fieldname === 'video') {
      
      if (!file.mimetype.match(/\/(mp4|avi|mov|wmv|flv|webm|mkv)$/)) {
        return callback(
          new BadRequestException('Only video files are allowed'),
          false,
        );
      }
    }
    callback(null, true);
  },
};

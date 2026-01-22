import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

export const lessonFilesMulterConfig = {
  storage: diskStorage({
    destination: './uploads/lesson-files',
    filename: (req, file, callback) => {
      const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
      callback(null, uniqueName);
    },
  }),
  limits: {
    fileSize: 50 * 1024 * 1024, 
  },
};

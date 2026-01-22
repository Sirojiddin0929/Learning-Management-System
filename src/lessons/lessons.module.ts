import { Module } from '@nestjs/common';
import { LessonsController, LessonsApiController } from './lessons.controller';
import { LessonFilesController } from './lesson-files.controller';
import { LessonsService } from './lessons.service';
import { LessonFilesService } from './lesson-files.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [LessonsController, LessonsApiController, LessonFilesController],
  providers: [LessonsService, LessonFilesService],
})
export class LessonsModule {}

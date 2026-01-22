import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { AuthModule } from '../auth/auth.module';
import { multerConfig } from '../config/file-upload.config';

@Module({
  imports: [
    AuthModule,
    MulterModule.register(multerConfig),
  ],
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}

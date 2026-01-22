import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  ParseIntPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiConsumes } from '@nestjs/swagger';
import { LessonFilesService } from './lesson-files.service';
import { CreateLessonFilesDto } from './dto/create-lesson-files.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';
import { lessonFilesMulterConfig } from '../config/lesson-files-upload.config';

@ApiTags('Lesson Files')
@Controller('lesson-files')
export class LessonFilesController {
  constructor(private readonly lessonFilesService: LessonFilesService) {}

  @ApiBearerAuth('access-token')
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MENTOR, UserRole.ADMIN)
  @UseInterceptors(FilesInterceptor('files', 10, lessonFilesMulterConfig))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload files for a lesson (Admin/Mentor)' })
  createLessonFiles(
    @Body() dto: CreateLessonFilesDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.lessonFilesService.createLessonFiles(dto, files);
  }

  @ApiBearerAuth('access-token')
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MENTOR, UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a lesson file (Admin/Mentor)' })
  @ApiParam({ name: 'id', description: 'Lesson file ID' })
  deleteLessonFile(@Param('id', ParseIntPipe) id: number) {
    return this.lessonFilesService.deleteLessonFile(id);
  }

  @ApiBearerAuth('access-token')
  @Get('lesson/:lesson_id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MENTOR, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all files for a lesson (Admin/Mentor)' })
  @ApiParam({ name: 'lesson_id', description: 'Lesson UUID' })
  getLessonFiles(@Param('lesson_id') lessonId: string) {
    return this.lessonFilesService.getLessonFiles(lessonId);
  }
}

import { 
  Controller, 
  Post, 
  Put, 
  Patch,
  Delete, 
  Body, 
  Get, 
  Param, 
  Query, 
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiQuery, ApiConsumes } from '@nestjs/swagger';
import { LessonsService } from './lessons.service';
import { CreateLessonSectionDto } from './dto/create-lesson-section.dto';
import { UpdateLessonSectionDto } from './dto/update-lesson-section.dto';
import { QueryLessonSectionsDto } from './dto/query-lesson-sections.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { UpdateLessonViewDto } from './dto/update-lesson-view.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';
import { lessonMulterConfig } from '../config/lesson-upload.config';


@ApiTags('Lessons')
@Controller('lessons')
export class LessonsApiController {
  constructor(private readonly lessonsService: LessonsService) {}

  @ApiBearerAuth('access-token')
  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MENTOR, UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('video', lessonMulterConfig))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new lesson (Admin/Mentor)' })
  createLesson(
    @Body() dto: CreateLessonDto,
    @UploadedFile() video?: Express.Multer.File,
  ) {
    return this.lessonsService.createLesson(dto, video);
  }

  @ApiBearerAuth('access-token')
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MENTOR, UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('video', lessonMulterConfig))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update a lesson (Admin/Mentor)' })
  @ApiParam({ name: 'id', description: 'Lesson UUID' })
  updateLesson(
    @Param('id') id: string,
    @Body() dto: UpdateLessonDto,
    @UploadedFile() video?: Express.Multer.File,
  ) {
    return this.lessonsService.updateLesson(id, dto, video);
  }

  @ApiBearerAuth('access-token')
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MENTOR, UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a lesson (Admin/Mentor)' })
  @ApiParam({ name: 'id', description: 'Lesson UUID' })
  deleteLesson(@Param('id') id: string) {
    return this.lessonsService.deleteLesson(id);
  }

  @ApiBearerAuth('access-token')
  @Get('detail/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MENTOR, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get lesson details (Admin/Mentor)' })
  @ApiParam({ name: 'id', description: 'Lesson UUID' })
  getLessonDetail(@Param('id') id: string) {
    return this.lessonsService.getLessonDetail(id);
  }

  @ApiBearerAuth('access-token')
  @Get('single/:lessonId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Get single lesson for student' })
  @ApiParam({ name: 'lessonId', description: 'Lesson UUID' })
  getLessonSingle(@Param('lessonId') lessonId: string, @Request() req) {
    return this.lessonsService.getLessonSingle(lessonId, req.user.id);
  }

  @ApiBearerAuth('access-token')
  @Put('view/:lessonId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Update lesson view status' })
  @ApiParam({ name: 'lessonId', description: 'Lesson UUID' })
  updateLessonView(
    @Param('lessonId') lessonId: string,
    @Body() dto: UpdateLessonViewDto,
    @Request() req,
  ) {
    return this.lessonsService.updateLessonView(lessonId, req.user.id, dto.view);
  }
}


@ApiTags('Lesson Groups')
@Controller('lesson-group')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @ApiBearerAuth('access-token')
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MENTOR, UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new lesson group/section (Mentor/Admin)' })
  createSection(@Body() dto: CreateLessonSectionDto) {
    return this.lessonsService.createSection(dto);
  }

  @ApiBearerAuth('access-token')
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MENTOR, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update lesson group/section (Mentor/Admin)' })
  @ApiParam({ name: 'id', description: 'Lesson section ID' })
  updateSection(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateLessonSectionDto,
  ) {
    return this.lessonsService.updateSection(id, dto);
  }

  @ApiBearerAuth('access-token')
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MENTOR, UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete lesson group/section (Mentor/Admin)' })
  @ApiParam({ name: 'id', description: 'Lesson section ID' })
  deleteSection(@Param('id', ParseIntPipe) id: number) {
    return this.lessonsService.deleteSection(id);
  }

  @Get('all/:course_id')
  @ApiOperation({ summary: 'Get all lesson groups/sections for a course (Public)' })
  @ApiParam({ name: 'course_id', description: 'Course UUID' })
  @ApiQuery({ name: 'offset', required: false, example: 0 })
  @ApiQuery({ name: 'limit', required: false, example: 8 })
  @ApiQuery({ name: 'include_lessons', required: false, example: false })
  getAllSections(
    @Param('course_id') courseId: string,
    @Query() query: QueryLessonSectionsDto,
  ) {
    return this.lessonsService.getAllSections(courseId, query);
  }

  @Get('mine-all/:course_id')
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Get all lesson groups for a course (Student)' })
  @ApiParam({ name: 'course_id', description: 'Course UUID' })
  @ApiQuery({ name: 'offset', required: false, example: 0 })
  @ApiQuery({ name: 'limit', required: false, example: 8 })
  @ApiQuery({ name: 'include_lessons', required: false, example: false })
  getMineAllSections(
    @Param('course_id') courseId: string,
    @Query() query: QueryLessonSectionsDto,
    @Request() req
  ) {
    return this.lessonsService.getMineAllSections(req.user.id, courseId, query);
  }

  @Get('detail/:id')
  @ApiOperation({ summary: 'Get lesson group/section details' })
  @ApiParam({ name: 'id', type: 'number' })
  getSectionDetail(@Param('id', ParseIntPipe) id: number) {
    return this.lessonsService.getSectionDetail(id);
  }
}

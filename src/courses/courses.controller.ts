import {Controller,Get,Post,Patch,Delete,Body,Param,Query,UseGuards,Request,UseInterceptors,UploadedFiles,} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiParam} from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { QueryCoursesDto } from './dto/query-courses.dto';
import { AssignAssistantDto } from './dto/assign-assistant.dto';
import { UpdateCourseMentorDto } from './dto/update-course-mentor.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';
import { multerConfig } from '../config/file-upload.config';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @ApiBearerAuth('access-token')
  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MENTOR, UserRole.ADMIN)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'banner', maxCount: 1 },
    { name: 'introVideo', maxCount: 1 },
  ], multerConfig))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new course with file uploads (Mentor/Admin)' })
  createCourse(
    @Body() createCourseDto: CreateCourseDto,
    @Request() req,
    @UploadedFiles() files: { banner?: Express.Multer.File[]; introVideo?: Express.Multer.File[] },
  ) {
    if (files.banner && files.banner[0]) {
      createCourseDto.banner = files.banner[0].filename;
    }
    if (files.introVideo && files.introVideo[0]) {
      createCourseDto.introVideo = files.introVideo[0].filename;
    }
    return this.coursesService.createCourse(createCourseDto, req.user.id, files);
  }

  @ApiBearerAuth('access-token')
  @Patch('update/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MENTOR, UserRole.ADMIN)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'banner', maxCount: 1 },
    { name: 'introVideo', maxCount: 1 },
  ], multerConfig))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update a course with optional file uploads (Mentor/Admin)' })
  @ApiParam({ name: 'id', description: 'Course UUID' })
  updateCourse(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @Request() req,
    @UploadedFiles() files: { banner?: Express.Multer.File[]; introVideo?: Express.Multer.File[] },
  ) {
    if (files.banner && files.banner[0]) {
      updateCourseDto.banner = files.banner[0].filename;
    }
    if (files.introVideo && files.introVideo[0]) {
      updateCourseDto.introVideo = files.introVideo[0].filename;
    }
    return this.coursesService.updateCourse(id, updateCourseDto, req.user.id, req.user.role, files);
  }

  @ApiBearerAuth('access-token')
  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MENTOR, UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a course (Mentor/Admin, with restrictions)' })
  @ApiParam({ name: 'id', description: 'Course UUID' })
  deleteCourse(@Param('id') id: string, @Request() req) {
    return this.coursesService.deleteCourse(id, req.user.id, req.user.role);
  }

  @ApiBearerAuth('access-token')
  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all courses with filtering and pagination (Admin only)' })
  getAllCourses(@Query() query: QueryCoursesDto) {
    return this.coursesService.getAllCourses(query);
  }

  @ApiBearerAuth('access-token')
  @Get('my')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MENTOR, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get my courses as a mentor with filtering and pagination' })
  getMyCourses(@Request() req, @Query() query: QueryCoursesDto) {
    return this.coursesService.getMyCourses(req.user.id, query);
  }

  @ApiBearerAuth('access-token')
  @Get('mentor/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get courses by specific mentor (Admin only)' })
  @ApiParam({ name: 'id', description: 'Mentor user ID' })
  getMentorCourses(@Param('id') mentorId: string, @Query() query: QueryCoursesDto) {
    return this.coursesService.getMentorCourses(+mentorId, query);
  }

  @ApiBearerAuth('access-token')
  @Post('publish/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Publish a course (Admin only)' })
  @ApiParam({ name: 'id', description: 'Course UUID' })
  publishCourse(@Param('id') id: string) {
    return this.coursesService.publishCourse(id);
  }

  @ApiBearerAuth('access-token')
  @Post('unpublish/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Unpublish a course (Admin only)' })
  @ApiParam({ name: 'id', description: 'Course UUID' })
  unpublishCourse(@Param('id') id: string) {
    return this.coursesService.unpublishCourse(id);
  }

  @ApiBearerAuth('access-token')
  @Get('my/assigned')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ASSISTANT)
  @ApiOperation({ summary: 'Get assigned courses for assistant' })
  getMyAssignedCourses(@Request() req, @Query() query: QueryCoursesDto) {
    return this.coursesService.getMyAssignedCourses(req.user.id, query);
  }

  @ApiBearerAuth('access-token')
  @Post('assign-assistant')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @ApiOperation({ summary: 'Assign an assistant to a course' })
  assignAssistant(@Body() dto: AssignAssistantDto) {
    return this.coursesService.assignAssistant(dto);
  }

  @ApiBearerAuth('access-token')
  @Post('unassign-assistant')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @ApiOperation({ summary: 'Unassign an assistant from a course' })
  unassignAssistant(@Body() dto: AssignAssistantDto) {
    return this.coursesService.unassignAssistant(dto);
  }

  @ApiBearerAuth('access-token')
  @Patch('update-mentor')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update course mentor (Admin only)' })
  updateCourseMentor(@Body() dto: UpdateCourseMentorDto) {
    return this.coursesService.updateCourseMentor(dto);
  }

  @ApiBearerAuth('access-token')
  @Get('single-full/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MENTOR, UserRole.ASSISTANT)
  @ApiOperation({ summary: 'Get full course details (Admin/Mentor/Assistant)' })
  @ApiParam({ name: 'id', description: 'Course UUID' })
  getOneFull(@Param('id') id: string) {
    return this.coursesService.getOneFull(id);
  }

  @ApiBearerAuth('access-token')
  @Get(':courseId/assistants')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @ApiOperation({ summary: 'Get assistants for a course' })
  @ApiParam({ name: 'courseId', description: 'Course UUID' })
  getCourseAssistants(@Param('courseId') courseId: string, @Query() query: QueryCoursesDto) {
    return this.coursesService.getCourseAssistants(courseId, query);
  }

  @Get('single/:id')
  @ApiOperation({ summary: 'Get a single course by ID (Public)' })
  @ApiParam({ name: 'id', description: 'Course UUID' })
  getSingleCourse(@Param('id') id: string) {
    return this.coursesService.getSingleCourse(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all courses (Public/Filtered)' })
  findAllCourses(@Query() query: QueryCoursesDto) {
    // Making it public but filtered, as requested "Get /api/courses" with search params
    return this.coursesService.getAllCourses(query);
  }
}


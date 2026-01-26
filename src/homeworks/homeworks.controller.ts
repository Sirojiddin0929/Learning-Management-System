import {Controller,Post,Body,Get,Param,UseGuards,Request,ParseIntPipe,Patch,Delete,Query,UseInterceptors,UploadedFile,} from '@nestjs/common';
import { HomeworksService } from './homeworks.service';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { SubmitHomeworkDto } from './dto/submit-homework.dto';
import { UpdateHomeworkDto } from './dto/update-homework.dto';
import { CheckHomeworkDto } from './dto/check-homework.dto';
import { CheckSubmissionDto } from './dto/check-submission.dto';
import { HomeworkQueryDto, SubmissionQueryDto } from './dto/query-homework.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiParam, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('Homework')
@Controller('homework')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
export class HomeworksController {
  constructor(private readonly homeworksService: HomeworksService) {}

  @Post('create')
  @Roles(UserRole.MENTOR, UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a homework assignment (Mentor/Admin)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/homeworks',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        return cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
  }))
  createHomework(@Body() dto: CreateHomeworkDto, @UploadedFile() file: any) {
    if (file) {
      dto.file = file.filename;
    }
    return this.homeworksService.createHomework(dto);
  }

  @Patch('update/:id')
  @Roles(UserRole.MENTOR, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a homework assignment' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/homeworks',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        return cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
  }))
  updateHomework(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateHomeworkDto,
    @UploadedFile() file: any,
  ) {
    if (file) {
      dto.file = file.filename;
    }
    return this.homeworksService.updateHomework(id, dto);
  }

  @Delete('delete/:id')
  @Roles(UserRole.MENTOR, UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a homework assignment' })
  @ApiParam({ name: 'id', type: 'number' })
  deleteHomework(@Param('id', ParseIntPipe) id: number) {
    return this.homeworksService.deleteHomework(id);
  }

  @Get('course/:id')
  @Roles(UserRole.MENTOR, UserRole.ADMIN, UserRole.ASSISTANT)
  @ApiOperation({ summary: 'Get all homeworks for a course' })
  @ApiParam({ name: 'id', description: 'Course UUID' })
  getHomeworksByCourse(@Param('id') courseId: string, @Query() query: HomeworkQueryDto) {
    return this.homeworksService.getHomeworksByCourse(courseId, query);
  }

  @Get('detail/:id')
  @Roles(UserRole.MENTOR, UserRole.ADMIN, UserRole.ASSISTANT)
  @ApiOperation({ summary: 'Get details of a specific homework assignment' })
  @ApiParam({ name: 'id', type: 'number' })
  getHomeworkDetail(@Param('id', ParseIntPipe) id: number) {
    return this.homeworksService.getHomeworkDetail(id);
  }

  @Post('submission/submit/:lessonId')
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Submit homework for a lesson (Student)' })
  @ApiParam({ name: 'lessonId', description: 'Lesson UUID' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/submissions',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        return cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
  }))
  submitHomework(
    @Request() req,
    @Param('lessonId') lessonId: string,
    @Body() dto: SubmitHomeworkDto,
    @UploadedFile() file: any,
  ) {
    if (file) {
      dto.file = file.filename;
    }
    return this.homeworksService.submitHomework(req.user.id, lessonId, dto);
  }

  @Get('submission/mine/:lessonId')
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Get my submission for a lesson (Student)' })
  @ApiParam({ name: 'lessonId', description: 'Lesson UUID' })
  getMySubmission(
    @Request() req,
    @Param('lessonId') lessonId: string,
    @Query() query: HomeworkQueryDto
  ) {
    return this.homeworksService.getMySubmission(req.user.id, lessonId, query);
  }

  @Get('submissions/all')
  @Roles(UserRole.MENTOR, UserRole.ADMIN, UserRole.ASSISTANT)
  @ApiOperation({ summary: 'Get all homework submissions' })
  getAllSubmissions(@Query() query: SubmissionQueryDto) {
    return this.homeworksService.getAllSubmissions(query);
  }

  @Get('submissions/single/:id')
  @Roles(UserRole.MENTOR, UserRole.ADMIN, UserRole.ASSISTANT)
  @ApiOperation({ summary: 'Get a single submission by ID' })
  @ApiParam({ name: 'id', type: 'number' })
  getSubmissionById(@Param('id', ParseIntPipe) id: number) {
    return this.homeworksService.getSubmissionById(id);
  }

  @Post('submission/check')
  @Roles(UserRole.MENTOR, UserRole.ADMIN, UserRole.ASSISTANT)
  @ApiOperation({ summary: 'Check/Grade a homework submission' })
  checkSubmission(@Body() dto: CheckSubmissionDto) {
    return this.homeworksService.checkSubmission(dto);
  }
}

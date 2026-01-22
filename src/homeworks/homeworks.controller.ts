import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
  Patch,
  Delete,
} from '@nestjs/common';
import { HomeworksService } from './homeworks.service';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { SubmitHomeworkDto } from './dto/submit-homework.dto';
import { UpdateHomeworkDto } from './dto/update-homework.dto';
import { CheckHomeworkDto } from './dto/check-homework.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiParam } from '@nestjs/swagger';

@ApiTags('Homework')
@Controller('homework')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
export class HomeworksController {
  constructor(private readonly homeworksService: HomeworksService) {}

  @Post('create')
  @Roles(UserRole.MENTOR, UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a homework assignment (Mentor/Admin)' })
  createHomework(@Body() dto: CreateHomeworkDto) {
    return this.homeworksService.createHomework(dto);
  }

  @Patch('update/:id')
  @Roles(UserRole.MENTOR, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a homework assignment' })
  @ApiParam({ name: 'id', type: 'number' })
  updateHomework(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateHomeworkDto) {
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
  getHomeworksByCourse(@Param('id') courseId: string) {
    return this.homeworksService.getHomeworksByCourse(courseId);
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
  submitHomework(
    @Request() req,
    @Param('lessonId') lessonId: string,
    @Body() dto: SubmitHomeworkDto,
  ) {
    return this.homeworksService.submitHomework(req.user.id, lessonId, dto);
  }

  @Get('submission/mine/:lessonId')
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Get my submission for a lesson (Student)' })
  @ApiParam({ name: 'lessonId', description: 'Lesson UUID' })
  getMySubmission(@Request() req, @Param('lessonId') lessonId: string) {
    return this.homeworksService.getMySubmission(req.user.id, lessonId);
  }

  @Get('submissions/all')
  @Roles(UserRole.MENTOR, UserRole.ADMIN, UserRole.ASSISTANT)
  @ApiOperation({ summary: 'Get all homework submissions' })
  getAllSubmissions() {
    return this.homeworksService.getAllSubmissions();
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
  checkSubmission(@Body() dto: CheckHomeworkDto) {
    return this.homeworksService.checkSubmission(dto);
  }
}

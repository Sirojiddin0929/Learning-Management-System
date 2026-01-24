import {Controller,Post,Body,Get,Param,ParseIntPipe,UseGuards,Request,Patch,Delete,Query,} from '@nestjs/common';
import { ExamsService } from './exams.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { CreateManyExamsDto } from './dto/create-many-exams.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { PassExamDto } from './dto/pass-exam.dto';
import { ExamResultQueryDto } from './dto/query-exam-result.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiParam } from '@nestjs/swagger';

@ApiTags('Exams')
@Controller('exams')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Post('create')
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @ApiOperation({ summary: 'Create a single exam question' })
  createExam(@Body() dto: CreateExamDto) {
    return this.examsService.createExam(dto);
  }

  @Post('create/many')
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @ApiOperation({ summary: 'Create multiple exam questions' })
  createManyExams(@Body() dto: CreateManyExamsDto) {
    return this.examsService.createManyExams(dto);
  }

  @Get('lesson-group/:lessonGroupId')
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Get exams for a lesson group (Student)' })
  @ApiParam({ name: 'lessonGroupId', type: 'number' })
  getExamsForStudent(@Param('lessonGroupId', ParseIntPipe) lessonGroupId: number) {
    
    return this.examsService.getExamsBySection(lessonGroupId); 
  }

  @Post('pass')
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Submit exam answers and get result' })
  passExam(@Request() req, @Body() dto: PassExamDto) {
    return this.examsService.passExam(req.user.id, dto);
  }

  @Get('lesson-group/details/:id')
  @Roles(UserRole.MENTOR, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get exams for a lesson group (Mentor/Admin)' })
  @ApiParam({ name: 'id', type: 'number' })
  getExamsForMentor(@Param('id', ParseIntPipe) id: number) {
    return this.examsService.getExamsBySection(id);
  }

  @Get('detail/:id')
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @ApiOperation({ summary: 'Get details of a single exam question' })
  @ApiParam({ name: 'id', type: 'number' })
  getExamDetail(@Param('id', ParseIntPipe) id: number) {
    return this.examsService.getExamDetail(id);
  }

  @Patch('update/:id')
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @ApiOperation({ summary: 'Update an exam question' })
  @ApiParam({ name: 'id', type: 'number' })
  updateExam(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateExamDto) {
    return this.examsService.updateExam(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @ApiOperation({ summary: 'Delete an exam question' })
  @ApiParam({ name: 'id', type: 'number' })
  deleteExam(@Param('id', ParseIntPipe) id: number) {
    return this.examsService.deleteExam(id);
  }

  @Get('results')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all exam results (Admin)' })
  getAllResults(@Query() query: ExamResultQueryDto) {
    return this.examsService.getAllResults(query);
  }

  @Get('results/lesson-group/:id')
  @Roles(UserRole.MENTOR)
  @ApiOperation({ summary: 'Get exam results for a lesson group (Mentor)' })
  @ApiParam({ name: 'id', type: 'number' })
  getLessonGroupResults(@Param('id', ParseIntPipe) id: number, @Query() query: ExamResultQueryDto) {
    return this.examsService.getLessonGroupResults(id, query);
  }
}

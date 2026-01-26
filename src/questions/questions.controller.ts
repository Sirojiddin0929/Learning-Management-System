import {Controller,Post,Body,Get,Param,UseGuards,Request,Patch,Delete,ParseIntPipe,Query,UseInterceptors,UploadedFile,} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { AnswerQuestionDto } from './dto/answer-question.dto'; 
import { UpdateQuestionDto } from './dto/update-question.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { QuestionQueryDto } from './dto/query-question.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiParam, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { userInfo } from 'os';

@ApiTags('Questions')
@Controller('questions')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post('create/:courseId')
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Create a question for a course (Student)' })
  @ApiParam({ name: 'courseId', description: 'Course UUID' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/questions',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        return cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
  }))
  createQuestion(
    @Request() req,
    @Param('courseId') courseId: string,
    @Body() dto: CreateQuestionDto,
    @UploadedFile() file: any,
  ) {
    if (file) {
      dto.file = file.filename;
    }
    return this.questionsService.createQuestion(req.user.id, courseId, dto);
  }

  @Patch('update/:id')
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Update my question' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/questions',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        return cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
  }))
  updateQuestion(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateQuestionDto,
    @UploadedFile() file: any,
  ) {
    if (file) {
      dto.file = file.filename;
    }
    return this.questionsService.updateQuestion(req.user.id, id, dto);
  }

  @Delete('delete/:id')
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Delete my question' })
  @ApiParam({ name: 'id', type: 'number' })
  deleteQuestion(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.questionsService.deleteQuestion(req.user.id, id);
  }

  @Get('mine')
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Get my questions' })
  getMyQuestions(@Request() req, @Query() query: QuestionQueryDto) {
    return this.questionsService.getMyQuestions(req.user.id, query);
  }

  @Get('course/:courseId')
  @Roles(UserRole.MENTOR, UserRole.ADMIN, UserRole.ASSISTANT)
  @ApiOperation({ summary: 'Get all questions for a course' })
  @ApiParam({ name: 'courseId', description: 'Course UUID' })
  getQuestionsByCourse(@Param('courseId') courseId: string, @Query() query: QuestionQueryDto) {
    return this.questionsService.findAllByCourse(courseId, query);
  }

  @Get('single/:id')
  @Roles(UserRole.MENTOR, UserRole.ADMIN, UserRole.ASSISTANT, UserRole.STUDENT)
  @ApiOperation({ summary: 'Get a single question by ID' })
  @ApiParam({ name: 'id', type: 'number' })
  getQuestionById(@Param('id', ParseIntPipe) id: number) {
    return this.questionsService.getQuestionById(id);
  }

  @Post('read/:id')
  @Roles(UserRole.MENTOR, UserRole.ADMIN, UserRole.ASSISTANT)
  @ApiOperation({ summary: 'Mark question as read' })
  @ApiParam({ name: 'id', type: 'number' })
  markAsRead(@Param('id', ParseIntPipe) id: number) {
    return this.questionsService.markAsRead(id);
  }

  @Post('answer/:id')
  @Roles(UserRole.MENTOR, UserRole.ASSISTANT)
  @ApiOperation({ summary: 'Answer a question (ID is Question ID)' })
  @ApiParam({ name: 'id', type: 'number', description: 'Question ID' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/answers',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        return cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
  }))
  answerQuestion(
    @Request() req,
    @Param('id', ParseIntPipe) questionId: number,
    @Body() dto: AnswerQuestionDto,
    @UploadedFile() file: any,
  ) {
     if (file) {
      dto.file = file.filename;
    }
    return this.questionsService.answerQuestion(req.user.id, questionId, dto);
  }

  @Patch('answer/:id')
  @Roles(UserRole.MENTOR, UserRole.ASSISTANT, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update an answer (ID is Answer ID)' })
  @ApiParam({ name: 'id', type: 'number', description: 'Answer ID' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/answers',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        return cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
  }))
  updateAnswer(
    @Param('id', ParseIntPipe) id: number, 
    @Body() dto: UpdateAnswerDto,
    @UploadedFile() file: any,
  ) {
    if (file) {
      dto.file = file.filename;
    }
    return this.questionsService.updateAnswer(id, dto);
  }

  @Delete('answer/delete/:id')
  @Roles(UserRole.MENTOR, UserRole.ASSISTANT, UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete an answer (ID is Answer ID)' })
  @ApiParam({ name: 'id', type: 'number', description: 'Answer ID' })
  deleteAnswer(@Param('id', ParseIntPipe) id: number) {
    return this.questionsService.deleteAnswer(id);
  }
}

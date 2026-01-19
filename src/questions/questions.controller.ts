import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createQuestion(@Body() dto: CreateQuestionDto, @Request() req) {
    return this.questionsService.createQuestion(req.user.id, dto);
  }

  @Post('answer')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MENTOR, UserRole.ASSISTANT, UserRole.ADMIN)
  answerQuestion(@Body() dto: CreateAnswerDto, @Request() req) {
    return this.questionsService.answerQuestion(req.user.id, dto);
  }

  @Get()
  getQuestions(@Query('courseId') courseId: string) {
    return this.questionsService.findAllByCourse(courseId);
  }
}

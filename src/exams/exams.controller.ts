import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ExamsService } from './exams.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { CreateExamResultDto } from './dto/create-exam-result.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MENTOR, UserRole.ADMIN)
  createExam(@Body() dto: CreateExamDto) {
    return this.examsService.createExam(dto);
  }

  @Get('section/:sectionId')
  @UseGuards(JwtAuthGuard)
  getExams(@Param('sectionId', ParseIntPipe) sectionId: number) {
    return this.examsService.findAllBySection(sectionId);
  }

  @Post('result')
  @UseGuards(JwtAuthGuard)
  submitResult(@Body() dto: CreateExamResultDto, @Request() req) {
    return this.examsService.submitResult(req.user.id, dto);
  }
}

import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { HomeworksService } from './homeworks.service';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { SubmitHomeworkDto } from './dto/submit-homework.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('homeworks')
export class HomeworksController {
  constructor(private readonly homeworksService: HomeworksService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MENTOR, UserRole.ADMIN)
  createHomework(@Body() dto: CreateHomeworkDto) {
    return this.homeworksService.createHomework(dto);
  }

  @Post('submit')
  @UseGuards(JwtAuthGuard)
  submitHomework(@Body() dto: SubmitHomeworkDto, @Request() req) {
    return this.homeworksService.submitHomework(req.user.id, dto);
  }

  @Get(':homeworkId/submissions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MENTOR, UserRole.ADMIN, UserRole.ASSISTANT)
  getSubmissions(@Param('homeworkId', ParseIntPipe) homeworkId: number) {
    return this.homeworksService.findAllSubmissions(homeworkId);
  }
}

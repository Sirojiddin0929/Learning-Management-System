import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonSectionDto } from './dto/create-lesson-section.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Post('sections')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MENTOR, UserRole.ADMIN)
  createSection(@Body() dto: CreateLessonSectionDto) {
    return this.lessonsService.createSection(dto);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MENTOR, UserRole.ADMIN)
  createLesson(@Body() dto: CreateLessonDto) {
    return this.lessonsService.createLesson(dto);
  }

  @Get('sections')
  findAllSections(@Query('courseId') courseId: string) {
    return this.lessonsService.findAllSections(courseId);
  }
}

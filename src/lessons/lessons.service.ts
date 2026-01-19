import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonSectionDto } from './dto/create-lesson-section.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(private prisma: PrismaService) {}

  async createSection(dto: CreateLessonSectionDto) {
    return this.prisma.lessonSection.create({
      data: dto,
    });
  }

  async createLesson(dto: CreateLessonDto) {
    return this.prisma.lesson.create({
      data: dto,
    });
  }

  async findAllSections(courseId: string) {
    return this.prisma.lessonSection.findMany({
      where: { courseId },
      include: { lessons: true },
    });
  }
}

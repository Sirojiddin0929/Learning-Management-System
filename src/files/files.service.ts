import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { join } from 'path';
import { existsSync } from 'fs';

@Injectable()
export class FilesService {
  constructor(private prisma: PrismaService) {}

  async checkFileAccess(userId: number, lessonId: string) {
    // Find courseId for this lesson
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        section: {
          select: { courseId: true },
        },
      },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    const courseId = lesson.section.courseId;

    // Check if user purchased the course
    const purchase = await this.prisma.purchasedCourse.findFirst({
      where: {
        userId,
        courseId,
      },
    });

    if (!purchase) {
      throw new ForbiddenException('You have not purchased this course');
    }

    return true;
  }

  getPublicFilePath(name: string) {
    const filePath = join(process.cwd(), 'uploads/courses', name);
    if (!existsSync(filePath)) {
      throw new NotFoundException('File not found');
    }
    return filePath;
  }

  getLessonFilePath(name: string) {
    const filePath = join(process.cwd(), 'uploads/lesson-files', name);
    if (!existsSync(filePath)) {
      throw new NotFoundException('File not found');
    }
    return filePath;
  }

  getVideoFilePath(hlsf: string) {
    const filePath = join(process.cwd(), 'uploads/lessons', hlsf);
    if (!existsSync(filePath)) {
      throw new NotFoundException('Video file not found');
    }
    return filePath;
  }
}

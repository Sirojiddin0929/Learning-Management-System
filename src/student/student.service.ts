import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}

  async getMyCourses(userId: number) {
    return this.prisma.assignedCourse.findMany({
      where: { userId },
      include: {
        course: true,
      },
    });
  }

  async getMyResults(userId: number) {
    return this.prisma.examResult.findMany({
      where: { userId },
      include: {
        section: true,
      },
    });
  }

  async getMySubmissions(userId: number) {
    return this.prisma.homeworkSubmission.findMany({
      where: { userId },
      include: {
        homework: {
          include: {
            lesson: true,
          },
        },
      },
    });
  }
}

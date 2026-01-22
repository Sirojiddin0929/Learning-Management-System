import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MentorService {
  constructor(private prisma: PrismaService) {}

  async getMyCourses(mentorId: number) {
    return this.prisma.course.findMany({
      where: { mentorId },
    });
  }

  async getPendingHomeworks(mentorId: number) {
    return this.prisma.homeworkSubmission.findMany({
      where: {
        status: 'PENDING',
        homework: {
          lesson: {
            section: {
              course: {
                mentorId: mentorId,
              },
            },
          },
        },
      },
      include: {
        user: true,
        homework: {
          include: {
            lesson: true,
          },
        },
      },
    });
  }
}

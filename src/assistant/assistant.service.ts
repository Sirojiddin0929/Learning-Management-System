import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AssistantService {
  constructor(private prisma: PrismaService) {}

  async getPendingHomeworks() {
    return this.prisma.homeworkSubmission.findMany({
      where: {
        status: 'PENDING',
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

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { SubmitHomeworkDto } from './dto/submit-homework.dto';
import { UpdateHomeworkDto } from './dto/update-homework.dto';
import { CheckHomeworkDto } from './dto/check-homework.dto';
import { HomeworkSubStatus } from '@prisma/client';

@Injectable()
export class HomeworksService {
  constructor(private prisma: PrismaService) {}

  async createHomework(dto: CreateHomeworkDto) {
    return this.prisma.homework.create({
      data: dto,
    });
  }

  async updateHomework(id: number, dto: UpdateHomeworkDto) {
    const homework = await this.prisma.homework.findUnique({ where: { id } });
    if (!homework) throw new NotFoundException('Homework not found');

    return this.prisma.homework.update({
      where: { id },
      data: dto,
    });
  }

  async deleteHomework(id: number) {
    const homework = await this.prisma.homework.findUnique({ where: { id } });
    if (!homework) throw new NotFoundException('Homework not found');

    return this.prisma.homework.delete({
      where: { id },
    });
  }

  async getHomeworkDetail(id: number) {
    const homework = await this.prisma.homework.findUnique({ where: { id } });
    if (!homework) throw new NotFoundException('Homework not found');
    return homework;
  }

  async getHomeworksByCourse(courseId: string) {
    return this.prisma.homework.findMany({
      where: {
        lesson: {
          section: {
            courseId: courseId,
          },
        },
      },
      include: {
        lesson: {
           select: { id: true, name: true, section: { select: { id: true, name: true } } }
        }
      }
    });
  }

  async submitHomework(userId: number, lessonId: string, dto: SubmitHomeworkDto) {
    const homework = await this.prisma.homework.findUnique({
      where: { lessonId },
    });

    if (!homework) {
      throw new NotFoundException('No homework assignment found for this lesson');
    }

    const existingSubmission = await this.prisma.homeworkSubmission.findFirst({
        where: { userId, homeworkId: homework.id }
    });

    if (existingSubmission && existingSubmission.status === HomeworkSubStatus.APPROVED) {
        throw new BadRequestException('You have already submitted and passed this homework');
    }
    
    // If re-submitting, we could update or create new? Schema doesn't enforce unique submission per user/homework, allowing history.
    // Let's create new for now to keep history.
    return this.prisma.homeworkSubmission.create({
      data: {
        userId,
        homeworkId: homework.id,
        file: dto.file || '', // Handle potential null if DTO allows optional but schema says String (implied required or default?) Schema: file String.
        text: dto.text,
        status: HomeworkSubStatus.PENDING,
      },
    });
  }

  async getMySubmission(userId: number, lessonId: string) {
     const homework = await this.prisma.homework.findUnique({
      where: { lessonId },
    });

    if (!homework) {
      // It's possible there is no homework, so return null or empty?
      // Or throw? Usually just return logic so frontend knows.
      return null; 
    }

    return this.prisma.homeworkSubmission.findFirst({
        where: { userId, homeworkId: homework.id },
        orderBy: { createdAt: 'desc' } // Get latest
    });
  }

  async getAllSubmissions() {
    return this.prisma.homeworkSubmission.findMany({
      include: {
        user: { select: { id: true, fullName: true, phone: true } },
        homework: { include: { lesson: { select: { id: true, name: true } } } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getSubmissionById(id: number) {
    const submission = await this.prisma.homeworkSubmission.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, fullName: true, phone: true } },
        homework: true
      }
    });
    if (!submission) throw new NotFoundException('Submission not found');
    return submission;
  }

  async checkSubmission(dto: CheckHomeworkDto) {
    const submission = await this.prisma.homeworkSubmission.findUnique({
      where: { id: dto.submissionId },
    });

    if (!submission) throw new NotFoundException('Submission not found');

    return this.prisma.homeworkSubmission.update({
      where: { id: dto.submissionId },
      data: {
        status: dto.status,
        reason: dto.reason,
      },
    });
  }
}

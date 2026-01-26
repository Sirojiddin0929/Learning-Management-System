import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { SubmitHomeworkDto } from './dto/submit-homework.dto';
import { UpdateHomeworkDto } from './dto/update-homework.dto';
import { CheckSubmissionDto } from './dto/check-submission.dto';
import { HomeworkQueryDto, SubmissionQueryDto } from './dto/query-homework.dto';
import { HomeworkSubStatus } from '@prisma/client';

@Injectable()
export class HomeworksService {
  constructor(private prisma: PrismaService) {}

  async createHomework(dto: CreateHomeworkDto) {
    const data = { ...dto };
    if (data.file && !data.file.startsWith('http')) {
      data.file = `http://localhost:4000/uploads/homeworks/${data.file}`;
    }
    return this.prisma.homework.create({
      data,
    });
  }

  async updateHomework(id: number, dto: UpdateHomeworkDto) {
    const homework = await this.prisma.homework.findUnique({ where: { id } });
    if (!homework) throw new NotFoundException('Homework not found');

    const data = { ...dto };
    if (data.file && !data.file.startsWith('http')) {
      data.file = `http://localhost:4000/uploads/homeworks/${data.file}`;
    }
    return this.prisma.homework.update({
      where: { id },
      data,
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

  async getHomeworksByCourse(courseId: string, query: HomeworkQueryDto) {
    const { offset, limit } = query;
    const where = {
      lesson: {
        section: {
          courseId: courseId,
        },
      },
    };

    const [total, homeworks] = await this.prisma.$transaction([
      this.prisma.homework.count({ where }),
      this.prisma.homework.findMany({
        where,
        skip: offset,
        take: limit,
        include: {
          lesson: {
             select: { id: true, name: true, section: { select: { id: true, name: true } } }
          }
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return { total, homeworks };
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
    
    
    return this.prisma.homeworkSubmission.create({
      data: {
        userId,
        homeworkId: homework.id,
        file: dto.file ? `http://localhost:4000/uploads/submissions/${dto.file}` : '',
        text: dto.text,
        status: HomeworkSubStatus.PENDING,
      },
    });
  }

  async getMySubmission(userId: number, lessonId: string, query: HomeworkQueryDto) {
     const { offset, limit } = query;
     const homework = await this.prisma.homework.findUnique({
      where: { lessonId },
    });

    if (!homework) {
      return { total: 0, submissions: [] }; 
    }

    const where = { userId, homeworkId: homework.id };

    const [total, submissions] = await this.prisma.$transaction([
        this.prisma.homeworkSubmission.count({ where }),
        this.prisma.homeworkSubmission.findMany({
            where,
            skip: offset,
            take: limit,
            orderBy: { createdAt: 'desc' }
        })
    ]);

    return { total, submissions };
  }

  async getAllSubmissions(query: SubmissionQueryDto) {
    const { offset, limit, status, course_id, homework_id, user_id } = query;
    const where: any = {};

    if (status) where.status = status;
    if (homework_id) where.homeworkId = homework_id;
    if (user_id) where.userId = user_id;
    if (course_id) {
        where.homework = {
            lesson: {
                section: {
                    courseId: course_id
                }
            }
        };
    }

    const [total, submissions] = await this.prisma.$transaction([
        this.prisma.homeworkSubmission.count({ where }),
        this.prisma.homeworkSubmission.findMany({
            where,
            skip: offset,
            take: limit,
            include: {
                user: { select: { id: true, fullName: true, phone: true } },
                homework: { include: { lesson: { select: { id: true, name: true } } } }
            },
            orderBy: { createdAt: 'desc' }
        })
    ]);

    return { total, submissions };
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

  async checkSubmission(dto: CheckSubmissionDto) {
    const submission = await this.prisma.homeworkSubmission.findUnique({
      where: { id: dto.submissionId },
    });

    if (!submission) throw new NotFoundException('Submission not found');

    const status = dto.approved ? HomeworkSubStatus.APPROVED : HomeworkSubStatus.REJECTED;

    return this.prisma.homeworkSubmission.update({
      where: { id: dto.submissionId },
      data: {
        status: status,
        reason: dto.reason,
      },
    });
  }
}

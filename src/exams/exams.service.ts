import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { CreateManyExamsDto } from './dto/create-many-exams.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { PassExamDto } from './dto/pass-exam.dto';
import { ExamResultQueryDto } from './dto/query-exam-result.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ExamsService {
  constructor(private prisma: PrismaService) {}

  async createExam(dto: CreateExamDto) {
    const sectionId = dto.lessonGroupId || dto.sectionId;
    if (!sectionId) {
       throw new Error('lessonGroupId or sectionId must be provided');
    }
    const { lessonGroupId, sectionId: _, ...data } = dto;
    return this.prisma.exam.create({
      data: {
        ...data,
        sectionId,
      },
    });
  }

  async createManyExams(dto: CreateManyExamsDto) {
    const { lessonGroupId, exams } = dto;
    const examsData = exams.map((exam) => {
        const { lessonGroupId: _, sectionId: __, ...rest } = exam;
        return {
            ...rest,
            sectionId: lessonGroupId
        }
    })
    return this.prisma.exam.createMany({
      data: examsData,
    });
  }

  async getExamsBySection(sectionId: number) {
    return this.prisma.exam.findMany({
      where: { sectionId },
    });
  }

  async getExamDetail(id: number) {
    const exam = await this.prisma.exam.findUnique({
      where: { id },
    });
    if (!exam) throw new NotFoundException('Exam question not found');
    return exam;
  }

  async updateExam(id: number, dto: UpdateExamDto) {
    const exam = await this.prisma.exam.findUnique({ where: { id } });
    if (!exam) throw new NotFoundException('Exam question not found');

    return this.prisma.exam.update({
      where: { id },
      data: dto,
    });
  }

  async deleteExam(id: number) {
     const exam = await this.prisma.exam.findUnique({ where: { id } });
    if (!exam) throw new NotFoundException('Exam question not found');
    
    return this.prisma.exam.delete({
      where: { id },
    });
  }

  async passExam(userId: number, dto: PassExamDto) {
    const sectionExams = await this.prisma.exam.findMany({
      where: { sectionId: dto.sectionId },
    });

    if (sectionExams.length === 0) {
      throw new NotFoundException('No exams found for this section');
    }

    let correctCount = 0;
    let wrongCount = 0;

    for (const answer of dto.answers) {
      const question = sectionExams.find((e) => e.id === answer.questionId);
      if (question && question.answer === answer.answer) {
        correctCount++;
      } else {
        wrongCount++;
      }
    }

    
    const totalQuestions = sectionExams.length; 
    
    wrongCount = totalQuestions - correctCount;

    const percentage = (correctCount / totalQuestions) * 100;
    const passed = percentage >= 70;

    return this.prisma.examResult.create({
      data: {
        userId,
        sectionId: dto.sectionId,
        corrects: correctCount,
        wrongs: wrongCount,
        passed,
      },
    });
  }

  async getAllResults(query: ExamResultQueryDto) {
    const { offset, limit, lesson_group_id, user_id, passed, date_from, date_to } = query;
    const where: Prisma.ExamResultWhereInput = {};

    if (lesson_group_id) where.sectionId = lesson_group_id;
    if (user_id) where.userId = user_id;
    if (passed !== undefined) where.passed = passed;

    if (date_from || date_to) {
      where.createdAt = {};
      if (date_from) where.createdAt.gte = new Date(date_from);
      if (date_to) where.createdAt.lte = new Date(new Date(date_to).setHours(23, 59, 59, 999));
    }

    const [total, results] = await this.prisma.$transaction([
        this.prisma.examResult.count({ where }),
        this.prisma.examResult.findMany({
            where,
            skip: offset,
            take: limit,
            include: {
                user: { select: { id: true, fullName: true, phone: true } },
                section: true,
            },
            orderBy: { createdAt: 'desc' }
        })
    ]);

    return { total, results };
  }

  async getLessonGroupResults(sectionId: number, query: ExamResultQueryDto) {
    const { offset, limit, user_id, passed, date_from, date_to } = query;
    const where: Prisma.ExamResultWhereInput = { sectionId };

    if (user_id) where.userId = user_id;
    if (passed !== undefined) where.passed = passed;

    if (date_from || date_to) {
      where.createdAt = {};
      if (date_from) where.createdAt.gte = new Date(date_from);
      if (date_to) where.createdAt.lte = new Date(new Date(date_to).setHours(23, 59, 59, 999));
    }

     const [total, results] = await this.prisma.$transaction([
        this.prisma.examResult.count({ where }),
        this.prisma.examResult.findMany({
            where,
            skip: offset,
            take: limit,
            include: {
                user: { select: { id: true, fullName: true, phone: true } },
            },
            orderBy: { createdAt: 'desc' }
        })
    ]);

    return { total, results };
  }
}

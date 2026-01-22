import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { CreateManyExamsDto } from './dto/create-many-exams.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { PassExamDto } from './dto/pass-exam.dto';

@Injectable()
export class ExamsService {
  constructor(private prisma: PrismaService) {}

  async createExam(dto: CreateExamDto) {
    return this.prisma.exam.create({
      data: dto,
    });
  }

  async createManyExams(dto: CreateManyExamsDto) {
    return this.prisma.exam.createMany({
      data: dto.exams,
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

  async getAllResults() {
    return this.prisma.examResult.findMany({
      include: {
        user: { select: { id: true, fullName: true, phone: true } },
        section: true,
      },
    });
  }

  async getLessonGroupResults(sectionId: number) {
    return this.prisma.examResult.findMany({
      where: { sectionId },
      include: {
        user: { select: { id: true, fullName: true, phone: true } },
      },
    });
  }
}

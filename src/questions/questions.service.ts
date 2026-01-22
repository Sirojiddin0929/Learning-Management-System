import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  async createQuestion(userId: number, courseId: string, dto: CreateQuestionDto) {
    return this.prisma.question.create({
      data: {
        userId,
        ...dto,
        courseId,
      },
    });
  }

  async updateQuestion(userId: number, id: number, dto: UpdateQuestionDto) {
    const question = await this.prisma.question.findUnique({ where: { id } });
    if (!question) throw new NotFoundException('Question not found');
    if (question.userId !== userId) throw new ForbiddenException('You can only update your own questions');

    return this.prisma.question.update({
      where: { id },
      data: dto,
    });
  }

  async deleteQuestion(userId: number, id: number) {
    const question = await this.prisma.question.findUnique({ where: { id } });
    if (!question) throw new NotFoundException('Question not found');
    if (question.userId !== userId) throw new ForbiddenException('You can only delete your own questions');

    return this.prisma.question.delete({
      where: { id },
    });
  }

  async getMyQuestions(userId: number) {
    return this.prisma.question.findMany({
      where: { userId },
      include: {
        answer: true,
        course: { select: { id: true, name: true } }
      },
    });
  }

  async findAllByCourse(courseId: string) {
    return this.prisma.question.findMany({
      where: { courseId },
      include: {
        answer: { include: { user: { select: { fullName: true, role: true } } } },
        user: { select: { fullName: true, image: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getQuestionById(id: number) {
     const question = await this.prisma.question.findUnique({
      where: { id },
      include: {
        answer: { include: { user: { select: { fullName: true, role: true } } } },
        user: { select: { fullName: true, image: true } },
        course: { select: { id: true, name: true } },
      },
    });
    if (!question) throw new NotFoundException('Question not found');
    return question;
  }

  async markAsRead(id: number) {
    return this.prisma.question.update({
      where: { id },
      data: { read: true, readAt: new Date() },
    });
  }

  async answerQuestion(userId: number, questionId: number, dto: CreateAnswerDto) {
    
    const question = await this.prisma.question.findUnique({ where: { id: questionId } });
    if (!question) throw new NotFoundException('Question not found');

    return this.prisma.questionAnswer.create({
      data: {
        userId,
        questionId,
        text: dto.text,
        file: dto.file,
      },
    });
  }

  async updateAnswer(id: number, dto: UpdateAnswerDto) {
    
    const answer = await this.prisma.questionAnswer.findUnique({ where: { id } });
    if (!answer) throw new NotFoundException('Answer not found');

    return this.prisma.questionAnswer.update({
      where: { id },
      data: dto,
    });
  }

  async deleteAnswer(id: number) {
     const answer = await this.prisma.questionAnswer.findUnique({ where: { id } });
    if (!answer) throw new NotFoundException('Answer not found');

    return this.prisma.questionAnswer.delete({
      where: { id },
    });
  }
}

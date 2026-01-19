import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { CreateAnswerDto } from './dto/create-answer.dto';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  async createQuestion(userId: number, dto: CreateQuestionDto) {
    return this.prisma.question.create({
      data: {
        userId,
        ...dto,
      },
    });
  }

  async answerQuestion(userId: number, dto: CreateAnswerDto) {
    return this.prisma.questionAnswer.create({
      data: {
        userId,
        ...dto,
      },
    });
  }

  async findAllByCourse(courseId: string) {
    return this.prisma.question.findMany({
      where: { courseId },
      include: { answer: true, user: { select: { fullName: true } } },
    });
  }
}

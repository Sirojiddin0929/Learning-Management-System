import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { AnswerQuestionDto } from './dto/answer-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { QuestionQueryDto } from './dto/query-question.dto';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  async createQuestion(userId: number, courseId: string, dto: CreateQuestionDto) {
    const data = { ...dto };
    if (data.file && !data.file.startsWith('http')) {
      data.file = `http://localhost:4000/uploads/questions/${data.file}`;
    }
    return this.prisma.question.create({
      data: {
        userId,
        ...data,
        courseId,
      },
    });
  }

  async updateQuestion(userId: number, id: number, dto: UpdateQuestionDto) {
    const question = await this.prisma.question.findUnique({ where: { id } });
    if (!question) throw new NotFoundException('Question not found');
    if (question.userId !== userId) throw new ForbiddenException('You can only update your own questions');

    const data = { ...dto };
    if (data.file && !data.file.startsWith('http')) {
      data.file = `http://localhost:4000/uploads/questions/${data.file}`;
    }
    return this.prisma.question.update({
      where: { id },
      data,
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

  async getMyQuestions(userId: number, query: QuestionQueryDto) {
    const { offset, limit, read, answered, courseId } = query;
    const where: any = { userId };

    if (courseId) where.courseId = courseId;
    if (read !== undefined) where.read = read;
    if (answered !== undefined) {
      if (answered) {
        where.answer = { isNot: null };
      } else {
        where.answer = null; 
        
        where.answer = { is: null };
      }
    }

    const [total, questions] = await this.prisma.$transaction([
      this.prisma.question.count({ where }),
      this.prisma.question.findMany({
        where,
        skip: offset,
        take: limit,
        include: {
          answer: true,
          course: { select: { id: true, name: true } }
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

     return { total, questions };
  }

  async findAllByCourse(courseId: string, query: QuestionQueryDto) {
    const { offset, limit, read, answered } = query;
    const where: any = { courseId };

    if (read !== undefined) where.read = read;
    if (answered !== undefined) {
      if (answered) {
        where.answer = { isNot: null };
      } else {
        where.answer = { is: null };
      }
    }

    const [total, questions] = await this.prisma.$transaction([
      this.prisma.question.count({ where }),
      this.prisma.question.findMany({
        where,
        skip: offset,
        take: limit,
        include: {
          answer: { include: { user: { select: { fullName: true, role: true } } } },
          user: { select: { fullName: true, image: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);
    
    return { total, questions };
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

  async answerQuestion(userId: number, questionId: number, dto: AnswerQuestionDto) {
    
    const question = await this.prisma.question.findUnique({ where: { id: questionId } });
    if (!question) throw new NotFoundException('Question not found');

    return this.prisma.questionAnswer.create({
      data: {
        userId,
        questionId,
        text: dto.text,
        file: dto.file ? `http://localhost:4000/uploads/answers/${dto.file}` : null,
      },
    });
  }

  async updateAnswer(id: number, dto: UpdateAnswerDto) {
    
    const answer = await this.prisma.questionAnswer.findUnique({ where: { id } });
    if (!answer) throw new NotFoundException('Answer not found');

    const data = { ...dto };
    if (data.file && !data.file.startsWith('http')) {
      data.file = `http://localhost:4000/uploads/answers/${data.file}`;
    }
    return this.prisma.questionAnswer.update({
      where: { id },
      data,
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

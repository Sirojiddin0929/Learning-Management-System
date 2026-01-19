import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { SubmitHomeworkDto } from './dto/submit-homework.dto';

@Injectable()
export class HomeworksService {
  constructor(private prisma: PrismaService) {}

  async createHomework(dto: CreateHomeworkDto) {
    return this.prisma.homework.create({
      data: dto,
    });
  }

  async submitHomework(userId: number, dto: SubmitHomeworkDto) {
    return this.prisma.homeworkSubmission.create({
      data: {
        userId,
        ...dto,
      },
    });
  }

  async findAllSubmissions(homeworkId: number) {
    return this.prisma.homeworkSubmission.findMany({
      where: { homeworkId },
      include: { user: { select: { fullName: true, phone: true } } },
    });
  }
}

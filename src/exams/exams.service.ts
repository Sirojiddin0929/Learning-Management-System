import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { CreateExamResultDto } from './dto/create-exam-result.dto';

@Injectable()
export class ExamsService {
  constructor(private prisma: PrismaService) {}

  async createExam(dto: CreateExamDto) {
    return this.prisma.exam.create({
      data: dto,
    });
  }

  async findAllBySection(sectionId: number) {
    return this.prisma.exam.findMany({
      where: { sectionId },
    });
  }

  async submitResult(userId: number, dto: CreateExamResultDto) {
    const passed = dto.corrects >= (dto.corrects + dto.wrongs) * 0.7; // Example passing logic 70%
    return this.prisma.examResult.create({
      data: {
        userId,
        ...dto,
        passed,
      },
    });
  }
}

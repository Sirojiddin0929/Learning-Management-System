import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRatingDto } from './dto/create-rating.dto';

@Injectable()
export class RatingsService {
  constructor(private prisma: PrismaService) {}

  async createRating(userId: number, dto: CreateRatingDto) {
    return this.prisma.rating.create({
      data: {
        userId,
        ...dto,
      },
      include: { user: { select: { fullName: true } } },
    });
  }

  async getRatings(courseId: string) {
    return this.prisma.rating.findMany({
      where: { courseId },
      include: { user: { select: { fullName: true } } },
    });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { QueryRatingsDto } from './dto/query-ratings.dto';

@Injectable()
export class RatingsService {
  constructor(private prisma: PrismaService) {}

  async createRating(userId: number, dto: CreateRatingDto) {
    return this.prisma.rating.create({
      data: {
        userId,
        ...dto,
      },
      include: { 
        user: { select: { fullName: true, image: true } },
        course: { select: { name: true } },
      },
    });
  }

  async deleteRating(id: number) {
    const rating = await this.prisma.rating.findUnique({
      where: { id },
    });

    if (!rating) {
      throw new NotFoundException('Rating not found');
    }

    await this.prisma.rating.delete({
      where: { id },
    });

    return { message: 'Rating deleted successfully' };
  }

  async getRatingsList(courseId: string, query: QueryRatingsDto) {
    const { offset = 0, limit = 8 } = query;

    const [ratings, total] = await Promise.all([
      this.prisma.rating.findMany({
        where: { courseId },
        skip: offset,
        take: limit,
        include: { 
          user: { select: { fullName: true, image: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.rating.count({
        where: { courseId },
      }),
    ]);

    return {
      ratings,
      total,
      offset,
      limit,
    };
  }

  async getLatestRatings() {
    return this.prisma.rating.findMany({
      take: 10,
      include: { 
        user: { select: { fullName: true, image: true } },
        course: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getRatings(courseId: string) {
    return this.prisma.rating.findMany({
      where: { courseId },
      include: { user: { select: { fullName: true } } },
    });
  }
}

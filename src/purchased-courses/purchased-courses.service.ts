import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PurchaseCourseDto } from './dto/purchase-course.dto';
import { CreatePurchaseDto } from './dto/create-purchase.dto';

@Injectable()
export class PurchasedCoursesService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyPurchasedCourses(userId: number) {
    return this.prisma.purchasedCourse.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            category: true,
            mentor: {
               select: {
                   id: true,
                   fullName: true,
                   image: true,
                   mentorProfile: true
               }
            },
          },
        },
      },
    });
  }

  async getMyPurchasedCourse(userId: number, courseId: string) {
    const purchase = await this.prisma.purchasedCourse.findFirst({
      where: {
        userId,
        courseId,
      },
      include: {
        course: {
          include: {
            category: true,
            mentor: {
                select: {
                    id: true,
                    fullName: true,
                    image: true,
                    mentorProfile: true
                }
            },
            sections: {
              include: {
                lessons: true,
              },
            },
          },
        },
      },
    });

    if (!purchase) {
      throw new NotFoundException('Purchased course not found');
    }

    return purchase;
  }

  async purchaseCourse(userId: number, dto: PurchaseCourseDto) {
    const course = await this.prisma.course.findUnique({
      where: { id: dto.courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const existingPurchase = await this.prisma.purchasedCourse.findFirst({
      where: {
        userId,
        courseId: dto.courseId,
      },
    });

    if (existingPurchase) {
      throw new BadRequestException('You have already purchased this course');
    }

    return this.prisma.purchasedCourse.create({
      data: {
        userId,
        courseId: dto.courseId,
        amount: dto.amount,
        paidVia: dto.paidVia,
      },
    });
  }

  async getCourseStudents(courseId: string) {
    return this.prisma.purchasedCourse.findMany({
      where: { courseId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,

            
            phone: true,
            image: true,
            role: true,
          },
        },
      },
    });
  }

  async createPurchase(dto: CreatePurchaseDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const course = await this.prisma.course.findUnique({
      where: { id: dto.courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const existingPurchase = await this.prisma.purchasedCourse.findFirst({
      where: {
        userId: dto.userId,
        courseId: dto.courseId,
      },
    });

    if (existingPurchase) {
      throw new BadRequestException('User already has this course');
    }

    return this.prisma.purchasedCourse.create({
      data: {
        userId: dto.userId,
        courseId: dto.courseId,
        amount: dto.amount,
        paidVia: dto.paidVia,
      },
    });
  }
}

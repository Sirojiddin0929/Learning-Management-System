import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CheckoutDto } from './dto/checkout.dto';
import { PaidVia } from '@prisma/client';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async checkout(userId: number, dto: CheckoutDto) {
    const course = await this.prisma.course.findUnique({
      where: { id: dto.courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    
    const existing = await this.prisma.purchasedCourse.findFirst({
        where: { userId, courseId: dto.courseId }
    });
    if (existing) {
        throw new BadRequestException('Course already purchased');
    }

    
    
    return {
        message: 'Payment link generated',
        paymentUrl: `https://mock-payment-gateway.com/pay?course=${dto.courseId}&user=${userId}&amount=${course.price}`,
    };
  }
}

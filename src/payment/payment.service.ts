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

    // Check if already purchased
    const existing = await this.prisma.purchasedCourse.findFirst({
        where: { userId, courseId: dto.courseId }
    });
    if (existing) {
        throw new BadRequestException('Course already purchased');
    }

    // Since actual payment gateway logic is not specified, we can:
    // 1. Simulate a successful purchase immediately (simplest).
    // 2. Return a dummy link if asked.
    // Given the task is just "checkout", I will simulate purchase with 'PAYME' (or manual?)
    // But usually 'checkout' implies getting a link.
    // As per user request, it's just "checkout" endpoint.
    // I will return a success message or mock link, but NOT create purchase yet (usually purchase happens on webhook/callback).
    // However, if no callback handling, maybe I should just create it?
    // Let's create it for "testing" simplicity if it's a demo.
    // The previous PurchasedCoursesService has `purchaseCourse` which is direct.
    // This `checkout` might be redundant or a pre-step.
    // I will assume this returns a Payment URL (mocked).
    
    return {
        message: 'Payment link generated',
        paymentUrl: `https://mock-payment-gateway.com/pay?course=${dto.courseId}&user=${userId}&amount=${course.price}`,
    };
  }
}

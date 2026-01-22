import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CheckoutDto } from './dto/checkout.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Payment')
@Controller('payment')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('checkout')
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Checkout a course (returns mock payment URL)' })
  checkout(@Request() req, @Body() dto: CheckoutDto) {
    return this.paymentService.checkout(req.user.id, dto);
  }
}

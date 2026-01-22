import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';
import { PaidVia } from '@prisma/client';

export class PurchaseCourseDto {
  @ApiProperty({
    description: 'The UUID of the course to purchase',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID()
  @IsString()
  courseId: string;

  @ApiProperty({
    description: 'The amount paid for the course',
    example: 100000,
  })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'Payment method',
    enum: PaidVia,
    example: PaidVia.PAYME,
  })
  @IsNotEmpty()
  @IsEnum(PaidVia)
  paidVia: PaidVia;
}

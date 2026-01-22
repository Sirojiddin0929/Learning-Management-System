import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';
import { PaidVia } from '@prisma/client';

export class CreatePurchaseDto {
  @ApiProperty({
    description: 'ID of the user (student)',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty({
    description: 'UUID of the course',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID()
  @IsString()
  courseId: string;

  @ApiProperty({
    description: 'The amount paid',
    example: 0,
  })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'Payment method',
    enum: PaidVia,
    example: PaidVia.CASH,
  })
  @IsNotEmpty()
  @IsEnum(PaidVia)
  paidVia: PaidVia;
}

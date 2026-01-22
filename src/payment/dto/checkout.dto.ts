import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CheckoutDto {
  @ApiProperty({ description: 'Course UUID' })
  @IsNotEmpty()
  @IsUUID()
  @IsString()
  courseId: string;
}

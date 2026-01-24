import {IsNotEmpty,IsNumber,IsString,IsUUID,Max,Min} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRatingDto {
  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  rate: number;

  @ApiProperty({ example: 'Super course ever!' })
  @IsString()
  @IsNotEmpty()
  comment: string;

  @ApiProperty({ example: 'course-uuid-string' })
  @IsUUID()
  @IsNotEmpty()
  courseId: string;
}

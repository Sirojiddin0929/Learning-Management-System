import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';
import { CourseLevel } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  about: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @IsString()
  @IsNotEmpty()
  banner: string;

  @IsString()
  @IsOptional()
  introVideo?: string;

  @IsEnum(CourseLevel)
  @IsNotEmpty()
  level: CourseLevel;

  @IsNumber()
  @Type(() => Number)
  categoryId: number;
}

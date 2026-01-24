import {IsEnum,IsNotEmpty,IsNumber,IsOptional,IsString,Min,} from 'class-validator';
import { CourseLevel } from '@prisma/client';
import { Type } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty({ example: 'Node.js Backend Development', description: 'Course name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Learn how to build scalable backends with Node.js and NestJS.', description: 'Course description' })
  @IsString()
  @IsNotEmpty()
  about: string;

  @ApiProperty({ example: 49.99, description: 'Course price' })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @ApiProperty({ type: 'string', format: 'binary', description: 'Banner image file', required: false })
  @IsString()
  @IsOptional()
  banner?: any; // Changed from string to any for file handling

  @ApiProperty({ type: 'string', format: 'binary', required: false, description: 'Intro video file' })
  @IsString()
  @IsOptional()
  introVideo?: any; // Changed from string to any for file handling

  @ApiProperty({ enum: CourseLevel, example: CourseLevel.BEGINNER, description: 'Course difficulty level' })
  @IsEnum(CourseLevel)
  @IsNotEmpty()
  level: CourseLevel;

  @ApiProperty({ example: 1, description: 'Category ID' })
  @IsNumber()
  @Type(() => Number)
  categoryId: number;
}

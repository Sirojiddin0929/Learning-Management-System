import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export enum CourseLevel {
  BEGINNER = 'BEGINNER',
  PRE_INTERMEDIATE = 'PRE_INTERMEDIATE',
  INTERMEDIATE = 'INTERMEDIATE',
  UPPER_INTERMEDIATE = 'UPPER_INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

export class QueryMyPurchasesDto {
  @ApiPropertyOptional({ example: 0, default: 0 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(0)
  offset?: number = 0;

  @ApiPropertyOptional({ example: 8, default: 8 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  limit?: number = 8;

  @ApiPropertyOptional({ description: 'Course name or mentor name search' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Category ID filter' })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  categoryId?: number;

  @ApiPropertyOptional({
    enum: CourseLevel,
    description: 'Course difficulty level',
  })
  @IsOptional()
  @IsEnum(CourseLevel)
  level?: CourseLevel;
}
import { IsOptional, IsString, IsNumber, IsEnum, Min, IsBoolean } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CourseLevel } from '@prisma/client';

export class QueryCoursesDto {
  @ApiPropertyOptional({ description: 'Search by course name', example: 'Node.js' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: CourseLevel, description: 'Filter by course level' })
  @IsOptional()
  @IsEnum(CourseLevel)
  level?: CourseLevel;

  @ApiPropertyOptional({ description: 'Filter by category ID', example: 1 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  category_id?: number;

  @ApiPropertyOptional({ description: 'Filter by mentor ID', example: 1 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  mentor_id?: number;

  @ApiPropertyOptional({ description: 'Minimum price filter', example: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price_min?: number;

  @ApiPropertyOptional({ description: 'Maximum price filter', example: 100 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price_max?: number;

  @ApiPropertyOptional({ description: 'Filter by published status', example: true })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  published?: boolean;

  @ApiPropertyOptional({ description: 'Pagination offset', example: 0, default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  offset?: number = 0;

  @ApiPropertyOptional({ description: 'Pagination limit', example: 8, default: 8 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  limit?: number = 8;
}

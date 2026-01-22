import { IsOptional, IsBoolean, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryLessonSectionsDto {
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

  @ApiPropertyOptional({ description: 'Include lessons in response', example: true, default: false })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  include_lessons?: boolean = false;
}

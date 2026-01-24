import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDateString, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class ExamResultQueryDto {
  @ApiPropertyOptional({ description: 'Number of items to skip', default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  offset?: number = 0;

  @ApiPropertyOptional({ description: 'Number of items to return', default: 8 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  limit?: number = 8;

  @ApiPropertyOptional({ description: 'Filter by lesson group ID' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  lesson_group_id?: number;

  @ApiPropertyOptional({ description: 'Filter by user ID' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  user_id?: number;

  @ApiPropertyOptional({ description: 'Filter by passed status', type: Boolean })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  passed?: boolean;

  @ApiPropertyOptional({ description: 'Start date (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  date_from?: string;

  @ApiPropertyOptional({ description: 'End date (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  date_to?: string;
}

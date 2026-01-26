
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class QueryCourseStudentsDto {
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

  @ApiPropertyOptional({ description: 'Student full name or phone search' })
  @IsOptional()
  @IsString()
  search?: string;
}
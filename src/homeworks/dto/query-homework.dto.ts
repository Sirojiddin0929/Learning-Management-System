import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { HomeworkSubStatus } from '@prisma/client';

export class HomeworkQueryDto {
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
}

export class SubmissionQueryDto extends HomeworkQueryDto {
  @ApiPropertyOptional({ enum: HomeworkSubStatus, description: 'Filter by submission status' })
  @IsOptional()
  @IsEnum(HomeworkSubStatus)
  status?: HomeworkSubStatus;

  @ApiPropertyOptional({ description: 'Filter by course ID' })
  @IsOptional()
  @IsUUID()
  course_id?: string;

  @ApiPropertyOptional({ description: 'Filter by homework ID' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  homework_id?: number;

  @ApiPropertyOptional({ description: 'Filter by user ID' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  user_id?: number;
}

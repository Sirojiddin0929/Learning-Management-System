import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { HomeworkSubStatus } from '@prisma/client';

export class CheckHomeworkDto {
  @ApiProperty({ description: 'ID of the submission to check' })
  @IsNotEmpty()
  @IsNumber()
  submissionId: number;

  @ApiProperty({ description: 'New status', enum: HomeworkSubStatus })
  @IsNotEmpty()
  @IsEnum(HomeworkSubStatus)
  status: HomeworkSubStatus;

  @ApiProperty({ description: 'Reason for rejection or comment', required: false })
  @IsOptional()
  @IsString()
  reason?: string;
}

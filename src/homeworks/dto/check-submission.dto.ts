import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckSubmissionDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  submissionId: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsNotEmpty()
  approved: boolean;

  @ApiProperty({ example: 'Reason for rejection/approval', required: false })
  @IsString()
  @IsOptional()
  reason?: string;
}

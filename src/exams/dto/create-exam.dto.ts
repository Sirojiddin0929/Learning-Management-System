import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ExamAnswer } from '@prisma/client';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExamDto {
  @ApiProperty({ example: 'What does DOM mean in JavaScript?' })
  @IsString()
  @IsNotEmpty()
  question: string;

  @ApiProperty({ example: 0, required: false })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  lessonGroupId?: number;

  @ApiProperty({ example: 0, required: false })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  sectionId?: number; 

  @ApiProperty({ example: 'Direct Object Module' })
  @IsString()
  @IsNotEmpty()
  variantA: string;

  @ApiProperty({ example: 'Digital Object Module' })
  @IsString()
  @IsNotEmpty()
  variantB: string;

  @ApiProperty({ example: 'Document Object Model' })
  @IsString()
  @IsNotEmpty()
  variantC: string;

  @ApiProperty({ example: 'Document Object Module' })
  @IsString()
  @IsNotEmpty()
  variantD: string;

  @ApiProperty({ example: 'variantC', enum: ExamAnswer })
  @IsEnum(ExamAnswer)
  @IsNotEmpty()
  answer: ExamAnswer;
}

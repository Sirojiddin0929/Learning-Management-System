import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ExamAnswer } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateExamDto {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsString()
  @IsNotEmpty()
  variantA: string;

  @IsString()
  @IsNotEmpty()
  variantB: string;

  @IsString()
  @IsNotEmpty()
  variantC: string;

  @IsString()
  @IsNotEmpty()
  variantD: string;

  @IsEnum(ExamAnswer)
  @IsNotEmpty()
  answer: ExamAnswer;

  @IsNumber()
  @Type(() => Number)
  sectionId: number;
}

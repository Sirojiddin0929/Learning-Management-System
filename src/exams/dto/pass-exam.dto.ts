import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ExamAnswer } from '@prisma/client';

class AnswerDto {
  @ApiProperty({ description: 'ID of the question' })
  @IsNotEmpty()
  @IsNumber()
  questionId: number;

  @ApiProperty({ description: 'Selected answer variant', enum: ExamAnswer })
  @IsNotEmpty()
  @IsEnum(ExamAnswer)
  answer: ExamAnswer;
}

export class PassExamDto {
  @ApiProperty({ description: 'Lesson Section ID (Lesson Group ID)' })
  @IsNotEmpty()
  @IsNumber()
  sectionId: number;

  @ApiProperty({ description: 'List of answers', type: [AnswerDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers: AnswerDto[];
}

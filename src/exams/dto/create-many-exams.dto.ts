import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateExamDto } from './create-exam.dto';

export class CreateManyExamsDto {
  @ApiProperty({ description: 'List of exams to create', type: [CreateExamDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateExamDto)
  exams: CreateExamDto[];
}

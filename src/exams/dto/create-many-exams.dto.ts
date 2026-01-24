import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { CreateExamDto } from './create-exam.dto';

export class CreateManyExamsDto {
  @ApiProperty({ example: 0 })
  @IsNumber()
  @IsNotEmpty()
  lessonGroupId: number;

  @ApiProperty({ type: [CreateExamDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateExamDto)
  exams: CreateExamDto[];
}

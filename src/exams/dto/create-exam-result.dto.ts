import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateExamResultDto {
  @IsNumber()
  @IsNotEmpty()
  sectionId: number;

  @IsNumber()
  @IsNotEmpty()
  corrects: number;

  @IsNumber()
  @IsNotEmpty()
  wrongs: number;
}

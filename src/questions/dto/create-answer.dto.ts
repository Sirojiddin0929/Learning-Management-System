import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAnswerDto {
  @IsNumber()
  @IsNotEmpty()
  questionId: number;

  @IsString()
  @IsNotEmpty()
  text: string;

  @IsString()
  @IsOptional()
  file?: string;
}

import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class SubmitHomeworkDto {
  @IsNumber()
  @IsNotEmpty()
  homeworkId: number;

  @IsString()
  @IsNotEmpty()
  file: string;

  @IsString()
  @IsOptional()
  text?: string;
}

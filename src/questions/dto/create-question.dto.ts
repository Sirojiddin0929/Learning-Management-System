import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsString()
  @IsOptional()
  file?: string;

  @IsUUID()
  @IsNotEmpty()
  courseId: string;
}

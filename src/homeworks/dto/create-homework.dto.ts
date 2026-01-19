import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateHomeworkDto {
  @IsString()
  @IsNotEmpty()
  task: string;

  @IsString()
  @IsOptional()
  file?: string;

  @IsUUID()
  @IsNotEmpty()
  lessonId: string;
}

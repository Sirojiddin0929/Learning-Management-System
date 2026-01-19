import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateLessonSectionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUUID()
  @IsNotEmpty()
  courseId: string;
}

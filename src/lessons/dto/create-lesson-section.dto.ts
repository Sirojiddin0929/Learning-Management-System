import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLessonSectionDto {
  @ApiProperty({ example: 'Kirish' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'course-uuid-string' })
  @IsUUID()
  @IsNotEmpty()
  courseId: string;
}

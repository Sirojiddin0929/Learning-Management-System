import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCourseMentorDto {
  @ApiProperty({ example: 'course-uuid', description: 'UUID of the course' })
  @IsUUID()
  @IsNotEmpty()
  courseId: string;

  @ApiProperty({ example: 1, description: 'ID of the new mentor user' })
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}

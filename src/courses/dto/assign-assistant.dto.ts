import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignAssistantDto {
  @ApiProperty({ example: 1, description: 'ID of the assistant user' })
  @IsNumber()
  @IsNotEmpty()
  assistantId: number;

  @ApiProperty({ example: 'course-uuid', description: 'UUID of the course' })
  @IsUUID()
  @IsNotEmpty()
  courseId: string;
}

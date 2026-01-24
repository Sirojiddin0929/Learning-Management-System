import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateHomeworkDto {
  @ApiProperty({ example: '1. Create Nest.js app...' })
  @IsString()
  @IsNotEmpty()
  task: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  file?: any;

  @ApiProperty({ example: 'lesson-uuid', description: 'Lesson UUID' })
  @IsUUID()
  @IsNotEmpty()
  lessonId: string;
}

import { IsNotEmpty, IsOptional, IsString, IsNumberString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLessonDto {
  @ApiProperty({ description: 'Lesson name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Lesson description/about' })
  @IsString()
  @IsNotEmpty()
  about: string;

  @ApiProperty({ description: 'Group/Section ID the lesson belongs to' })
  @IsNumberString()
  @IsNotEmpty()
  groupId: string;

  @ApiPropertyOptional({ description: 'Video file', type: 'string', format: 'binary' })
  @IsOptional()
  video?: any;

  @ApiPropertyOptional({ description: 'Video URL (alternative to file upload)' })
  @IsString()
  @IsOptional()
  videoUrl?: string;
}

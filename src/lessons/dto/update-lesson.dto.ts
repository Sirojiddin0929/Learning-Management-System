import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateLessonDto {
  @ApiPropertyOptional({ description: 'Lesson name' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Lesson description/about' })
  @IsString()
  @IsOptional()
  about?: string;

  @ApiPropertyOptional({ description: 'Video file', type: 'string', format: 'binary' })
  @IsOptional()
  video?: any;

  @ApiPropertyOptional({ description: 'Video URL (alternative to file upload)' })
  @IsString()
  @IsOptional()
  videoUrl?: string;
}

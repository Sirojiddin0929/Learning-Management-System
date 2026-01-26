import { IsNotEmpty, IsOptional, IsString, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateLessonFilesDto {
  @ApiProperty({ description: 'Files to upload', type: 'array', items: { type: 'string', format: 'binary' } })
  @IsOptional()
  files: any[];

  @ApiProperty({ description: 'Lesson UUID' })
  @IsString()
  @IsNotEmpty()
  lessonId: string;

  @ApiPropertyOptional({ 
    description: 'Notes for each file as JSON array of strings', 
    type: 'string',
    example: '["Note for file 1", "Note for file 2"]'
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return null;
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  })
  notes?: string[] | null;
}

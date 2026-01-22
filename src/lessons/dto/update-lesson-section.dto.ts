import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateLessonSectionDto {
  @ApiProperty({ example: 'Kirish', description: 'Section name' })
  @IsString()
  @IsNotEmpty()
  name: string;
}

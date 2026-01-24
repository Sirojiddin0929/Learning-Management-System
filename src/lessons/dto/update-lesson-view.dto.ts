import { IsBoolean, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateLessonViewDto {
  @ApiProperty({ example: true, description: 'Mark lesson as viewed' })
  @IsBoolean()
  @IsNotEmpty()
  view: boolean;
}

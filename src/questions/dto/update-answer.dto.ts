import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateAnswerDto {
  @ApiProperty({ description: 'Updated answer text' })
  @IsNotEmpty()
  @IsString()
  text: string;

  @ApiProperty({ description: 'Updated file URL', required: false })
  @IsOptional()
  @IsString()
  file?: string;
}

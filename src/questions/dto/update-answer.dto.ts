import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAnswerDto {
  @ApiProperty({ example: 'Updated answer text', required: false })
  @IsOptional()
  @IsString()
  text?: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  file?: any;
}

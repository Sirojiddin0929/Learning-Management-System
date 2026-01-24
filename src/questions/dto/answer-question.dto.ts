import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AnswerQuestionDto {
  @ApiProperty({ example: 'Here is the solution...' })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  file?: any;
}

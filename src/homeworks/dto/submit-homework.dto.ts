import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubmitHomeworkDto {
  @ApiProperty({ type: 'string', format: 'binary', description: 'Homework submission file' })
  @IsOptional()
  file: any;

  @ApiProperty({ example: 'My solution text...', required: false })
  @IsString()
  @IsOptional()
  text?: string;
}

import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({ example: 'John Doe', description: 'Full Name', required: false })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({ type: 'string', format: 'binary', description: 'Profile image', required: false })
  @IsOptional()
  image?: any;
}

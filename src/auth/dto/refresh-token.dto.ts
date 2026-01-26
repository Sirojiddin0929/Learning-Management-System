import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({ example: 'your-refresh-token-here' })
  @IsNotEmpty()
  @IsString()
  token: string;
}

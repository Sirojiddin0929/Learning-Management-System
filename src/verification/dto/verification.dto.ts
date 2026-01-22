import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendOtpDto {
  @ApiProperty({ example: '+998901234567', description: 'User phone number' })
  @IsPhoneNumber('UZ')
  phone: string;
}

export class VerifyOtpDto {
  @ApiProperty({ example: '+998901234567', description: 'User phone number' })
  @IsPhoneNumber('UZ')
  phone: string;

  @ApiProperty({ example: '123456', description: 'OTP code sent to phone' })
  @IsString()
  @IsNotEmpty()
  code: string;
}

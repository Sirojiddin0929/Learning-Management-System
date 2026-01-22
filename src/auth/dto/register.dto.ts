import {IsNotEmpty,IsPhoneNumber,IsString,MinLength,} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: '+998901234567', description: 'User phone number' })
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('UZ')
  phone: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Eshmat Toshmatov', description: 'User full name' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: '123456', description: 'OTP code sent to phone' })
  @IsString()
  @IsNotEmpty()
  code: string;
}

export class RegisterOtpDto {
  @ApiProperty({ example: '+998901234567', description: 'User phone number' })
  @IsPhoneNumber('UZ')
  phone: string;
}

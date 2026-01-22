import {IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class CreateUserDto {
  @ApiProperty({ example: '+998901234567' })
  @IsPhoneNumber('UZ')
  phone: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Eshmat Toshmatov' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: 'https://example.com/photo.jpg', required: false })
  @IsString()
  @IsOptional()
  image?: string;
}

export class CreateAdminDto extends CreateUserDto {}
export class CreateMentorDto extends CreateUserDto {}
export class CreateAssistantDto extends CreateUserDto {}

export class UpdateMentorDto {
  @ApiProperty({ example: 'Updated Name', required: false })
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiProperty({ example: 'https://example.com/photo.jpg', required: false })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({ example: 'password123', required: false })
  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;
}

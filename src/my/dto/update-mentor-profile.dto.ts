import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateMentorProfileDto {
  @ApiProperty({ example: 3, description: 'Years of experience' })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  experience: number;

  @ApiProperty({ example: 'Full-stack software engineer', description: 'Job title' })
  @IsString()
  @IsNotEmpty()
  job: string;

  @ApiProperty({ example: 'About me...', description: 'Bio' })
  @IsString()
  @IsNotEmpty()
  about: string;

  @ApiProperty({ example: 'https://t.me/username', description: 'Telegram URL' })
  @IsUrl()
  @IsOptional()
  telegram?: string;

  @ApiProperty({ example: 'https://facebook.com/user', description: 'Facebook URL' })
  @IsString() // IsUrl can be strict, sometimes strings are easier for partial URLs if allowed, but IsUrl is better practice
  @IsOptional()
  facebook?: string;

  @ApiProperty({ example: 'https://instagram.com/user', description: 'Instagram URL' })
  @IsString()
  @IsOptional()
  instagram?: string;

  @ApiProperty({ example: 'https://linkedin.com/in/user', description: 'LinkedIn URL' })
  @IsString()
  @IsOptional()
  linkedin?: string;

  @ApiProperty({ example: 'https://github.com/user', description: 'GitHub URL' })
  @IsString()
  @IsOptional()
  github?: string;

  @ApiProperty({ example: 'https://mysite.com', description: 'Website URL' })
  @IsString()
  @IsOptional()
  website?: string;
}

import { IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MinLength, IsInt, IsUrl, Min } from 'class-validator';
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

export class CreateMentorDto extends CreateUserDto {
  @ApiProperty({ example: 3 })
  @IsInt()
  @Min(0)
  experience: number;

  @ApiProperty({ example: 'Full-stack software engineer' })
  @IsString()
  @IsNotEmpty()
  job: string;

  @ApiProperty({ example: 'About me text...', required: false })
  @IsString()
  @IsOptional()
  about?: string;

  @ApiProperty({ example: 'https://t.me/username', required: false })
  @IsOptional()
  @IsString()
  telegram?: string;

  @ApiProperty({ example: 'https://facebook.com/username', required: false })
  @IsOptional()
  @IsUrl()
  facebook?: string;

  @ApiProperty({ example: 'https://instagram.com/username', required: false })
  @IsOptional()
  @IsUrl()
  instagram?: string;

  @ApiProperty({ example: 'https://linkedin.com/in/username', required: false })
  @IsOptional()
  @IsUrl()
  linkedin?: string;

  @ApiProperty({ example: 'https://github.com/username', required: false })
  @IsOptional()
  @IsUrl()
  github?: string;

  @ApiProperty({ example: 'https://website.com', required: false })
  @IsOptional()
  @IsUrl()
  website?: string;
}

export class CreateAssistantDto extends CreateUserDto {
  @ApiProperty({ example: 'uuid-string-of-course-id' })
  @IsString()
  @IsNotEmpty()
  courseId: string;
}

export class UpdateMentorDto {
  @ApiProperty({ example: '+998902400025', required: false })
  @IsOptional()
  @IsPhoneNumber('UZ')
  phone?: string;

  @ApiProperty({ example: 'Adminov Adminjon', required: false })
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

  @ApiProperty({ example: 3, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  experience?: number;

  @ApiProperty({ example: 'Full-stack software engineer', required: false })
  @IsOptional()
  @IsString()
  job?: string;

  @ApiProperty({ example: 'Updated about text', required: false })
  @IsOptional()
  @IsString()
  about?: string;

  @ApiProperty({ example: 'https://t.me/raupov_manuchehr', required: false })
  @IsOptional()
  @IsString()
  telegram?: string;

  @ApiProperty({ example: 'https://facebook.com/new', required: false })
  @IsOptional()
  @IsUrl()
  facebook?: string;

  @ApiProperty({ example: 'https://instagram.com/new', required: false })
  @IsOptional()
  @IsUrl()
  instagram?: string;

  @ApiProperty({ example: 'https://linkedin.com/in/new', required: false })
  @IsOptional()
  @IsUrl()
  linkedin?: string;

  @ApiProperty({ example: 'https://github.com/new', required: false })
  @IsOptional()
  @IsUrl()
  github?: string;

  @ApiProperty({ example: 'https://website.com/new', required: false })
  @IsOptional()
  @IsUrl()
  website?: string;
}

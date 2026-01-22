import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({ example: 'Eshmat Toshmatov', required: false })
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiProperty({ example: 'https://example.com/photo.jpg', required: false })
  @IsString()
  @IsOptional()
  image?: string;
}

export class UpdateLastActivityDto {
  @ApiProperty({ example: 'uuid-course-id', required: false })
  @IsString()
  @IsOptional()
  courseId?: string;

  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @IsOptional()
  sectionId?: number;

  @ApiProperty({ example: 'uuid-lesson-id', required: false })
  @IsString()
  @IsOptional()
  lessonId?: string;

  @ApiProperty({ example: '/courses/lesson/1', required: false })
  @IsString()
  @IsOptional()
  url?: string;
}

export class UpdatePhoneDto {
  @ApiProperty({ example: '+998901234567' })
  @IsPhoneNumber('UZ')
  phone: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty()
  code: string;
}

export class UpdatePasswordDto {
  @ApiProperty({ example: 'oldPassword123' })
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({ example: 'newPassword123' })
  @IsString()
  @MinLength(6)
  newPassword: string;
}

export class UpdateMentorProfileDto {
  @ApiProperty({ example: 'I am a senior developer', required: false })
  @IsString()
  @IsOptional()
  about?: string;

  @ApiProperty({ example: 'Senior Dev', required: false })
  @IsString()
  @IsOptional()
  job?: string;

  @ApiProperty({ example: 5, required: false })
  @IsNumber()
  @IsOptional()
  experience?: number;

  @ApiProperty({ example: '@mentor_tg', required: false })
  @IsString()
  @IsOptional()
  telegram?: string;

  @ApiProperty({ example: '@mentor_ig', required: false })
  @IsString()
  @IsOptional()
  instagram?: string;

  @ApiProperty({ example: 'linkedin.com/in/mentor', required: false })
  @IsString()
  @IsOptional()
  linkedin?: string;
}

import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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

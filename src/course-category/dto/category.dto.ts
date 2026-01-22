import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseCategoryDto {
  @ApiProperty({ example: 'Backend Development', description: 'Category name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Learn backend technologies', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateCategoryDto {
  @ApiProperty({ example: 'Backend Development', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Learn backend technologies', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}

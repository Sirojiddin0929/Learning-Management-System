import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Mobile Development', description: 'Category name' })
  @IsString()
  @IsNotEmpty()
  name: string;
}

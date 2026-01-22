import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { UserRole } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoleDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ enum: UserRole, example: UserRole.MENTOR, description: 'New role for the user' })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
}

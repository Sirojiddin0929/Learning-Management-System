import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty,IsString } from 'class-validator';

export class CreateContactDto {
  @ApiProperty({ description: 'Full Name' })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({ description: 'Phone Number' })
  @IsNotEmpty()
  @IsString() 
  phone: string;

  @ApiProperty({ description: 'Message' })
  @IsNotEmpty()
  @IsString()
  message: string;
}

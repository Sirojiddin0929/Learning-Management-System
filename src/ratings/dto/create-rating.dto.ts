import {IsNotEmpty,IsNumber,IsString,IsUUID,Max,Min} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRatingDto {
  @IsNumber()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  rate: number;

  @IsString()
  @IsNotEmpty()
  comment: string;

  @IsUUID()
  @IsNotEmpty()
  courseId: string;
}

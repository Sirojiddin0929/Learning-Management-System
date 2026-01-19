import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createRating(@Body() dto: CreateRatingDto, @Request() req) {
    return this.ratingsService.createRating(req.user.id, dto);
  }

  @Get()
  getRatings(@Query('courseId') courseId: string) {
    return this.ratingsService.getRatings(courseId);
  }
}

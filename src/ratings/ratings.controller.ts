import {Controller,Post,Delete,Body,Get,Param,Query,UseGuards,Request,ParseIntPipe,} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { QueryRatingsDto } from './dto/query-ratings.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Course Rating')
@Controller('course-rating')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @ApiBearerAuth('access-token')
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Create a course rating (Student only)' })
  createRating(@Body() dto: CreateRatingDto, @Request() req) {
    return this.ratingsService.createRating(req.user.id, dto);
  }

  @ApiBearerAuth('access-token')
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a course rating (Admin only)' })
  @ApiParam({ name: 'id', description: 'Rating ID' })
  deleteRating(@Param('id', ParseIntPipe) id: number) {
    return this.ratingsService.deleteRating(id);
  }

  @Get('list/:course_id')
  @ApiOperation({ summary: 'Get course ratings list with pagination (Public)' })
  @ApiParam({ name: 'course_id', description: 'Course UUID' })
  @ApiQuery({ name: 'offset', required: false, example: 0 })
  @ApiQuery({ name: 'limit', required: false, example: 8 })
  getRatingsList(
    @Param('course_id') courseId: string,
    @Query() query: QueryRatingsDto,
  ) {
    return this.ratingsService.getRatingsList(courseId, query);
  }

  @Get('latest')
  @ApiOperation({ summary: 'Get latest 10 course ratings (Public)' })
  getLatestRatings() {
    return this.ratingsService.getLatestRatings();
  }

  
  @Get()
  @ApiOperation({ summary: 'Get all ratings for a course (Legacy endpoint)' })
  getRatings(@Query('courseId') courseId: string) {
    return this.ratingsService.getRatings(courseId);
  }
}

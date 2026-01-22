import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PurchasedCoursesService } from './purchased-courses.service';
import { PurchaseCourseDto } from './dto/purchase-course.dto';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Purchased Courses')
@Controller('purchased-courses')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
export class PurchasedCoursesController {
  constructor(private readonly purchasedCoursesService: PurchasedCoursesService) {}

  @Get('mine')
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Get all courses purchased by the current user (Student)' })
  getMyPurchasedCourses(@Request() req) {
    return this.purchasedCoursesService.getMyPurchasedCourses(req.user.id);
  }

  @Get('mine/:course_id')
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Get details of a specific purchased course (Student)' })
  getMyPurchasedCourse(@Request() req, @Param('course_id') courseId: string) {
    return this.purchasedCoursesService.getMyPurchasedCourse(req.user.id, courseId);
  }

  @Post('purchase')
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Purchase a course (Student)' })
  purchaseCourse(@Request() req, @Body() dto: PurchaseCourseDto) {
    return this.purchasedCoursesService.purchaseCourse(req.user.id, dto);
  }

  @Get('course/:id/students')
  @Roles(UserRole.MENTOR, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all students who purchased a specific course (Mentor, Admin)' })
  getCourseStudents(@Param('id') courseId: string) {
    return this.purchasedCoursesService.getCourseStudents(courseId);
  }

  @Post('create')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Manually grant a course purchase (Admin)' })
  createPurchase(@Body() dto: CreatePurchaseDto) {
    return this.purchasedCoursesService.createPurchase(dto);
  }
}

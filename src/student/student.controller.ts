import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StudentService } from './student.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Student Panel')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.STUDENT)
@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get('my-courses')
  @ApiOperation({ summary: 'Get courses assigned to the student' })
  getMyCourses(@Request() req) {
    return this.studentService.getMyCourses(req.user.id);
  }

  @Get('my-results')
  @ApiOperation({ summary: 'Get exam results of the student' })
  getMyResults(@Request() req) {
    return this.studentService.getMyResults(req.user.id);
  }

  @Get('my-submissions')
  @ApiOperation({ summary: 'Get homework submissions of the student' })
  getMySubmissions(@Request() req) {
    return this.studentService.getMySubmissions(req.user.id);
  }
}

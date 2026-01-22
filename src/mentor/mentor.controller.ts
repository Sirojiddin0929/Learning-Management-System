import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MentorService } from './mentor.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Mentor Panel')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.MENTOR, UserRole.ADMIN)
@Controller('mentor')
export class MentorController {
  constructor(private readonly mentorService: MentorService) {}

  @Get('my-courses')
  @ApiOperation({ summary: 'Get courses created by the mentor' })
  getMyCourses(@Request() req) {
    return this.mentorService.getMyCourses(req.user.id);
  }

  @Get('pending-homeworks')
  @ApiOperation({ summary: 'Get pending homework submissions for mentor courses' })
  getPendingHomeworks(@Request() req) {
    return this.mentorService.getPendingHomeworks(req.user.id);
  }
}

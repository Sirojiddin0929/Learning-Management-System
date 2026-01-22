import { Controller, Get, Patch, Put, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MyService } from './my.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';
import { 
  UpdateProfileDto, 
  UpdateLastActivityDto, 
  UpdatePhoneDto, 
  UpdatePasswordDto, 
  UpdateMentorProfileDto 
} from './dto/my.dto';

@ApiTags('Profile')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('my')
export class MyController {
  constructor(private readonly myService: MyService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  getProfile(@Request() req) {
    return this.myService.getProfile(req.user.id);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update current user profile' })
  updateProfile(@Request() req, @Body() dto: UpdateProfileDto) {
    return this.myService.updateProfile(req.user.id, dto);
  }

  @Get('last-activity')
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Get student last activity' })
  getLastActivity(@Request() req) {
    return this.myService.getLastActivity(req.user.id);
  }

  @Put('last-activity')
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Update student last activity' })
  updateLastActivity(@Request() req, @Body() dto: UpdateLastActivityDto) {
    return this.myService.updateLastActivity(req.user.id, dto);
  }

  @Post('phone/update')
  @ApiOperation({ summary: 'Update phone number with OTP verification' })
  updatePhone(@Request() req, @Body() dto: UpdatePhoneDto) {
    return this.myService.updatePhone(req.user.id, dto);
  }

  @Patch('password/update')
  @ApiOperation({ summary: 'Update password' })
  updatePassword(@Request() req, @Body() dto: UpdatePasswordDto) {
    return this.myService.updatePassword(req.user.id, dto);
  }

  @Patch('mentor-profile')
  @Roles(UserRole.MENTOR)
  @ApiOperation({ summary: 'Update mentor profile details' })
  updateMentorProfile(@Request() req, @Body() dto: UpdateMentorProfileDto) {
    return this.myService.updateMentorProfile(req.user.id, dto);
  }
}

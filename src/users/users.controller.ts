import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';
import { CreateAdminDto, CreateMentorDto, CreateAssistantDto, UpdateMentorDto } from './dto/user.dto';
import { QueryCommonDto, QueryUserDto } from './dto/query-user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  
  @Get('mentors')
  @ApiOperation({ summary: 'Get all mentors (Public)' })
  getMentors(@Query() query: QueryCommonDto) {
    return this.usersService.getMentors(query);
  }

  @Get('mentors/:id')
  @ApiOperation({ summary: 'Get single mentor by ID (Public)' })
  getMentorById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getMentorById(id);
  }

  
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  getAllUsers(@Query() query: QueryUserDto) {
    return this.usersService.getAllUsers(query);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('single/:id')
  @ApiOperation({ summary: 'Get single user by ID (Admin only)' })
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getUserById(id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @Get('by-phone/:phone')
  @ApiOperation({ summary: 'Get user by phone (Admin/Mentor)' })
  getUserByPhone(@Param('phone') phone: string) {
    return this.usersService.getUserByPhone(phone);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('create/admin')
  @ApiOperation({ summary: 'Create admin user (Admin only)' })
  createAdmin(@Body() dto: CreateAdminDto) {
    return this.usersService.createAdmin(dto);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('create/mentor')
  @ApiOperation({ summary: 'Create mentor user (Admin only)' })
  createMentor(@Body() dto: CreateMentorDto) {
    return this.usersService.createMentor(dto);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @Post('create/assistant')
  @ApiOperation({ summary: 'Create assistant user (Admin/Mentor)' })
  createAssistant(@Body() dto: CreateAssistantDto) {
    return this.usersService.createAssistant(dto);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch('update/mentor/:id')
  @ApiOperation({ summary: 'Update mentor (Admin only)' })
  updateMentor(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMentorDto,
  ) {
    return this.usersService.updateMentor(id, dto);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete user (Admin only)' })
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }
}

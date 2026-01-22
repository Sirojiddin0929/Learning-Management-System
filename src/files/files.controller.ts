import { Controller, Get, Param, Res, UseGuards, Request } from '@nestjs/common';
import type { Response } from 'express';
import { FilesService } from './files.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('publics/:name')
  @ApiOperation({ summary: 'Get a public file (course banners, etc.)' })
  @ApiParam({ name: 'name', description: 'Filename' })
  async getPublicFile(@Param('name') name: string, @Res() res: Response) {
    const path = this.filesService.getPublicFilePath(name);
    return res.sendFile(path);
  }

  @Get('private/lesson-file/:lessonId/:name')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT, UserRole.ADMIN, UserRole.MENTOR)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get a private lesson file (requires purchase)' })
  @ApiParam({ name: 'lessonId', description: 'Lesson UUID' })
  @ApiParam({ name: 'name', description: 'Filename' })
  async getLessonFile(
    @Param('lessonId') lessonId: string,
    @Param('name') name: string,
    @Request() req,
    @Res() res: Response,
  ) {
    // Admins and Mentors skip purchase check for now, or just check role
    if (req.user.role === UserRole.STUDENT) {
      await this.filesService.checkFileAccess(req.user.id, lessonId);
    }
    
    const path = this.filesService.getLessonFilePath(name);
    return res.sendFile(path);
  }

  @Get('private/video/:lessonId/:hlsf')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT, UserRole.ADMIN, UserRole.MENTOR)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get a private lesson video/segment (requires purchase)' })
  @ApiParam({ name: 'lessonId', description: 'Lesson UUID' })
  @ApiParam({ name: 'hlsf', description: 'Filename or HLS segment' })
  async getVideoFile(
    @Param('lessonId') lessonId: string,
    @Param('hlsf') hlsf: string,
    @Request() req,
    @Res() res: Response,
  ) {
    if (req.user.role === UserRole.STUDENT) {
      await this.filesService.checkFileAccess(req.user.id, lessonId);
    }

    const path = this.filesService.getVideoFilePath(hlsf);
    return res.sendFile(path);
  }
}

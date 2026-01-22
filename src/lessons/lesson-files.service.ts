import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonFilesDto } from './dto/create-lesson-files.dto';

@Injectable()
export class LessonFilesService {
  constructor(private prisma: PrismaService) {}

  async createLessonFiles(
    dto: CreateLessonFilesDto,
    files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('At least one file is required');
    }

    // Verify lesson exists
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: dto.lessonId },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    // Parse notes array
    const notes = dto.notes || [];

    // Create lesson files
    const createdFiles = await Promise.all(
      files.map((file, index) => {
        return this.prisma.lessonFile.create({
          data: {
            file: `/uploads/lesson-files/${file.filename}`,
            note: notes[index] || null,
            lessonId: dto.lessonId,
          },
        });
      }),
    );

    return {
      message: `Successfully uploaded ${createdFiles.length} file(s)`,
      files: createdFiles,
    };
  }

  async deleteLessonFile(id: number) {
    const file = await this.prisma.lessonFile.findUnique({
      where: { id },
    });

    if (!file) {
      throw new NotFoundException('Lesson file not found');
    }

    await this.prisma.lessonFile.delete({
      where: { id },
    });

    return { message: 'Lesson file deleted successfully' };
  }

  async getLessonFiles(lessonId: string) {
    // Verify lesson exists
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    const files = await this.prisma.lessonFile.findMany({
      where: { lessonId },
      orderBy: { createdAt: 'asc' },
    });

    return files;
  }
}

import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonSectionDto } from './dto/create-lesson-section.dto';
import { UpdateLessonSectionDto } from './dto/update-lesson-section.dto';
import { QueryLessonSectionsDto } from './dto/query-lesson-sections.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(private prisma: PrismaService) {}

  // =================== LESSON SECTION METHODS ===================

  async createSection(dto: CreateLessonSectionDto) {
    return this.prisma.lessonSection.create({
      data: dto,
    });
  }

  async updateSection(id: number, dto: UpdateLessonSectionDto) {
    const section = await this.prisma.lessonSection.findUnique({
      where: { id },
    });

    if (!section) {
      throw new NotFoundException('Lesson section not found');
    }

    return this.prisma.lessonSection.update({
      where: { id },
      data: dto,
    });
  }

  async deleteSection(id: number) {
    const section = await this.prisma.lessonSection.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            lessons: true,
          },
        },
      },
    });

    if (!section) {
      throw new NotFoundException('Lesson section not found');
    }

    if (section._count.lessons > 0) {
      throw new BadRequestException('Cannot delete section with lessons. Delete lessons first.');
    }

    await this.prisma.lessonSection.delete({
      where: { id },
    });

    return { message: 'Lesson section deleted successfully' };
  }

  async getAllSections(courseId: string, query: QueryLessonSectionsDto) {
    const { offset = 0, limit = 8, include_lessons = false } = query;

    const [sections, total] = await Promise.all([
      this.prisma.lessonSection.findMany({
        where: { courseId },
        skip: offset,
        take: limit,
        include: {
          lessons: include_lessons,
        },
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.lessonSection.count({
        where: { courseId },
      }),
    ]);

    return {
      sections,
      total,
      offset,
      limit,
    };
  }

  async findAllSections(courseId: string) {
    return this.prisma.lessonSection.findMany({
      where: { courseId },
      include: { lessons: true },
    });
  }

  // =================== LESSON METHODS ===================

  async createLesson(dto: CreateLessonDto, videoFile?: Express.Multer.File) {
    // Convert groupId to sectionId (number)
    const sectionId = parseInt(dto.groupId, 10);
    
    if (isNaN(sectionId)) {
      throw new BadRequestException('Invalid groupId format');
    }

    // Verify section exists
    const section = await this.prisma.lessonSection.findUnique({
      where: { id: sectionId },
    });

    if (!section) {
      throw new NotFoundException('Lesson group/section not found');
    }

    // Determine video URL
    let videoUrl: string;
    if (videoFile) {
      videoUrl = `/uploads/lessons/${videoFile.filename}`;
    } else if (dto.videoUrl) {
      videoUrl = dto.videoUrl;
    } else {
      throw new BadRequestException('Either video file or videoUrl is required');
    }

    return this.prisma.lesson.create({
      data: {
        name: dto.name,
        about: dto.about,
        video: videoUrl,
        sectionId,
      },
      include: {
        section: true,
      },
    });
  }

  async updateLesson(id: string, dto: UpdateLessonDto, videoFile?: Express.Multer.File) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    // Build update data
    const updateData: any = {};
    
    if (dto.name !== undefined) {
      updateData.name = dto.name;
    }
    
    if (dto.about !== undefined) {
      updateData.about = dto.about;
    }

    // Handle video update
    if (videoFile) {
      updateData.video = `/uploads/lessons/${videoFile.filename}`;
    } else if (dto.videoUrl !== undefined) {
      updateData.video = dto.videoUrl;
    }

    return this.prisma.lesson.update({
      where: { id },
      data: updateData,
      include: {
        section: true,
      },
    });
  }

  async deleteLesson(id: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    await this.prisma.lesson.delete({
      where: { id },
    });

    return { message: 'Lesson deleted successfully' };
  }

  async getLessonDetail(id: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: {
        section: {
          include: {
            course: true,
          },
        },
        files: true,
        homework: true,
        views: {
          select: {
            userId: true,
            view: true,
          },
        },
      },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    return lesson;
  }

  async getLessonSingle(lessonId: string, userId: number) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        section: {
          include: {
            course: {
              select: {
                id: true,
                name: true,
                published: true,
              },
            },
          },
        },
        files: true,
        homework: {
          select: {
            id: true,
            task: true,
            file: true,
          },
        },
      },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    // Check if course is published or if user has access
    if (!lesson.section.course.published) {
      // Check if user has purchased or been assigned this course
      const [purchased, assigned] = await Promise.all([
        this.prisma.purchasedCourse.findFirst({
          where: { userId, courseId: lesson.section.course.id },
        }),
        this.prisma.assignedCourse.findFirst({
          where: { userId, courseId: lesson.section.course.id },
        }),
      ]);

      if (!purchased && !assigned) {
        throw new ForbiddenException('You do not have access to this lesson');
      }
    }

    // Record lesson view
    await this.prisma.lessonView.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      update: { view: true },
      create: {
        userId,
        lessonId,
        view: true,
      },
    });

    return lesson;
  }
}

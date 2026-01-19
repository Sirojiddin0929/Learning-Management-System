import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateCourseDto } from './dto/create-course.dto';
import { Course, CourseCategory } from '@prisma/client';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async createCategory(dto: CreateCategoryDto): Promise<CourseCategory> {
    return this.prisma.courseCategory.create({
      data: dto,
    });
  }

  async findAllCategories(): Promise<CourseCategory[]> {
    return this.prisma.courseCategory.findMany();
  }

  async createCourse(dto: CreateCourseDto, mentorId: number): Promise<Course> {
    return this.prisma.course.create({
      data: {
        ...dto,
        mentorId,
      },
      include: { category: true, mentor: true },
    });
  }

  async findAllCourses(): Promise<Course[]> {
    return this.prisma.course.findMany({
      where: { published: true },
      include: {
        category: true,
        mentor: { select: { fullName: true, id: true } },
      },
    });
  }
}

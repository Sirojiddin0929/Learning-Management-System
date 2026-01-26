import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { QueryCoursesDto } from './dto/query-courses.dto';
import { AssignAssistantDto } from './dto/assign-assistant.dto';
import { UpdateCourseMentorDto } from './dto/update-course-mentor.dto';
import { Course, CourseCategory, Prisma } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

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

  async createCourse(
    dto: CreateCourseDto,
    mentorId: number,
    files?: { banner?: Express.Multer.File[]; introVideo?: Express.Multer.File[] },
  ): Promise<Course> {
    const data: any = {
      ...dto,
      mentorId,
    };

    
    if (files?.banner?.[0]) {
      data.banner = `http://localhost:4000/uploads/courses/${files.banner[0].filename}`;
    }
    if (files?.introVideo?.[0]) {
      data.introVideo = `http://localhost:4000/uploads/courses/${files.introVideo[0].filename}`;
    }

    return this.prisma.course.create({
      data,
      include: { category: true, mentor: { select: { id: true, fullName: true } } },
    });
  }

  async updateCourse(
    id: string,
    dto: UpdateCourseDto,
    userId: number,
    userRole: string,
    files?: { banner?: Express.Multer.File[]; introVideo?: Express.Multer.File[] },
  ): Promise<Course> {
    const course = await this.prisma.course.findUnique({ where: { id } });
    
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    
    if (userRole !== 'ADMIN' && course.mentorId !== userId) {
      throw new ForbiddenException('You can only update your own courses');
    }

    const data: any = { ...dto };

    
    if (files?.banner?.[0]) {
      if (course.banner) {
        this.deleteFile(course.banner);
      }
      data.banner = `http://localhost:4000/uploads/courses/${files.banner[0].filename}`;
    }
    if (files?.introVideo?.[0]) {
      if (course.introVideo) {
        this.deleteFile(course.introVideo);
      }
      data.introVideo = `http://localhost:4000/uploads/courses/${files.introVideo[0].filename}`;
    }

    return this.prisma.course.update({
      where: { id },
      data,
      include: { category: true, mentor: { select: { id: true, fullName: true } } },
    });
  }

  async deleteCourse(id: string, userId: number, userRole: string): Promise<{ message: string }> {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            purchasedBy: true,
            sections: true,
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    
    if (userRole !== 'ADMIN' && course.mentorId !== userId) {
      throw new ForbiddenException('You can only delete your own courses');
    }

    
    if (course.published) {
      throw new BadRequestException('Cannot delete published courses. Unpublish first.');
    }
    if (course._count.purchasedBy > 0) {
      throw new BadRequestException('Cannot delete courses with purchases');
    }
    if (course._count.sections > 0) {
      throw new BadRequestException('Cannot delete courses with lessons or lesson sections');
    }

    
    if (course.banner) {
      this.deleteFile(course.banner);
    }
    if (course.introVideo) {
      this.deleteFile(course.introVideo);
    }

    await this.prisma.course.delete({ where: { id } });

    return { message: 'Course deleted successfully' };
  }

  async getAllCourses(query: QueryCoursesDto) {
    const { offset = 0, limit = 8, search, level, category_id, mentor_id, price_min, price_max, published } = query;

    const where: Prisma.CourseWhereInput = {};

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }
    if (level) {
      where.level = level;
    }
    if (category_id) {
      where.categoryId = category_id;
    }
    if (mentor_id) {
      where.mentorId = mentor_id;
    }
    if (price_min !== undefined || price_max !== undefined) {
      where.price = {};
      if (price_min !== undefined) {
        where.price.gte = price_min;
      }
      if (price_max !== undefined) {
        where.price.lte = price_max;
      }
    }
    if (published !== undefined) {
      where.published = published;
    }

    const [courses, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
        skip: offset,
        take: limit,
        include: {
          category: true,
          mentor: { select: { id: true, fullName: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.course.count({ where }),
    ]);

    return {
      courses,
      total,
      offset,
      limit,
    };
  }

  async getMyCourses(mentorId: number, query: QueryCoursesDto) {
    return this.getAllCourses({ ...query, mentor_id: mentorId });
  }

  async getMentorCourses(mentorId: number, query: QueryCoursesDto) {
    return this.getAllCourses({ ...query, mentor_id: mentorId });
  }

  async publishCourse(id: string): Promise<Course> {
    const course = await this.prisma.course.findUnique({ where: { id } });
    
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return this.prisma.course.update({
      where: { id },
      data: { published: true },
      include: { category: true, mentor: { select: { id: true, fullName: true } } },
    });
  }

  async unpublishCourse(id: string): Promise<Course> {
    const course = await this.prisma.course.findUnique({ where: { id } });
    
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return this.prisma.course.update({
      where: { id },
      data: { published: false },
      include: { category: true, mentor: { select: { id: true, fullName: true } } },
    });
  }

  async getSingleCourse(id: string): Promise<Course> {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        category: true,
        mentor: { select: { id: true, fullName: true } },
        sections: {
          include: {
            lessons: true,
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course;
  }

  async getOneFull(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        category: true,
        mentor: { select: { id: true, fullName: true, phone: true } },
        sections: {
          include: {
            lessons: true,
          },
        },
        assignedTo: {
            include: {
                user: { select: { id: true, fullName: true, phone: true } }
            }
        },
        purchasedBy: {
             include: {
                user: { select: { id: true, fullName: true, phone: true } }
            }
        }
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course;
  }

  async getMyAssignedCourses(userId: number, query: QueryCoursesDto) {
    
    const { offset = 0, limit = 8, search, level, category_id, mentor_id, price_min, price_max, published } = query;

    const courseWhere: Prisma.CourseWhereInput = {};
    if (search) courseWhere.name = { contains: search, mode: 'insensitive' };
    if (level) courseWhere.level = level;
    if (category_id) courseWhere.categoryId = category_id;
    if (mentor_id) courseWhere.mentorId = mentor_id;
    if (published !== undefined) courseWhere.published = published;
    if (price_min !== undefined || price_max !== undefined) {
      courseWhere.price = {};
      if (price_min !== undefined) courseWhere.price.gte = price_min;
      if (price_max !== undefined) courseWhere.price.lte = price_max;
    }

    const where: Prisma.AssignedCourseWhereInput = {
        userId,
        course: courseWhere
    };

    const [assignments, total] = await Promise.all([
        this.prisma.assignedCourse.findMany({
            where,
            skip: offset,
            take: limit,
            include: {
                course: {
                    include: {
                        category: true,
                        mentor: { select: { id: true, fullName: true } }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        }),
        this.prisma.assignedCourse.count({ where })
    ]);

    return {
        courses: assignments.map(a => a.course),
        total,
        offset,
        limit
    };
  }

  async getCourseAssistants(courseId: string, query: QueryCoursesDto) { 
      const { offset = 0, limit = 8 } = query;
      const where = { courseId };

      const [assistants, total] = await Promise.all([
          this.prisma.assignedCourse.findMany({
              where,
              skip: offset,
              take: limit,
              include: {
                  user: { select: { id: true, fullName: true, phone: true, role: true } }
              },
              orderBy: { createdAt: 'desc' }
          }),
          this.prisma.assignedCourse.count({ where })
      ]);

      return { assistants, total, offset, limit };
  }

  async assignAssistant(dto: AssignAssistantDto) {
      
      const exists = await this.prisma.assignedCourse.findUnique({
          where: {
              userId_courseId: {
                  userId: dto.assistantId,
                  courseId: dto.courseId
              }
          }
      });

      if (exists) {
          throw new BadRequestException('Assistant already assigned to this course');
      }

      
      const user = await this.prisma.user.findUnique({ where: { id: dto.assistantId }});
      if (!user || user.role !== 'ASSISTANT') {
           
           if (!user) throw new NotFoundException('User not found');
      }

      return this.prisma.assignedCourse.create({
          data: {
              userId: dto.assistantId,
              courseId: dto.courseId
          }
      });
  }

  async unassignAssistant(dto: AssignAssistantDto) {
      const exists = await this.prisma.assignedCourse.findUnique({
          where: {
              userId_courseId: {
                  userId: dto.assistantId,
                  courseId: dto.courseId
              }
          }
      });

      if (!exists) {
          throw new NotFoundException('Assignment not found');
      }

      return this.prisma.assignedCourse.delete({
          where: {
              userId_courseId: {
                  userId: dto.assistantId,
                  courseId: dto.courseId
              }
          }
      });
  }

  async updateCourseMentor(dto: UpdateCourseMentorDto) {
      const course = await this.prisma.course.findUnique({ where: { id: dto.courseId } });
      if (!course) throw new NotFoundException('Course not found');

      const mentor = await this.prisma.user.findUnique({ where: { id: dto.userId } });
      if (!mentor || mentor.role !== 'MENTOR') {
          throw new BadRequestException('User is not a mentor');
      }

      return this.prisma.course.update({
          where: { id: dto.courseId },
          data: { mentorId: dto.userId }
      });
  }

  private deleteFile(filePath: string): void {
    try {
      const fullPath = path.join(process.cwd(), filePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    } catch (error) {
      console.error(`Failed to delete file ${filePath}:`, error);
    }
  }
}

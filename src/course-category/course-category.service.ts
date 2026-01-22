import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Injectable()
export class CourseCategoryService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCourseCategoryDto) {
    return this.prisma.courseCategory.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.courseCategory.findMany({
      include: {
        _count: {
          select: { courses: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const category = await this.prisma.courseCategory.findUnique({
      where: { id },
      include: {
        courses: {
          where: { published: true },
          select: {
            id: true,
            name: true,
            price: true,
            banner: true,
            level: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async update(id: number, dto: UpdateCategoryDto) {
    await this.findOne(id); 
    return this.prisma.courseCategory.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id); 
    await this.prisma.courseCategory.delete({
      where: { id },
    });
    return { message: 'Category deleted successfully' };
  }
}

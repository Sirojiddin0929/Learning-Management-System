import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User, UserRole } from '@prisma/client';
import * as argon2 from 'argon2';
import { CreateUserDto, UpdateMentorDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(phone: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { phone },
    });
  }

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  
  async getMentors() {
    return this.prisma.user.findMany({
      where: { role: UserRole.MENTOR },
      select: {
        id: true,
        fullName: true,
        image: true,
        createdAt: true,
        mentorProfile: true,
        _count: {
          select: { createdCourses: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  
  async getMentorById(id: number) {
    const mentor = await this.prisma.user.findFirst({
      where: { 
        id,
        role: UserRole.MENTOR,
      },
      select: {
        id: true,
        fullName: true,
        image: true,
        createdAt: true,
        mentorProfile: true,
        createdCourses: {
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

    if (!mentor) {
      throw new NotFoundException('Mentor not found');
    }

    return mentor;
  }

  
  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        phone: true,
        fullName: true,
        role: true,
        image: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  
  async getUserById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        phone: true,
        fullName: true,
        role: true,
        image: true,
        createdAt: true,
        mentorProfile: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }


  async getUserByPhone(phone: string) {
    const user = await this.prisma.user.findUnique({
      where: { phone },
      select: {
        id: true,
        phone: true,
        fullName: true,
        role: true,
        image: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  
  async createAdmin(dto: CreateUserDto) {
    const existing = await this.findOne(dto.phone);
    if (existing) {
      throw new BadRequestException('User with this phone already exists');
    }

    const hashedPassword = await argon2.hash(dto.password);
    return this.prisma.user.create({
      data: {
        ...dto,
        password: hashedPassword,
        role: UserRole.ADMIN,
      },
      select: {
        id: true,
        phone: true,
        fullName: true,
        role: true,
      },
    });
  }

  
  async createMentor(dto: CreateUserDto) {
    const existing = await this.findOne(dto.phone);
    if (existing) {
      throw new BadRequestException('User with this phone already exists');
    }

    const hashedPassword = await argon2.hash(dto.password);
    return this.prisma.user.create({
      data: {
        ...dto,
        password: hashedPassword,
        role: UserRole.MENTOR,
      },
      select: {
        id: true,
        phone: true,
        fullName: true,
        role: true,
      },
    });
  }

  
  async createAssistant(dto: CreateUserDto) {
    const existing = await this.findOne(dto.phone);
    if (existing) {
      throw new BadRequestException('User with this phone already exists');
    }

    const hashedPassword = await argon2.hash(dto.password);
    return this.prisma.user.create({
      data: {
        ...dto,
        password: hashedPassword,
        role: UserRole.ASSISTANT,
      },
      select: {
        id: true,
        phone: true,
        fullName: true,
        role: true,
      },
    });
  }

  async updateMentor(id: number, dto: UpdateMentorDto) {
    const user = await this.prisma.user.findFirst({
      where: { id, role: UserRole.MENTOR },
    });

    if (!user) {
      throw new NotFoundException('Mentor not found');
    }

    const updateData: any = {};
    if (dto.fullName) updateData.fullName = dto.fullName;
    if (dto.image) updateData.image = dto.image;
    if (dto.password) updateData.password = await argon2.hash(dto.password);

    return this.prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        phone: true,
        fullName: true,
        role: true,
        image: true,
      },
    });
  }


  async deleteUser(id: number) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.delete({
      where: { id },
    });

    return { message: 'User deleted successfully' };
  }
}

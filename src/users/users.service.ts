import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User, UserRole } from '@prisma/client';
import * as argon2 from 'argon2';
import { CreateUserDto, CreateMentorDto, CreateAssistantDto, UpdateMentorDto } from './dto/user.dto';
import { QueryCommonDto, QueryUserDto } from './dto/query-user.dto';

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

  
  async getMentors(query: QueryCommonDto) {
    const { offset, limit, search } = query;
    const where: Prisma.UserWhereInput = {
      role: UserRole.MENTOR,
      ...(search && {
        OR: [
          { fullName: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [total, users] = await this.prisma.$transaction([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        skip: offset,
        take: limit,
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
      }),
    ]);

    return { total, users };
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

  
  async getAllUsers(query: QueryUserDto) {
    const { offset, limit, search, role } = query;
    const where: Prisma.UserWhereInput = {
      ...(role && { role }),
      ...(search && {
        OR: [
          { fullName: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [total, users] = await this.prisma.$transaction([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        skip: offset,
        take: limit,
        select: {
          id: true,
          phone: true,
          fullName: true,
          role: true,
          image: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return { total, users };
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

  
  async createMentor(dto: CreateMentorDto, imageFile?: Express.Multer.File) {
    const existing = await this.findOne(dto.phone);
    if (existing) {
      throw new BadRequestException('User with this phone already exists');
    }

    const hashedPassword = await argon2.hash(dto.password);
    return this.prisma.user.create({
      data: {
        phone: dto.phone,
        password: hashedPassword,
        fullName: dto.fullName,
        image: imageFile ? `http://localhost:4000/uploads/users/${imageFile.filename}` : (dto.image || null),
        role: UserRole.MENTOR,
        mentorProfile: {
          create: {
            experience: dto.experience,
            job: dto.job,
            about: dto.about,
            telegram: dto.telegram,
            instagram: dto.instagram,
            linkedin: dto.linkedin,
            facebook: dto.facebook,
            github: dto.github,
            website: dto.website,
          },
        },
      },
      select: {
        id: true,
        phone: true,
        fullName: true,
        role: true,
        mentorProfile: true,
      },
    });
  }

  
  async createAssistant(dto: CreateAssistantDto, imageFile?: Express.Multer.File) {
    const existing = await this.findOne(dto.phone);
    if (existing) {
      throw new BadRequestException('User with this phone already exists');
    }

    const hashedPassword = await argon2.hash(dto.password);
    
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          phone: dto.phone,
          password: hashedPassword,
          fullName: dto.fullName,
          image: imageFile ? `http://localhost:4000/uploads/users/${imageFile.filename}` : (dto.image || null),
          role: UserRole.ASSISTANT,
        },
        select: {
          id: true,
          phone: true,
          fullName: true,
          role: true,
        },
      });

      if (dto.courseId) {
        await tx.assignedCourse.create({
          data: {
            userId: user.id,
            courseId: dto.courseId,
          },
        });
      }

      return user;
    });
  }

  async updateMentor(id: number, dto: UpdateMentorDto, imageFile?: Express.Multer.File) {
    const user = await this.prisma.user.findFirst({
      where: { id, role: UserRole.MENTOR },
    });

    if (!user) {
      throw new NotFoundException('Mentor not found');
    }

    const updateData: any = {};
    if (dto.fullName) updateData.fullName = dto.fullName;
    
    if (imageFile) {
        if (user.image && user.image.includes('http://localhost:4000/uploads/users/')) {
            
        }
        updateData.image = `http://localhost:4000/uploads/users/${imageFile.filename}`;
    } else if (dto.image) {
        updateData.image = dto.image;
    }

    if (dto.phone) updateData.phone = dto.phone;
    if (dto.password) updateData.password = await argon2.hash(dto.password);

    const profileData: any = {};
    if (dto.experience !== undefined) profileData.experience = dto.experience;
    if (dto.job !== undefined) profileData.job = dto.job;
    if (dto.about !== undefined) profileData.about = dto.about;
    if (dto.telegram !== undefined) profileData.telegram = dto.telegram;
    if (dto.instagram !== undefined) profileData.instagram = dto.instagram;
    if (dto.linkedin !== undefined) profileData.linkedin = dto.linkedin;
    if (dto.facebook !== undefined) profileData.facebook = dto.facebook;
    if (dto.github !== undefined) profileData.github = dto.github;
    if (dto.website !== undefined) profileData.website = dto.website;

    return this.prisma.user.update({
      where: { id },
      data: {
        ...updateData,
        mentorProfile: {
          upsert: {
            create: {
              experience: dto.experience || 0,
              ...profileData,
            },
            update: profileData,
          },
        },
      },
      select: {
        id: true,
        phone: true,
        fullName: true,
        role: true,
        image: true,
        mentorProfile: true,
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

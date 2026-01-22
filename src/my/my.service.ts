import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';
import { 
  UpdateProfileDto, 
  UpdateLastActivityDto, 
  UpdatePhoneDto, 
  UpdatePasswordDto, 
  UpdateMentorProfileDto 
} from './dto/my.dto';

@Injectable()
export class MyService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
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
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(userId: number, dto: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: {
        id: true,
        fullName: true,
        image: true,
      },
    });
  }

  async getLastActivity(userId: number) {
    return this.prisma.lastActivity.findUnique({
      where: { userId },
      include: {
        course: true,
        section: true,
        lesson: true,
      },
    });
  }

  async updateLastActivity(userId: number, dto: UpdateLastActivityDto) {
    return this.prisma.lastActivity.upsert({
      where: { userId },
      create: {
        userId,
        ...dto,
      },
      update: dto,
    });
  }

  async updatePhone(userId: number, dto: UpdatePhoneDto) {
    const otp = await this.prisma.otp.findFirst({
      where: {
        phone: dto.phone,
        code: dto.code,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otp) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    await this.prisma.otp.deleteMany({
      where: { phone: dto.phone },
    });

    return this.prisma.user.update({
      where: { id: userId },
      data: { phone: dto.phone },
      select: { id: true, phone: true },
    });
  }

  async updatePassword(userId: number, dto: UpdatePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const isMatch = await argon2.verify(user.password, dto.oldPassword);
    if (!isMatch) throw new UnauthorizedException('Current password incorrect');

    const hashedPassword = await argon2.hash(dto.newPassword);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Password updated successfully' };
  }

  async updateMentorProfile(userId: number, dto: UpdateMentorProfileDto) {
    return this.prisma.mentorProfile.upsert({
      where: { userId },
      create: {
        userId,
        ...dto,
        experience: dto.experience || 0,
      },
      update: dto,
    });
  }
}

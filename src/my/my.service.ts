import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';
import * as fs from 'fs';
import * as path from 'path';
import { 
  UpdateLastActivityDto, 
  UpdatePhoneDto, 
  UpdatePasswordDto 
} from './dto/my.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateMentorProfileDto } from './dto/update-mentor-profile.dto';

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
        mentorProfile: true, // Make sure this is selected
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(userId: number, dto: UpdateProfileDto, imageFile?: Express.Multer.File) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const data: any = { ...dto };
    delete data.image; // Remove dummy image field from dto if present from swagger binary field

    if (imageFile) {
      if (user.image) {
        this.deleteFile(user.image);
      }
      data.image = `/uploads/${imageFile.filename}`; // Assuming general uploads or specific config
    }

    return this.prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        fullName: true,
        image: true,
      },
    });
  }

  // ... (last activity and phone/password methods remain same)

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

import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async findAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        phone: true,
        fullName: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async updateRole(dto: UpdateRoleDto, currentUser: any) {
    
    if (dto.role === UserRole.SUPERADMIN) {
      throw new ForbiddenException(
        'Superadmin role cannot be assigned via API. It must be managed directly in the database to ensure uniqueness.',
      );
    }

    
    if (currentUser.role === UserRole.ADMIN) {
      
      if (dto.role === UserRole.ADMIN) {
        throw new ForbiddenException('Admins cannot assign Admin role.');
      }

      
      const targetUser = await this.prisma.user.findUnique({
        where: { id: dto.userId },
        select: { role: true },
      });

      if (targetUser && (targetUser.role === UserRole.ADMIN || targetUser.role === UserRole.SUPERADMIN)) {
        throw new ForbiddenException('Admins cannot modify other Admins or Superadmins.');
      }
    }

    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id: dto.userId },
      data: { role: dto.role },
      select: {
        id: true,
        phone: true,
        fullName: true,
        role: true,
      },
    });
  }
}

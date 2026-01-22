import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateContactDto) {
    return this.prisma.contact.create({
      data: {
        fullName: dto.fullName,
        phone: dto.phone,
        message: dto.message,
      },
    });
  }
}

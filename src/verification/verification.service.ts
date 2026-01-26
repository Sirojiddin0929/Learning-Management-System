import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SmsService } from '../sms/sms.service';

@Injectable()
export class VerificationService {
  constructor(
    private prisma: PrismaService,
    private smsService: SmsService,
  ) {}

  async send(phone: string) {
    const cleanPhone = phone.replace(/\D/g, '');
    const formattedPhone = cleanPhone.startsWith('998')
      ? `+${cleanPhone}`
      : `+998${cleanPhone}`;

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await this.prisma.otp.create({
      data: {
        phone: formattedPhone,
        code,
        expiresAt,
      },
    });

    try {
      await this.smsService.sendSms(
        formattedPhone,
        `Fixoo platformasidan ro'yxatdan o'tish uchun tasdiqlash kodi: ${code}. Kodni hech kimga bermang!`,
      );
    } catch (error) {
      console.error(`[SMS ERROR] Failed to send to ${formattedPhone}:`, error.message);
    }

    console.log('');
    console.log(`[VERIFICATION OTP] For ${formattedPhone}: ${code}`);
    console.log('');

    return { message: 'OTP sent successfully' };
  }

  async verify(phone: string, code: string) {
    const cleanPhone = phone.replace(/\D/g, '');
    const formattedPhone = cleanPhone.startsWith('998')
      ? `+${cleanPhone}`
      : `+998${cleanPhone}`;

    const otp = await this.prisma.otp.findFirst({
      where: {
        phone: formattedPhone,
        code,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otp) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    
    
    return { message: 'OTP verified successfully' };
  }
}

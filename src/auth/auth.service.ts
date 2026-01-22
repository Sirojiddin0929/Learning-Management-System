import {Injectable,BadRequestException,ForbiddenException,Inject,InternalServerErrorException,} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RegisterDto, RegisterOtpDto } from './dto/register.dto';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { RefreshToken } from '@prisma/client';
import { SmsService } from '../sms/sms.service';
import { ForgotPasswordDto, ResetPasswordDto} from './dto/password-reset.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private prisma: PrismaService,
    private smsService: SmsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async sendRegistrationOtp(dto: RegisterOtpDto) {
    const existingUser = await this.usersService.findOne(dto.phone);
    if (existingUser) {
      throw new BadRequestException('User with this phone already exists');
    }

    return this.sendOtp(dto.phone);
  }

  async register(registerDto: RegisterDto) {
    await this.verifyOtp(registerDto.phone, registerDto.code);

    const existingUser = await this.usersService.findOne(registerDto.phone);
    if (existingUser) {
      throw new BadRequestException('User with this phone already exists');
    }

    const hashedPassword = await argon2.hash(registerDto.password);

    const user = await this.usersService.create({
      phone: registerDto.phone,
      password: hashedPassword,
      fullName: registerDto.fullName,
      role: 'STUDENT',
    });

    await this.clearOtp(registerDto.phone);

    const tokens = await this.getTokens(user.id, user.phone, user.role);
    await this.updateRefreshToken(user.id, tokens.refresh_token);
    return tokens;
  }

  async validateUser(phone: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(phone);
    if (user && (await argon2.verify(user.password, pass))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const tokens = await this.getTokens(user.id, user.phone, user.role);
    await this.updateRefreshToken(user.id, tokens.refresh_token);
    return tokens;
  }

  async logout(userId: number) {
    await this.prisma.refreshToken.deleteMany({
      where: { userId },
    });
    return true;
  }

  async refreshTokens(userId: number, rt: string) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new ForbiddenException('Access Denied');

    const tokens = await this.prisma.refreshToken.findMany({
      where: { userId },
    });

    let matchedToken: RefreshToken | null = null;
    for (const tokenRecord of tokens) {
      if (await argon2.verify(tokenRecord.token, rt)) {
        matchedToken = tokenRecord;
        break;
      }
    }

    if (!matchedToken) throw new ForbiddenException('Access Denied');

    await this.prisma.refreshToken.delete({ where: { id: matchedToken.id } });

    const newTokens = await this.getTokens(user.id, user.phone, user.role);
    await this.updateRefreshToken(user.id, newTokens.refresh_token);

    return newTokens;
  }

  async updateRefreshToken(userId: number, rt: string) {
    const hash = await argon2.hash(rt);
    await this.prisma.refreshToken.create({
      data: {
        userId,
        token: hash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
  }

  async getTokens(userId: number, phone: string, role: string) {
    const payload = { sub: userId, phone, role };
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET') || this.configService.get<string>('JWT_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async sendResetPasswordOtp(dto: ForgotPasswordDto) {
    const user = await this.usersService.findOne(dto.phone);
    if (!user) {
      throw new BadRequestException('User with this phone number not found');
    }

    return this.sendOtp(dto.phone);
  }

  async resetPassword(dto: ResetPasswordDto) {
    await this.verifyOtp(dto.phone, dto.code);

    const user = await this.usersService.findOne(dto.phone);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const hashedPassword = await argon2.hash(dto.newPassword);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    await this.clearOtp(dto.phone);

    return { message: 'Password reset successfully' };
  }

  

  private async sendOtp(phone: string) {
    const cleanPhone = phone.replace(/\D/g, '');
    const formattedPhone = cleanPhone.startsWith('998')
      ? `+${cleanPhone}`
      : `+998${cleanPhone}`;

    const isThrottled = await this.cacheManager.get(`limit_${formattedPhone}`);
    if (isThrottled) throw new BadRequestException('1 daqiqa kuting');

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const cacheKey = `otp_${formattedPhone}`;

    try {
      const cacheData = JSON.stringify({
        code: otpCode
      });
      
      await this.cacheManager.set(cacheKey, cacheData, 120000); 
      
      await this.cacheManager.set(`limit_${formattedPhone}`, true, 60000);
      
      await this.smsService.sendOtp(formattedPhone, otpCode);

      
      // console.log('');
      // console.log(`[OTP] For ${formattedPhone}: ${otpCode}`);
      // console.log('');

      return {
        success: true,
        message: 'Tasdiqlash kodi telefoningizga yuborildi.',
        expiresIn: '2 minutes',
      };
    } catch (error: any) {
      console.error(
        'OTP yuborishda xatolik:',
        error.response?.data || error.message,
      );
      throw new InternalServerErrorException(
        'SMS yuborish tizimida xatolik yuz berdi',
      );
    }
  }

  private async verifyOtp(phone: string, userCode: string) {
    const cleanPhone = phone.replace(/\D/g, '');
    const formattedPhone = cleanPhone.startsWith('998')
      ? `+${cleanPhone}`
      : `+998${cleanPhone}`;

    const cacheKey = `otp_${formattedPhone}`;

    const rawData = await this.cacheManager.get<string>(cacheKey);
    
    if (!rawData) {
      throw new BadRequestException("Kod topilmadi yoki muddati o'tgan");
    }

    let parsedData;
    try {
      parsedData = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
    } catch (e) {
      parsedData = rawData;
    }
    if (!parsedData || !parsedData.code) {
      throw new BadRequestException("Kod muddati o'tgan yoki xato raqam");
    }

    if (parsedData.code !== userCode) {
      throw new BadRequestException('Tasdiqlash kodi xato');
    }

    return true;
  }

  private async clearOtp(phone: string) {
    const cleanPhone = phone.replace(/\D/g, '');
    const formattedPhone = cleanPhone.startsWith('998')
      ? `+${cleanPhone}`
      : `+998${cleanPhone}`;
      
    await this.cacheManager.del(`otp_${formattedPhone}`);
    await this.cacheManager.del(`limit_${formattedPhone}`);
  }
}

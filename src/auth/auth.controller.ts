import {Controller,Post,Body,HttpCode,HttpStatus,UnauthorizedException,UseGuards,Request,} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, RegisterOtpDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RtGuard } from './rt-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ForgotPasswordDto, VerifyOtpDto, ResetPasswordDto } from './dto/password-reset.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register/otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send OTP for registration' })
  sendRegisterOtp(@Body() dto: RegisterOtpDto) {
    return this.authService.sendRegistrationOtp(dto);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user (Requires OTP)' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.phone,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(RtGuard)
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  refresh(@Request() req) {
    const user = req.user;
    return this.authService.refreshTokens(user.sub, user.refreshToken);
  }

  @Post('reset-password/otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send OTP for password reset' })
  sendResetOtp(@Body() dto: ForgotPasswordDto) {
    return this.authService.sendResetPasswordOtp(dto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password (Requires OTP)' })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout user' })
  logout(@Request() req) {
    return this.authService.logout(req.user.id);
  }
}

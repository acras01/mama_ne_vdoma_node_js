import { ParentService } from 'src/parent/parent.service';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { ConfirmEmailDto } from './dto/confirm-email.dto';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ResendCodeDto } from './dto/resend-code.dto';
import { RequestChangeEmail } from './dto/request-change-email.dto';
import { CodeDto } from './dto/change-email.dto';
import { CookieAuthenticationGuard } from './guards/coockie.guard';
import RequestWithSession from './interfaces/req-with-session.interface';
import { LogInWithCredentialsGuard } from './guards/login-with-credentials.guard';
import { GoogleCodeAuthGuard } from './guards/google-auth.guard';
import { ResetPasswordDto } from '../mail/dto/reset-password.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly parentService: ParentService,
  ) {}

  @Post('login')
  @HttpCode(200)
  @ApiOkResponse()
  @UseGuards(LogInWithCredentialsGuard)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async login(@Body() loginDto: LoginDto) {}

  @Post('google/:code')
  @HttpCode(200)
  @ApiOkResponse()
  @UseGuards(GoogleCodeAuthGuard)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async googleAuth(@Param('code') code: string) {}

  @Post('register')
  @ApiCreatedResponse()
  async register(@Body() registerDto: RegisterDto) {
    await this.authService.register(registerDto);
  }

  @Post('resend-code')
  async resendCode(@Body() resendCodeDto: ResendCodeDto) {
    await this.parentService.sendConfirmationEmail(resendCodeDto);
  }

  @Post('confirm')
  @HttpCode(200)
  @ApiOkResponse()
  async confirmAccount(@Body() confirmEmailDto: ConfirmEmailDto) {
    await this.authService.confirmEmail(confirmEmailDto);
    return;
  }

  @Get('me')
  @ApiCookieAuth()
  @UseGuards(CookieAuthenticationGuard)
  @ApiOkResponse()
  async getMe(@Req() request: RequestWithSession) {
    return await this.authService.getMe(request.user.email);
  }

  @Post('forget-password')
  async forgetPassword(
    @Body() requestPasswordResetDto: RequestPasswordResetDto,
  ) {
    await this.authService.sendResetPasswordCode(requestPasswordResetDto);
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.authService.resetPassword(resetPasswordDto);
  }
  @ApiCookieAuth()
  @UseGuards(CookieAuthenticationGuard)
  @Post('change-email-request')
  async changeEmailRequest(
    @Body() requestChangeEmail: RequestChangeEmail,
    @Req() request: RequestWithSession,
  ) {
    return await this.authService.sendChangeEmailCode(
      request.user.id,
      requestChangeEmail,
    );
  }
  @ApiCookieAuth()
  @UseGuards(CookieAuthenticationGuard)
  @Post('change-email')
  async changeEmail(
    @Body() codeDto: CodeDto,
    @Req() request: RequestWithSession,
  ) {
    return await this.authService.changeEmail(request.user.email, codeDto.code);
  }
  @UseGuards(CookieAuthenticationGuard)
  @Post('logout')
  async logOut(@Req() request: RequestWithSession) {
    console.log(request.user);
    request.logOut(() => true);
    request.session.cookie.maxAge = 0;
  }
}

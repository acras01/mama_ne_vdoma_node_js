import { ParentService } from 'src/parent/parent.service';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { ConfirmEmailDto } from './dto/confirm-email.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { UserData } from './decorators/get-user-from-jwt.decorator';
import { IJwtData } from 'src/shared/interfaces/jwt-data.interface';
import { AuthGuard } from './guards/auth.guards';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ResetPasswordDto } from 'src/mail/dto/reset-password.dto';
import { ResendCodeDto } from './dto/resend-code.dto';
import { RequestChangeEmail } from './dto/request-change-email.dto';
import { CodeDto } from './dto/change-email.dto';

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
  async login(@Body() loginDto: LoginDto): Promise<{ jwt: string }> {
    const jwt = await this.authService.login(loginDto);
    return { jwt };
  }

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
    const jwt = await this.authService.confirmEmail(confirmEmailDto);
    return { jwt };
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOkResponse()
  async getMe(@UserData() jwtData: IJwtData) {
    return await this.authService.getMe(jwtData.email);
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
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('change-email-request')
  async changeEmailRequest(
    @Body() requestChangeEmail: RequestChangeEmail,
    @UserData() jwtData: IJwtData,
  ) {
    return await this.authService.sendChangeEmailCode(
      jwtData.id,
      requestChangeEmail,
    );
  }
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('change-email')
  async changeEmail(@Body() codeDto: CodeDto, @UserData() jwtData: IJwtData) {
    return await this.authService.changeEmail(jwtData.email, codeDto.code);
  }
}

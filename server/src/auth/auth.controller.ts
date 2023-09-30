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

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
}

import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { ParentService } from 'src/parent/parent.service';
import { ConfirmEmailDto } from './dto/confirm-email.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ResetPasswordDto } from '../mail/dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly parentService: ParentService,
  ) {}

  async login(loginDto: LoginDto) {
    const parent = await this.parentService.findFullInfoByEmail(loginDto.email);
    const isPasswordCorrect = await bcrypt.compare(
      loginDto.password,
      parent.password,
    );
    if (!isPasswordCorrect)
      throw new UnauthorizedException('Wrong credentials');
    if (!parent.isConfirmed)
      throw new BadRequestException('Not confrimed account');
    const jwt = await this.jwtService.sign({
      id: parent._id,
      email: parent.email,
    });
    return jwt;
  }

  async register(registerDto: RegisterDto) {
    try {
      const user = await this.parentService.findFullInfoByEmail(
        registerDto.email,
      );
      if (!user.isConfirmed) {
        await user.deleteOne();
      } else {
        throw new Error();
      }
    } catch (error) {
      throw new BadRequestException('Email already taken');
    }
    return await this.parentService.createParent(registerDto);
  }

  async confirmEmail(confirmEmailDto: ConfirmEmailDto) {
    await this.parentService.confirmAccountByCode(confirmEmailDto);
    const parent = await this.parentService.findFullInfoByEmail(
      confirmEmailDto.email,
    );
    const jwt = await this.jwtService.sign({
      id: parent._id,
      email: parent.email,
    });
    return jwt;
  }

  async getMe(email: string) {
    return await this.parentService.findByEmail(email);
  }

  async sendResetPasswordCode(
    requestPasswordResetDto: RequestPasswordResetDto,
  ) {
    await this.parentService.sendPasswordCode(requestPasswordResetDto.email);
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    await this.parentService.resetPassword(resetPasswordDto);
    return true;
  }
}

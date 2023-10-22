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
import { google } from 'googleapis';
import { IEnv } from 'src/configs/env.config';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly parentService: ParentService,
    private readonly configService: ConfigService<IEnv>,
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
      if (!user.isConfirmed) await user.deleteOne();
    } catch (error) {}
    if (!(await this.parentService.isEmailAvaliable(registerDto.email)))
      throw new BadRequestException('Email already taken');
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

  async sendChangeEmailCode(
    parentId: string,
    requestPasswordResetDto: RequestPasswordResetDto,
  ) {
    await this.parentService.sendChangeEmailCode(
      parentId,
      requestPasswordResetDto.email,
    );
  }

  async changeEmail(email: string, code: string) {
    await this.parentService.changeEmail(email, code);
    return true;
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    await this.parentService.resetPassword(resetPasswordDto);
    return true;
  }

  async googleInfo(code: string) {
    const Oauth2Client = new google.auth.OAuth2(
      this.configService.get('GOOGLE_CLIENT_ID'),
      this.configService.get('GOOGLE_CLIENT_SECRET'),
    );

    const codes = await Oauth2Client.getToken(code);
    console.log(codes);
    Oauth2Client.setCredentials({ access_token: codes.tokens.access_token });
    const ouath2 = google.oauth2({ auth: Oauth2Client, version: 'v2' });
    const { data } = await ouath2.userinfo.get();
    console.log(data);
    return data
  }
  async googleGetUrl() {
    const Oauth2Client = new google.auth.OAuth2(
      this.configService.get('GOOGLE_CLIENT_ID'),
      this.configService.get('GOOGLE_CLIENT_SECRET'),
    );
    const url = Oauth2Client.generateAuthUrl({
      access_type: 'online',
      scope: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
      ],
    });
    console.log(url);
    return url
  }
}

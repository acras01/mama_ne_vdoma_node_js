import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { ParentService } from 'src/Parent/parent.service';
import { ConfirmEmailDto } from './dto/confirm-email.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

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
    const jwt = await this.jwtService.sign({
      id: parent._id,
      email: parent.email,
    });
    return jwt;
  }

  async register(registerDto: RegisterDto) {
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
}

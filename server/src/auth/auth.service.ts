import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { ParentService } from 'src/Parent/parent.service';
import { ConfirmEmailDto } from './dto/confirm-email.dto';

@Injectable()
export class AuthService {
  constructor(
    // private readonly jwtService: JwtService,
    private readonly parentService: ParentService,
  ) {}

  async login() {
    return '';
  }

  async register(registerDto: RegisterDto) {
    return await this.parentService.createParent(registerDto);
  }

  async confirmEmail(confirmEmailDto: ConfirmEmailDto) {
    return await this.parentService.confirmAccountByCode(confirmEmailDto);
  }
}

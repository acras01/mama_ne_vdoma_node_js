import { ParentModule } from './../parent/parent.module';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { LocalStrategy } from './strategy/local.strategy';
import { LocalSerializer } from './serializers/local.seriallizer';
import { GoogleStrategy } from './strategy/google.strategy';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthGuard,
    LocalStrategy,
    LocalSerializer,
    GoogleStrategy,
  ],
  imports: [ParentModule],
})
export class AuthModule {}

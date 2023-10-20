import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ParentModule } from 'src/parent/parent.module';
import { AuthGuard } from './guards/auth.guard';
import { LocalStrategy } from './strategy/local.strategy';
import { LocalSerializer } from './serializers/local.seriallizer';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, LocalStrategy, LocalSerializer],
  imports: [ParentModule],
})
export class AuthModule {}

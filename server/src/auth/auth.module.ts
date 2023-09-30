import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ParentModule } from 'src/Parent/parent.module';
import { AuthGuard } from './guards/auth.guards';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  imports: [ParentModule],
})
export class AuthModule {}

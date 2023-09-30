import { ConfigService } from '@nestjs/config';
import { IEnv } from './env.config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const getJwtConfig = async (
  configService: ConfigService<IEnv>,
): Promise<JwtModuleOptions> => {
  const secret = configService.get('JWT_SECRET');
  return { global: true, secret, signOptions: { expiresIn: '30d' } };
};

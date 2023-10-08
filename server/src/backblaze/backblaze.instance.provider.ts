import { ConfigService } from '@nestjs/config';
import BackBlazeB2 from 'backblaze-b2';

export const backBlazeFactory = async (configService: ConfigService) => {
  const client = new BackBlazeB2({
    applicationKeyId: configService.get('BB2_SECRET_KEY_NAME'),
    applicationKey: configService.get('BB2_SECRET_KEY'),
  });
  await client.authorize();
  return client;
};

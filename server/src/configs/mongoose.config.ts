import { TypegooseModuleOptions } from '@m8a/nestjs-typegoose';
import { ConfigService } from '@nestjs/config';
import { IEnv } from './env.config';

export const getMongoConfig = async (
  configService: ConfigService<IEnv>,
): Promise<TypegooseModuleOptions> => {
  const mongoURL = configService.get('MONGO_URL');

  return {
    uri: mongoURL,
    ...defaultMongoOptions,
  };
};

const defaultMongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

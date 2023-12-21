import { Module } from '@nestjs/common';
import { redisClientFactory } from './redis-karma.factory';

@Module({
  providers: [redisClientFactory],
})
export class KarmaModule {}

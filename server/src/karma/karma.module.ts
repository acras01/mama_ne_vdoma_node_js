import { Module } from '@nestjs/common';
import { redisClientFactory } from './redis-karma.factory';
import { KarmaService } from './karma.service';
import { KarmaRepository } from './karma.repository';
import { Karma } from './karma.model';
import { TypegooseModule } from '@m8a/nestjs-typegoose';

@Module({
  imports: [TypegooseModule.forFeature([Karma])],
  providers: [redisClientFactory, KarmaService, KarmaRepository],
  exports: [KarmaService],
})
export class KarmaModule {}

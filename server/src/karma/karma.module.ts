import { Module, forwardRef } from '@nestjs/common';
import { redisClientFactory } from './redis-karma.factory';
import { KarmaService } from './karma.service';
import { KarmaRepository } from './karma.repository';
import { Karma } from './karma.model';
import { TypegooseModule } from '@m8a/nestjs-typegoose';
import { KarmaController } from './karma.controller';
import { GroupModule } from '../group/group.module';
import { ParentModule } from '../parent/parent.module';

@Module({
  imports: [
    TypegooseModule.forFeature([Karma]),
    forwardRef(() => GroupModule),
    forwardRef(() => ParentModule),
  ],
  controllers: [KarmaController],
  providers: [redisClientFactory, KarmaService, KarmaRepository],
  exports: [KarmaService],
})
export class KarmaModule {}

import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MulterModule } from '@nestjs/platform-express'
import { memoryStorage } from 'multer'
import { BackBlazeController } from './backblaze.controller'
import { backBlazeFactory } from './backblaze.instance.provider'
import { BackblazeService } from './backblaze.service'
import { FileModel } from './models/file.model'
import { TypegooseModule } from '@m8a/nestjs-typegoose'

@Module({
  controllers: [BackBlazeController],
  imports: [
    MulterModule.register({ storage: memoryStorage() }),
    TypegooseModule.forFeature([FileModel]),
  ],
  providers: [
    {
      provide: 'bb2Client',
      useFactory: backBlazeFactory,
      inject: [ConfigService],
    },
    BackblazeService,
  ],
  exports: [BackblazeService],
})
export class BackblazeModule {}

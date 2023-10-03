import { Module } from '@nestjs/common';
import { ParentService } from './parent.service';
import { TypegooseModule } from '@m8a/nestjs-typegoose';
import { Parent } from './models/parent.model';
import { MailModule } from 'src/mail/mail.module';
import { ParentController } from './parent.controller';
import { Location } from '../shared/models/location.model';

@Module({
  controllers: [ParentController],
  imports: [TypegooseModule.forFeature([Parent]), MailModule],
  providers: [ParentService],
  exports: [ParentService],
})
export class ParentModule {}

import { Module, forwardRef } from '@nestjs/common';
import { ParentService } from './parent.service';
import { TypegooseModule } from '@m8a/nestjs-typegoose';
import { Parent } from './models/parent.model';
import { MailModule } from 'src/mail/mail.module';
import { ParentController } from './parent.controller';
import { ChildModule } from 'src/child/child.module';
import { GroupModule } from '../group/group.module';

@Module({
  controllers: [ParentController],
  imports: [
    TypegooseModule.forFeature([Parent]),
    forwardRef(() => MailModule),
    forwardRef(() => ChildModule),
    forwardRef(() => GroupModule),
  ],
  providers: [ParentService],
  exports: [ParentService],
})
export class ParentModule {}

import { Module, forwardRef } from '@nestjs/common';
import { ChildModule } from '../child/child.module';
import { ParentModule } from '../parent/parent.module';
import { MailModule } from '../mail/mail.module';
import { TypegooseModule } from '@m8a/nestjs-typegoose';
import { Group } from './models/group.model';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';

@Module({
  imports: [
    ChildModule,
    forwardRef(() => ParentModule),
    forwardRef(() => MailModule),
    TypegooseModule.forFeature([Group]),
  ],
  controllers: [GroupController],
  providers: [GroupService],
  exports: [GroupService],
})
export class GroupModule {}

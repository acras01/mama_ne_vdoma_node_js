import { NotificationsModule } from './../notifications/notifications.module';
import { Module, forwardRef } from '@nestjs/common';
import { ChildModule } from '../child/child.module';
import { ParentModule } from '../parent/parent.module';
import { MailModule } from '../mail/mail.module';
import { TypegooseModule } from '@m8a/nestjs-typegoose';
import { Group } from './models/group.model';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { BackblazeModule } from 'src/backblaze/backblaze.module';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { KarmaModule } from '../karma/karma.module';

@Module({
  imports: [
    ChildModule,
    forwardRef(() => ParentModule),
    forwardRef(() => MailModule),
    forwardRef(() => BackblazeModule),
    TypegooseModule.forFeature([Group]),
    FirebaseModule,
    NotificationsModule,
    forwardRef(() => KarmaModule),
  ],
  controllers: [GroupController],
  providers: [GroupService],
  exports: [GroupService],
})
export class GroupModule {}

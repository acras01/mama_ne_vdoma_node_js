import { ParentModule } from './../parent/parent.module';
import { FirebaseModule } from './../firebase/firebase.module';
import { MailModule } from './../mail/mail.module';
import { Module, forwardRef } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';

@Module({
  imports: [
    forwardRef(() => MailModule),
    FirebaseModule,
    forwardRef(() => ParentModule),
  ],
  providers: [NotificationsService],
  exports: [NotificationsService],
  controllers: [NotificationsController],
})
export class NotificationsModule {}

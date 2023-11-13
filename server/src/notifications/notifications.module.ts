import { FirebaseModule } from './../firebase/firebase.module';
import { MailModule } from './../mail/mail.module';
import { Module, forwardRef } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Module({
  imports: [forwardRef(() => MailModule), FirebaseModule],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}

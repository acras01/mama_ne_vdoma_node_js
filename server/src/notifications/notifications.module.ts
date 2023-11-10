import { FirebaseModule } from './../firebase/firebase.module';
import { MailModule } from './../mail/mail.module';
import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Module({
  imports: [MailModule, FirebaseModule],
  providers: [NotificationsService],
})
export class NotificationsModule {}

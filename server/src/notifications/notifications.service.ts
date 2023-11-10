import { FirebaseService } from './../firebase/firebase.service';
import { MailService } from './../mail/mail.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly mailService: MailService,
    private readonly firebaseService: FirebaseService,
  ) {}
}

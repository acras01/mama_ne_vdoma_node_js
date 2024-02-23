import { Inject, Injectable } from '@nestjs/common';
import { app } from 'firebase-admin';
import { Message } from 'firebase-admin/lib/messaging/messaging-api';
import { FirebaseMessageEnumType } from './interfaces/messages.interface';

@Injectable({})
export class FirebaseService {
  constructor(@Inject('firebase') private firebaseInstance: app.App) {}
  async sendPushNotific(
    deviceId: string,
    message: FirebaseMessageEnumType,
    additionalData?,
  ) {
    if (!deviceId) return;
    try {
      const newMessage: Message = {
        token: deviceId,
        data: { type: message, ...additionalData },
      };
      return await this.firebaseInstance.messaging().send(newMessage);
    } catch (e) {
      console.log(e);
    }
  }
}

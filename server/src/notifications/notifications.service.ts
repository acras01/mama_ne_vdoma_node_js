import { FirebaseMessageEnum } from './../firebase/interfaces/messages.interface';
import { FirebaseService } from './../firebase/firebase.service';
import { MailService } from './../mail/mail.service';
import { Inject, Injectable, forwardRef } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  constructor(
    @Inject(forwardRef(() => MailService))
    private readonly mailService: MailService,
    private readonly firebaseService: FirebaseService,
  ) {}

  sendGroupCreatedEmailNotification(email: string, groupId: string) {
    this.mailService.groupCreatedNotification(email, groupId);
  }

  sendAdminTransferEmailNotification(email: string, groupId: string) {
    this.mailService.adminTransferNotification(email, groupId);
  }

  async sendTransferPushNotification(
    deviceId: string,
    payload: { groupId: string },
  ) {
    await this.firebaseService.sendPushNotific(
      deviceId,
      FirebaseMessageEnum.USER_GROUP_TRANSFERED_ADMIN,
      payload,
    );
  }

  sendGroupJoiningRequestEmailNotification(
    groupAdminEmail: string,
    parentId: string,
    childId: string,
  ) {
    this.mailService.sendGroupJoiningRequest(
      groupAdminEmail,
      parentId,
      childId,
    );
  }

  async sendGroupRequestPushNotification(
    deviceId: string,
    payload: { groupId: string; userId: string },
  ) {
    await this.firebaseService.sendPushNotific(
      deviceId,
      FirebaseMessageEnum.USER_GROUP_REQUEST,
      payload,
    );
  }

  sendGroupInvitationAcceptEmailNotification(email: string, groupId: string) {
    this.mailService.sendGroupInvitationAccept(email, groupId);
  }

  async sendGroupInvitationAcceptPushNotification(
    deviceId: string,
    payload: { groupId: string },
  ) {
    await this.firebaseService.sendPushNotific(
      deviceId,
      FirebaseMessageEnum.USER_GROUP_ACCEPTED,
      payload,
    );
  }

  sendGroupInvitationRejectEmailNotification(email: string, groupId: string) {
    this.mailService.sendGroupInvitationReject(email, groupId);
  }

  async sendGroupInvitationRejectPushNotification(
    deviceId: string,
    payload: { groupId: string },
  ) {
    await this.firebaseService.sendPushNotific(
      deviceId,
      FirebaseMessageEnum.USER_GROUP_REJECTED,
      payload,
    );
  }

  sendKickedFromGroupEmailNotification(email: string, groupId: string) {
    this.mailService.kickedFromGroupNotification(email, groupId);
  }

  async sendUserKickPushNotification(
    deviceId: string,
    payload: { groupId: string },
  ) {
    await this.firebaseService.sendPushNotific(
      deviceId,
      FirebaseMessageEnum.USER_GROUP_KICKED,
      payload,
    );
  }
}

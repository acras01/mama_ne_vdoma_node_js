import { FirebaseMessageEnum } from './../firebase/interfaces/messages.interface';
import { FirebaseService } from './../firebase/firebase.service';
import { MailService } from './../mail/mail.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly mailService: MailService,
    private readonly firebaseService: FirebaseService,
  ) {}

  sendGroupCreatedEmailNotification(email: string, groupId: string) {
    this.mailService.groupCreatedNotification(email, groupId);
  }

  sendAdminTransferEmailNotification(email: string, groupId: string) {
    this.mailService.adminTransferNotification(email, groupId);
  }

  sendTransferPushNotification(deviceId: string, payload: { groupId: string }) {
    this.firebaseService.sendPushNotific(
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

  sendGroupRequestPushNotification(
    deviceId: string,
    payload: { groupId: string; userId: string },
  ) {
    this.firebaseService.sendPushNotific(
      deviceId,
      FirebaseMessageEnum.USER_GROUP_REQUEST,
      payload,
    );
  }

  sendGroupInvitationAcceptEmailNotification(email: string, groupId: string) {
    this.mailService.sendGroupInvitationAccept(email, groupId);
  }

  sendGroupInvitationAcceptPushNotification(
    deviceId: string,
    payload: { groupId: string },
  ) {
    this.firebaseService.sendPushNotific(
      deviceId,
      FirebaseMessageEnum.USER_GROUP_ACCEPTED,
      payload,
    );
  }

  sendGroupInvitationRejectEmailNotification(email: string, groupId: string) {
    this.mailService.sendGroupInvitationReject(email, groupId);
  }

  sendGroupInvitationRejectPushNotification(
    deviceId: string,
    payload: { groupId: string },
  ) {
    this.firebaseService.sendPushNotific(
      deviceId,
      FirebaseMessageEnum.USER_GROUP_REJECTED,
      payload,
    );
  }

  sendKickedFromGroupEmailNotification(email: string, groupId: string) {
    this.mailService.kickedFromGroupNotification(email, groupId);
  }

  sendUserKickPushNotification(deviceId: string, payload: { groupId: string }) {
    this.firebaseService.sendPushNotific(
      deviceId,
      FirebaseMessageEnum.USER_GROUP_KICKED,
      payload,
    );
  }
}

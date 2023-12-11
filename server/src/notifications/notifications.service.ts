import { ParentService } from './../parent/parent.service';
import {
  FirebaseMessageEnum,
  FirebaseMessageEnumType,
} from './../firebase/interfaces/messages.interface';
import { FirebaseService } from './../firebase/firebase.service';
import { MailService } from './../mail/mail.service';
import { Inject, Injectable, forwardRef } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  constructor(
    @Inject(forwardRef(() => MailService))
    private readonly mailService: MailService,
    private readonly firebaseService: FirebaseService,
    @Inject(forwardRef(() => ParentService))
    private readonly parentService: ParentService,
  ) {}

  sendGroupCreatedEmailNotification(param) {
    this.mailService.groupCreatedNotification(param.email, param.groupId);
  }

  async sendTransferNotification(param) {
    await this.sendAdminTransferEmailNotification({
      email: param.newAdmin.email,
      groupId: param.group.id,
    });
    if (param.newAdmin.deviceId)
      this.sendTransferPushNotification({
        deviceId: param.newAdmin.deviceId,
        payload: param.groupId,
      });
    await this.createNotification(
      param.newAdmin,
      FirebaseMessageEnum.USER_GROUP_TRANSFERED_ADMIN,
    );
  }

  private sendAdminTransferEmailNotification(payloadParams) {
    this.mailService.adminTransferNotification(
      payloadParams.email,
      payloadParams.groupId,
    );
  }

  private async sendTransferPushNotification(payloadParams) {
    await this.firebaseService.sendPushNotific(
      payloadParams.deviceId,
      FirebaseMessageEnum.USER_GROUP_TRANSFERED_ADMIN,
      payloadParams.payload,
    );
  }

  async groupJoiningRequestNotification(param) {
    this.sendGroupJoiningRequestEmailNotification({
      groupAdminEmail: param.groupAdmin.email,
      parentId: param.payload.userId,
      childId: param.childId,
    });
    if (param.groupAdmin.deviceId)
      this.sendGroupRequestPushNotification({
        deviceId: param.groupAdmin.deviceId,
        payload: { groupId: param.payload.groupId, userId: param.parentId },
      });
    await this.createNotification(
      param.payload.userId,
      FirebaseMessageEnum.USER_GROUP_REQUEST,
    );
  }

  private sendGroupJoiningRequestEmailNotification(payloadParams) {
    this.mailService.sendGroupJoiningRequest(
      payloadParams.groupAdminEmail,
      payloadParams.parentId,
      payloadParams.childId,
    );
  }

  private async sendGroupRequestPushNotification(payloadParams) {
    await this.firebaseService.sendPushNotific(
      payloadParams.deviceId,
      FirebaseMessageEnum.USER_GROUP_REQUEST,
      payloadParams.payload,
    );
  }

  async groupInvitationAcceptNotification(param) {
    this.sendGroupInvitationAcceptEmailNotification({
      email: param.parent.email,
      groupId: param.group.id,
    });
    this.sendGroupInvitationAcceptPushNotification({
      deviceId: param.parent.deviceId,
      payload: param.groupId,
    });
    await this.createNotification(
      param.parent,
      FirebaseMessageEnum.USER_GROUP_ACCEPTED,
    );
  }

  private sendGroupInvitationAcceptEmailNotification(payloadParams) {
    this.mailService.sendGroupInvitationAccept(
      payloadParams.email,
      payloadParams.groupId,
    );
  }

  private async sendGroupInvitationAcceptPushNotification(payloadParams) {
    await this.firebaseService.sendPushNotific(
      payloadParams.deviceId,
      FirebaseMessageEnum.USER_GROUP_ACCEPTED,
      payloadParams.payload,
    );
  }

  async groupInvitationRejectNotification(param) {
    this.sendGroupInvitationRejectEmailNotification({
      email: param.parent.email,
      groupId: param.group.id,
    });
    this.sendGroupInvitationRejectPushNotification({
      deviceId: param.parent.deviceId,
      payload: param.groupId,
    });
    await this.createNotification(
      param.parent,
      FirebaseMessageEnum.USER_GROUP_REJECTED,
    );
  }

  private sendGroupInvitationRejectEmailNotification(payloadParams) {
    this.mailService.sendGroupInvitationReject(
      payloadParams.email,
      payloadParams.groupId,
    );
  }

  private async sendGroupInvitationRejectPushNotification(payloadParams) {
    await this.firebaseService.sendPushNotific(
      payloadParams.deviceId,
      FirebaseMessageEnum.USER_GROUP_REJECTED,
      payloadParams.payload,
    );
  }

  async userKickNotification(param) {
    this.sendUserKickPushNotification({
      deviceId: param.parent.deviceId,
      payload: param.groupId,
    });
    this.sendKickedFromGroupEmailNotification({
      email: param.parent.email,
      groupId: param.group.id,
    });
    await this.createNotification(
      param.parent,
      FirebaseMessageEnum.USER_GROUP_KICKED,
    );
  }

  private sendKickedFromGroupEmailNotification(payloadParams) {
    this.mailService.kickedFromGroupNotification(
      payloadParams.email,
      payloadParams.groupId,
    );
  }

  private async sendUserKickPushNotification(payloadParams) {
    await this.firebaseService.sendPushNotific(
      payloadParams.deviceId,
      FirebaseMessageEnum.USER_GROUP_KICKED,
      payloadParams.payload,
    );
  }

  async createNotification(
    parentId: string,
    notificationType: FirebaseMessageEnumType,
  ) {
    this.parentService.addNotification(parentId, notificationType);
  }

  async deleteNotifications(parentId: string) {
    this.parentService.removeNotifications(parentId);
  }
}

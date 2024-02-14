import { ParentService } from './../parent/parent.service';
import {
  FirebaseMessageEnum,
  FirebaseMessageEnumType,
} from './../firebase/interfaces/messages.interface';
import { FirebaseService } from './../firebase/firebase.service';
import { MailService } from './../mail/mail.service';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import {
  AdminTransferEmailNotificationParams,
  GroupCreatedEmailNotificationParams,
  GroupInvitationNotificationParams,
  GroupJoiningRequestEmailPayload,
  GroupJoiningRequestNotificationParams,
  GroupRequestPushNotificationPayload,
  TransferNotificationParams,
} from 'src/interfaces/notificationInterfaces';

@Injectable()
export class NotificationsService {
  constructor(
    @Inject(forwardRef(() => MailService))
    private readonly mailService: MailService,
    private readonly firebaseService: FirebaseService,
    @Inject(forwardRef(() => ParentService))
    private readonly parentService: ParentService,
  ) {}

  sendGroupCreatedEmailNotification(
    param: GroupCreatedEmailNotificationParams,
  ) {
    this.mailService.groupCreatedNotification(param.email, param.groupId);
  }

  async sendTransferNotification(param: TransferNotificationParams) {
    await this.sendAdminTransferEmailNotification({
      email: param.newAdmin.email,
      groupId: param.group.id,
    });
    if (param.newAdmin.deviceId) {
      this.sendTransferPushNotification({
        deviceId: param.newAdmin.deviceId,
        payload: param.groupId,
      });
    }
    await this.createNotification(
      param.groupId,
      param.newAdmin.email,
      FirebaseMessageEnum.USER_GROUP_TRANSFERED_ADMIN,
    );
  }

  private sendAdminTransferEmailNotification(
    payloadParams: AdminTransferEmailNotificationParams,
  ) {
    this.mailService.adminTransferNotification(
      payloadParams.email,
      payloadParams.groupId,
    );
  }

  private async sendTransferPushNotification(payloadParams: {
    deviceId: string;
    payload?: string;
  }) {
    await this.firebaseService.sendPushNotific(
      payloadParams.deviceId,
      FirebaseMessageEnum.USER_GROUP_TRANSFERED_ADMIN,
      payloadParams.payload,
    );
  }

  async groupJoiningRequestNotification(
    param: GroupJoiningRequestNotificationParams,
  ) {
    const adminId = await this.parentService.findByEmail(param.groupAdmin.email)
    this.sendGroupJoiningRequestEmailNotification({
      groupAdminEmail: param.groupAdmin.email,
      parentId: param.payload.userId,
      childId: param.childId,
    });
    if (param.groupAdmin.deviceId) {
      this.sendGroupRequestPushNotification({
        deviceId: param.groupAdmin.deviceId,
        payload: {
          groupId: param.payload.groupId,
          userId: param.payload.userId,
        },
      });
    }
    await this.createNotification(
      param.payload.groupId,
      adminId.id,
      FirebaseMessageEnum.USER_GROUP_REQUEST,
    );
  }

  private sendGroupJoiningRequestEmailNotification(
    payloadParams: GroupJoiningRequestEmailPayload,
  ) {
    this.mailService.sendGroupJoiningRequest(
      payloadParams.groupAdminEmail,
      payloadParams.parentId,
      payloadParams.childId,
    );
  }

  private async sendGroupRequestPushNotification(
    payloadParams: GroupRequestPushNotificationPayload,
  ) {
    await this.firebaseService.sendPushNotific(
      payloadParams.deviceId,
      FirebaseMessageEnum.USER_GROUP_REQUEST,
      payloadParams.payload,
    );
  }

  async groupInvitationAcceptNotification(
    param: GroupInvitationNotificationParams,
  ) {
    this.sendGroupInvitationAcceptEmailNotification({
      email: param.parent.email,
      groupId: param.group.id,
    });
    this.sendGroupInvitationAcceptPushNotification({
      deviceId: param.parent.deviceId,
      payload: param.groupId,
    });
    await this.createNotification(
      param.groupId,
      param.parent.id,
      FirebaseMessageEnum.USER_GROUP_ACCEPTED,
    );
  }

  private sendGroupInvitationAcceptEmailNotification(payloadParams: {
    email: string;
    groupId: string;
  }) {
    this.mailService.sendGroupInvitationAccept(
      payloadParams.email,
      payloadParams.groupId,
    );
  }

  private async sendGroupInvitationAcceptPushNotification(payloadParams: {
    deviceId: string;
    payload: string;
  }) {
    await this.firebaseService.sendPushNotific(
      payloadParams.deviceId,
      FirebaseMessageEnum.USER_GROUP_ACCEPTED,
      payloadParams.payload,
    );
  }

  async groupInvitationRejectNotification(param: {
    parent: any;
    group: any;
    groupId: string;
  }) {
    this.sendGroupInvitationRejectEmailNotification({
      email: param.parent.email,
      groupId: param.group.id,
    });
    this.sendGroupInvitationRejectPushNotification({
      deviceId: param.parent.deviceId,
      payload: param.groupId,
    });
    await this.createNotification(
      param.groupId,
      param.parent,
      FirebaseMessageEnum.USER_GROUP_REJECTED,
    );
  }

  private sendGroupInvitationRejectEmailNotification(payloadParams: {
    email: string;
    groupId: string;
  }) {
    this.mailService.sendGroupInvitationReject(
      payloadParams.email,
      payloadParams.groupId,
    );
  }

  private async sendGroupInvitationRejectPushNotification(payloadParams: {
    deviceId: string;
    payload: string;
  }) {
    await this.firebaseService.sendPushNotific(
      payloadParams.deviceId,
      FirebaseMessageEnum.USER_GROUP_REJECTED,
      payloadParams.payload,
    );
  }

  async userKickNotification(param: {
    parent: any;
    groupId: string;
    group: any;
  }) {
    this.sendUserKickPushNotification({
      deviceId: param.parent.deviceId,
      payload: param.groupId,
    });
    this.sendKickedFromGroupEmailNotification({
      email: param.parent.email,
      groupId: param.group.id,
    });
    await this.createNotification(
      param.groupId,
      param.parent,
      FirebaseMessageEnum.USER_GROUP_KICKED,
    );
  }

  private sendKickedFromGroupEmailNotification(payloadParams: {
    email: string;
    groupId: string;
  }) {
    this.mailService.kickedFromGroupNotification(
      payloadParams.email,
      payloadParams.groupId,
    );
  }

  private async sendUserKickPushNotification(payloadParams: {
    deviceId: string;
    payload: string;
  }) {
    await this.firebaseService.sendPushNotific(
      payloadParams.deviceId,
      FirebaseMessageEnum.USER_GROUP_KICKED,
      payloadParams.payload,
    );
  }

  async createNotification(
    groupId: string,
    parentId: string,
    notificationType: FirebaseMessageEnumType,
  ) {
    this.parentService.addNotification(groupId, parentId, notificationType);
  }

  async deleteNotifications(parentId: string) {
    this.parentService.removeNotifications(parentId);
  }
}
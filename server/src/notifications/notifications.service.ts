import { ParentService } from './../parent/parent.service';
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
    @Inject(forwardRef(() => ParentService))
    private readonly parentService: ParentService,
  ) {}

  sendGroupCreatedEmailNotification(email: string, groupId: string) {
    this.mailService.groupCreatedNotification(email, groupId);
  }

  async sendTransferNotification(newAdmin, group, groupId) {
    await this.sendAdminTransferEmailNotification(newAdmin.email, group.id);
    if (newAdmin.deviceId)
      this.sendTransferPushNotification(newAdmin.deviceId, {
        groupId,
      });
    await this.createNotification(
      newAdmin,
      FirebaseMessageEnum.USER_GROUP_TRANSFERED_ADMIN,
    );
  }

  private sendAdminTransferEmailNotification(email: string, groupId: string) {
    this.mailService.adminTransferNotification(email, groupId);
  }

  private async sendTransferPushNotification(
    deviceId: string,
    payload: { groupId: string },
  ) {
    await this.firebaseService.sendPushNotific(
      deviceId,
      FirebaseMessageEnum.USER_GROUP_TRANSFERED_ADMIN,
      payload,
    );
  }

  async groupJoiningRequestNotification(
    groupAdmin,
    childId,
    { groupId: groupId, userId: parentId },
  ) {
    this.sendGroupJoiningRequestEmailNotification(
      groupAdmin.email,
      parentId,
      childId,
    );
    if (groupAdmin.deviceId)
      this.sendGroupRequestPushNotification(groupAdmin.deviceId, {
        groupId: groupId,
        userId: parentId,
      });
    await this.createNotification(
      parentId,
      FirebaseMessageEnum.USER_GROUP_REQUEST,
    );
  }

  private sendGroupJoiningRequestEmailNotification(
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

  private async sendGroupRequestPushNotification(
    deviceId: string,
    payload: { groupId: string; userId: string },
  ) {
    await this.firebaseService.sendPushNotific(
      deviceId,
      FirebaseMessageEnum.USER_GROUP_REQUEST,
      payload,
    );
  }

  async groupInvitationAcceptNotification(parent, group, groupId) {
    this.sendGroupInvitationAcceptEmailNotification(parent.email, group.id);
    this.sendGroupInvitationAcceptPushNotification(parent.deviceId, {
      groupId,
    });
    await this.createNotification(
      parent,
      FirebaseMessageEnum.USER_GROUP_ACCEPTED,
    );
  }

  private sendGroupInvitationAcceptEmailNotification(
    email: string,
    groupId: string,
  ) {
    this.mailService.sendGroupInvitationAccept(email, groupId);
  }

  private async sendGroupInvitationAcceptPushNotification(
    deviceId: string,
    payload: { groupId: string },
  ) {
    await this.firebaseService.sendPushNotific(
      deviceId,
      FirebaseMessageEnum.USER_GROUP_ACCEPTED,
      payload,
    );
  }

  async groupInvitationRejectNotification(parent, group, groupId) {
    this.sendGroupInvitationRejectEmailNotification(parent.email, group.id);
    this.sendGroupInvitationRejectPushNotification(parent.deviceId, {
      groupId,
    });
    await this.createNotification(
      parent,
      FirebaseMessageEnum.USER_GROUP_REJECTED,
    );
  }

  private sendGroupInvitationRejectEmailNotification(
    email: string,
    groupId: string,
  ) {
    this.mailService.sendGroupInvitationReject(email, groupId);
  }

  private async sendGroupInvitationRejectPushNotification(
    deviceId: string,
    payload: { groupId: string },
  ) {
    await this.firebaseService.sendPushNotific(
      deviceId,
      FirebaseMessageEnum.USER_GROUP_REJECTED,
      payload,
    );
  }

  async userKickNotification(parent, groupId, group) {
    this.sendUserKickPushNotification(parent.deviceId, {
      groupId,
    });
    this.sendKickedFromGroupEmailNotification(parent.email, group.id);
    await this.createNotification(
      parent,
      FirebaseMessageEnum.USER_GROUP_KICKED,
    );
  }

  private sendKickedFromGroupEmailNotification(email: string, groupId: string) {
    this.mailService.kickedFromGroupNotification(email, groupId);
  }

  private async sendUserKickPushNotification(
    deviceId: string,
    payload: { groupId: string },
  ) {
    await this.firebaseService.sendPushNotific(
      deviceId,
      FirebaseMessageEnum.USER_GROUP_KICKED,
      payload,
    );
  }

  async createNotification(parentId: string, notificationType: string) {
    this.parentService.addNotification(parentId, notificationType);
  }

  async deleteNotifications(parentId: string) {
    this.parentService.removeNotifications(parentId);
  }
}

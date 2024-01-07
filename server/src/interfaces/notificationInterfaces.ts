export interface GroupCreatedEmailNotificationParams {
  email: string;
  groupId: string;
}

export interface TransferNotificationParams {
  newAdmin: {
    email: string;
    deviceId?: string;
  };
  group: {
    id?: string;
  };
  groupId: string;
}

export interface AdminTransferEmailNotificationParams {
  email: string;
  groupId: string;
}

interface GroupAdmin {
  email: string;
  deviceId?: string;
}

interface JoinRequestPayload {
  userId: string;
  groupId: string;
  parentId?: string;
}

export interface GroupJoiningRequestNotificationParams {
  groupAdmin: GroupAdmin;
  payload: JoinRequestPayload;
  childId: string;
}

export interface GroupJoiningRequestEmailPayload {
  groupAdminEmail: string;
  parentId: string;
  childId: string;
}

export interface GroupRequestPushNotificationPayload {
  deviceId: string;
  payload: {
    groupId: string;
    userId: string;
  };
}

export interface GroupInvitationNotificationParams {
  parent: {
    email: string;
    deviceId?: string;
  };
  group: {
    id?: string;
  };
  groupId: string;
}

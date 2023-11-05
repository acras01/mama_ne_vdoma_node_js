export const FirebaseMessageEnum = {
  USER_GROUP_REQUEST: 'join',
  USER_GROUP_ACCEPTED: 'accept',
  USER_GROUP_REJECTED: 'reject',
  USER_GROUP_KICKED: 'kick',
  USER_GROUP_TRANSFERED_ADMIN: 'make_admin',
} as const;

export type FirebaseMessageEnumType =
  (typeof FirebaseMessageEnum)[keyof typeof FirebaseMessageEnum];

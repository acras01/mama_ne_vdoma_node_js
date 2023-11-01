import { askingJoinGroup } from '../models/group.model';

export const isChild = (childId: string) => (el: askingJoinGroup) =>
  el.childId === childId;

import { askingJoinGroup } from '../models/group.model';

export const isNotChild = (childId: string) => (el: askingJoinGroup) =>
  el.childId !== childId;

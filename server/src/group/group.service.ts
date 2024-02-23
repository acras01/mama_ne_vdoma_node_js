import { NotificationsService } from './../notifications/notifications.service';
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { InjectModel } from '@m8a/nestjs-typegoose';
import { Group } from './models/group.model';
import { ReturnModelType } from '@typegoose/typegoose';
import { UpdateGroupDto } from './dto/update-group.dto';
import { ParentService } from '../parent/parent.service';
import { ChildService } from '../child/child.service';
import { PrepareGeoQuery } from 'src/shared/helpers/prepare-geo-query-mongo';
import { UpdateGroupGeoDto } from './dto/update-group-geo.dto';
import { BackblazeService } from 'src/backblaze/backblaze.service';
import { isNotChild } from './utils/isNotChild';
import { isChild } from './utils/isChild';
import { KarmaService } from '../karma/karma.service';
import {
  alreadyInGroup,
  alreadySendedRequest,
  cannotLeaveFromGroupWhereYouAnAdmin,
  dontHaveAccess,
  memberNotFound,
  newFileNotFound,
  notAnAdmin,
  notFound,
  notInGroup,
  notaParentOfThisChild,
  requestNotFound,
} from './utils/errors';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group)
    private readonly groupModel: ReturnModelType<typeof Group>,
    @Inject(forwardRef(() => ParentService))
    private readonly parentService: ParentService,
    @Inject(forwardRef(() => BackblazeService))
    private readonly backblazeService: BackblazeService,
    private readonly childService: ChildService,
    private readonly notificationService: NotificationsService,
    @Inject(forwardRef(() => KarmaService))
    private readonly karmaService: KarmaService,
  ) {}

  async createGroup(
    parentId: string,
    childId: string,
    createGroupDto: CreateGroupDto,
  ) {
    const [child, parent] = await Promise.all([
      this.childService.findChildById(childId),
      this.parentService.findById(parentId),
    ]);
    if (child.parentId !== parent.id)
      throw new ForbiddenException(notaParentOfThisChild);
    const newGroup: Group = {
      adminId: parentId,
      ages: String(child.age),
      members: [{ childId, parentId }],
      ...createGroupDto,
    };
    if (child.week) newGroup.week = child.week;
    if (parent.location) newGroup.location = parent.location;
    const group = await this.groupModel.create(newGroup);
    this.notificationService.sendGroupCreatedEmailNotification({
      email: parent.email,
      groupId: group.id,
    });
    return group;
  }

  async findGroupsByMember(parentId) {
    return await this.groupModel.find({
      'members.parentId': parentId,
    });
  }

  async changeAdmin(groupId: string, adminId: string, newAdminId: string) {
    const group = await this.findById(groupId);
    if (group.adminId !== adminId) throw new ForbiddenException();
    const isAdminInGroup = group.members.some(
      (el) => el.parentId === newAdminId,
    );
    if (!isAdminInGroup) throw new NotFoundException();
    group.adminId = newAdminId;
    const newAdmin = await this.parentService.findById(newAdminId);
    await this.notificationService.sendTransferNotification({
      newAdmin,
      group,
      groupId,
    });
    await group.save();
  }

  async findGroupsByLocation(lon: number, lat: number, radius: number) {
    return await this.groupModel.find({
      location: PrepareGeoQuery({ lat, lon, radius }),
    });
  }

  async findById(id: string) {
    const findedDoc = await this.groupModel.findById(id);
    if (findedDoc === null) throw new NotFoundException(notFound);
    const parentsIds = findedDoc.members.map((v) => v.parentId);
    const grades = await Promise.all(
      parentsIds.map((v) => this.karmaService.getUserKarma(v)),
    );
    findedDoc.karma = Number(
      (grades.reduce((acc, v) => acc + v, 0) / grades.length).toFixed(1),
    );
    return findedDoc;
  }

  async askToJoinGroup(parentId: string, childId: string, groupId: string) {
    const [child, parent] = await Promise.all([
      this.childService.findChildById(childId),
      this.parentService.findById(parentId),
    ]);
    if (child.parentId !== parent.id) throw new BadRequestException();
    const group = await this.findById(groupId);
    if (group.members.find(isChild(childId)))
      throw new BadRequestException(alreadyInGroup);
    if (group.askingJoin.find((el) => el.childId === childId))
      throw new BadRequestException(alreadySendedRequest);
    const groupAdmin = await this.parentService.findById(group.adminId);
    group.askingJoin.push({ childId, parentId });
    parent.groupJoinRequests.push({ groupId, childId });
    this.notificationService.groupJoiningRequestNotification({
      groupAdmin,
      childId,
      payload: { groupId: groupId, userId: parentId },
    });

    await Promise.all([parent.save(), group.save()]);
  }

  async cancelGroupMembershipRequest(
    groupId: string,
    parentId: string,
    childId: string,
  ) {
    const [child, parent, group] = await Promise.all([
      this.childService.findChildById(childId),
      this.parentService.findById(parentId),
      this.findById(groupId),
    ]);

    if (child.parentId !== parent.id)
      throw new BadRequestException(notaParentOfThisChild);
    if (!group.askingJoin.find((el) => el.childId === childId)) {
      throw new BadRequestException(requestNotFound);
    }

    group.askingJoin = group.askingJoin.filter(isNotChild(childId));

    const parentRequest = parent.groupJoinRequests.find(
      (el) => el.childId === childId && el.groupId === groupId,
    );

    if (!parentRequest) throw new BadRequestException(requestNotFound);

    parent.groupJoinRequests = parent.groupJoinRequests.filter(
      (el) => el !== parentRequest,
    );

    await Promise.all([parent.save(), group.save()]);
  }

  async resolveJoinGroup(
    groupId: string,
    adminId: string,
    childId: string,
    isAccept: boolean,
  ) {
    const [group, child] = await Promise.all([
      this.findById(groupId),
      this.childService.findChildById(childId),
    ]);

    if (group.adminId !== adminId) throw new ForbiddenException(notAnAdmin);

    const parentId = child.parentId;
    const parent = await this.parentService.findById(parentId);
    const ask = group.askingJoin.find(
      (ask) => ask.parentId === parentId && ask.childId === childId,
    );
    if (!ask) throw new BadRequestException(requestNotFound);
    if (isAccept) {
      group.members.push({ childId, parentId });
      this.notificationService.groupInvitationAcceptNotification({
        parent,
        group,
        groupId,
      });
    } else {
      await this.notificationService.groupInvitationRejectNotification({
        parent,
        group,
        groupId,
      });
    }

    const parentRequest = parent.groupJoinRequests.find(
      (el) => el.childId === childId && el.groupId === groupId,
    );
    parent.groupJoinRequests = parent.groupJoinRequests.filter(
      (el) => el !== parentRequest,
    );
    group.askingJoin = group.askingJoin.filter((el) => el !== ask);
    await Promise.all([
      this.removeGroupRequestFromUser(parent.id, group.id),
      group.save(),
      parent.save(),
    ]);
  }
  async fullInfo(groupId: string, adminId: string) {
    const group = await this.findById(groupId);
    if (group.adminId !== adminId) throw new ForbiddenException(dontHaveAccess);

    const parentsIds = [
      ...group.members.map((member) => member.parentId),
      ...group.askingJoin.map((el) => el.parentId),
    ];
    const parents = await this.parentService.findMany(parentsIds);

    const preparedParents = parents.map((el) => {
      const {
        password,
        passwordResetCode,
        passwordResetCodeExpire,
        activationCode,
        ...parent
      } = el.toObject();
      return parent;
    });

    const childsIds = [
      ...group.members.map((member) => member.childId),
      ...group.askingJoin.map((el) => el.childId),
    ];
    const childs = await this.childService.findMany(childsIds);

    return { group, parents: preparedParents, childs };
  }

  async kick(
    groupId: string,
    childId: string,
    adminId: string,
    notification = true,
  ) {
    const group = await this.findById(groupId);
    if (group.adminId !== adminId) throw new ForbiddenException(dontHaveAccess);
    const memberPair = group.members.find((el) => el.childId === childId);
    if (!memberPair) throw new NotFoundException(memberNotFound);
    group.members = group.members.filter((el) => el !== memberPair);
    group.askingJoin = group.askingJoin.filter(isNotChild(childId));
    await group.save();
    if (notification) {
      const parent = await this.parentService.findById(memberPair.parentId);
      this.notificationService.userKickNotification({ parent, groupId, group });
    }
  }

  private async removeGroupRequestFromUser(parentId, groupId) {
    const parent = await this.parentService.findById(parentId);
    parent.groupJoinRequests = parent.groupJoinRequests.filter(
      (el) => el !== groupId,
    );
    await parent.save();
  }

  async deleteGroup(groupId: string, adminId: string) {
    const group = await this.findById(groupId);
    if (group.adminId !== adminId) throw new ForbiddenException();
    await Promise.all(
      group.askingJoin.map((el) =>
        this.removeGroupRequestFromUser(el.parentId, group.id),
      ),
    );
    await group.deleteOne();
  }

  async leaveFromGroup(groupId: string, parentId: string) {
    const group = await this.findById(groupId);
    if (!group.members.find((el) => el.parentId === parentId))
      throw new BadRequestException(notInGroup);
    if (group.adminId === parentId)
      throw new BadRequestException(cannotLeaveFromGroupWhereYouAnAdmin);
    group.members = group.members.filter((el) => el.parentId !== parentId);
    await group.save();
  }

  async updateGroup(
    groupId: string,
    adminId: string,
    updateGroupDto: UpdateGroupDto,
  ) {
    const group = await this.findById(groupId);
    if (group.adminId !== adminId) throw new ForbiddenException();
    try {
      if (updateGroupDto.avatar) {
        await this.backblazeService.getFileInfo(updateGroupDto.avatar);
      }
    } catch (error) {
      throw new BadRequestException(newFileNotFound);
    }
    if (
      updateGroupDto.avatar &&
      group.avatar &&
      updateGroupDto.avatar !== group.avatar
    ) {
      await this.backblazeService.deleteFile(group.avatar);
    }
    await group.updateOne(updateGroupDto);
    return await this.findById(groupId);
  }
  async updateGroupGeo(
    groupId: string,
    adminId: string,
    updateGroupGeoDto: UpdateGroupGeoDto,
  ) {
    const group = await this.findById(groupId);
    if (group.adminId !== adminId) throw new ForbiddenException();
    await group.updateOne({
      location: {
        type: 'Point',
        coordinates: [updateGroupGeoDto.lon, updateGroupGeoDto.lat],
      },
    });
    return true;
  }

  async cleanUpAfterDeleteParent(parentId: string) {
    const parent = await this.parentService.findById(parentId);
    const aloneGroups = await this.findGroupsByMember(parent.id);
    await Promise.all(
      aloneGroups
        .filter((el) => el.members.length === 1)
        .map((el) => this.deleteGroup(el.id, parentId)),
    );
    const groups = await this.findGroupsByMember(parent.id);
    const requests = parent.groupJoinRequests.map((el) => el.groupId);
    const requestsGroups = await Promise.all(
      requests.map((el) => this.findById(el)),
    );
    await Promise.all(
      requestsGroups.map((el) => {
        el.askingJoin = el.askingJoin.filter(
          (asking) => asking.parentId !== parentId,
        );
        return el.save();
      }),
    );
    const whereAdmins = groups.filter((group) => group.adminId === parentId);
    const changeAdmins = whereAdmins.map((el) => ({
      newAdmin: el.members.find((el) => el.parentId !== parentId).parentId,
      groupId: el.id,
    }));
    await Promise.all(
      changeAdmins.map((el) =>
        this.changeAdmin(el.groupId, parentId, el.newAdmin),
      ),
    );
    const membersGroups = await this.findGroupsByMember(parent.id);
    const updateGroups = membersGroups.map((group) => {
      const pair = group.members.find((el) => el.parentId === parentId);
      return {
        childId: pair.childId,
        parentId,
        groupId: group.id,
        adminId: group.adminId,
      };
    });
    await Promise.all(
      updateGroups.map((el) =>
        this.kick(el.groupId, el.childId, el.adminId, false),
      ),
    );
    return true;
  }

  async isHaveSharedGroups(parent1, parent2) {
    const documents = await this.groupModel.find({
      members: {
        $all: [
          { $elemMatch: { parentId: parent1 } },
          { $elemMatch: { parentId: parent2 } },
        ],
      },
    });
    return documents.length;
  }
}

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
import { MailService } from '../mail/mail.service';
import { UpdateGroupDto } from './dto/update-group.dto';
import { ParentService } from '../parent/parent.service';
import { ChildService } from '../child/child.service';
import { PrepareGeoQuery } from 'src/shared/helpers/prepare-geo-query-mongo';
import { UpdateGroupGeoDto } from './dto/update-group-geo.dto';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group)
    private readonly groupModel: ReturnModelType<typeof Group>,
    @Inject(forwardRef(() => ParentService))
    private readonly paretnSerivce: ParentService,
    private readonly childService: ChildService,
    @Inject(forwardRef(() => MailService))
    private readonly mailService: MailService,
  ) {}

  async createGroup(
    parentId: string,
    childId: string,
    createGroupDto: CreateGroupDto,
  ) {
    const parent = await this.paretnSerivce.findById(parentId);
    const child = await this.childService.findChildById(childId);
    const newGroup: Group = {
      adminId: parentId,
      ages: String(child.age),
      members: [{ childId, parentId }],
      ...createGroupDto,
    };
    if (parent.location) newGroup.location = parent.location;
    const group = await this.groupModel.create(newGroup);
    await this.mailService.groupCreatedNotification(parent.email, group.id);
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
    await group.save();
  }

  async findGroupsByLocation(lon: number, lat: number, radius: number) {
    return await this.groupModel.find({
      location: PrepareGeoQuery({ lat, lon, radius }),
    });
  }

  async findById(id: string) {
    const findedDoc = await this.groupModel.findById(id);
    if (findedDoc === null) throw new NotFoundException('Not Found');
    return findedDoc;
  }

  async askToJoinGroup(parentId: string, childId: string, groupId: string) {
    const child = await this.childService.findChildById(childId);
    const parent = await this.paretnSerivce.findById(parentId);
    if (child.parentId !== parent.id) throw new BadRequestException();
    const group = await this.findById(groupId);
    if (group.members.find((el) => el.childId === childId))
      throw new BadRequestException('Already in group');
    if (group.askingJoin.find((el) => el.childId === childId))
      throw new BadRequestException('Already sended request');
    const groupAdmin = await this.paretnSerivce.findById(group.adminId);
    group.askingJoin.push({ childId, parentId });
    this.mailService.sendGroupJoiningRequest(
      groupAdmin.email,
      parentId,
      childId,
    );
    await group.save();
  }

  async resolveJoinGroup(
    groupId: string,
    adminId: string,
    childId: string,
    isAccept: boolean,
  ) {
    const group = await this.findById(groupId);
    if (group.adminId !== adminId) throw new ForbiddenException('Not an admin');
    const child = await this.childService.findChildById(childId);
    const parentId = child.parentId;
    const parent = await this.paretnSerivce.findById(parentId);
    const ask = group.askingJoin.find(
      (ask) => ask.parentId === parentId && ask.childId === childId,
    );
    if (!ask) throw new BadRequestException('Request to join not found');
    if (isAccept) {
      group.members.push({ childId, parentId });
      await this.mailService.sendGroupInvitationAccept(parent.email, group.id);
    } else {
      await this.mailService.sendGroupInvitationReject(parent.email, group.id);
    }
    group.askingJoin = group.askingJoin.filter((el) => el !== ask);
    await group.save();
  }
  async fullInfo(groupId: string, adminId: string) {
    const group = await this.findById(groupId);
    if (group.adminId !== adminId)
      throw new ForbiddenException('Dont have access');
    const parents = await Promise.all([
      ...group.members.map((member) =>
        this.paretnSerivce.findById(member.parentId),
      ),
      ...group.askingJoin.map((el) => this.paretnSerivce.findById(el.parentId)),
    ]);
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
    const childs = await Promise.all([
      ...group.members.map((member) =>
        this.childService.findChildById(member.childId),
      ),
      ...group.askingJoin.map((el) =>
        this.childService.findChildById(el.childId),
      ),
    ]);
    return { group, parents: preparedParents, childs };
  }

  async kick(
    groupId: string,
    childId: string,
    adminId: string,
    notification = true,
  ) {
    const group = await this.findById(groupId);
    if (group.adminId !== adminId)
      throw new ForbiddenException('Dont have access');
    const memberPair = group.members.find((el) => el.childId === childId);
    if (!memberPair) throw new NotFoundException('Member not found');
    group.members = group.members.filter((el) => el !== memberPair);
    group.askingJoin = group.askingJoin.filter((el) => el.childId !== childId);
    await group.save();
    if (notification) {
      const parent = await this.paretnSerivce.findById(memberPair.parentId);
      await this.mailService.kickedFromGroupNotification(
        parent.email,
        group.name,
      );
    }
  }

  async deleteGroup(groupId: string, adminId: string) {
    const group = await this.findById(groupId);
    if (group.adminId !== adminId) throw new ForbiddenException();
    await group.deleteOne();
  }

  async updateGroup(
    groupId: string,
    adminId: string,
    updateGroupDto: UpdateGroupDto,
  ) {
    const group = await this.findById(groupId);
    if (group.adminId !== adminId) throw new ForbiddenException();
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
    const parent = await this.paretnSerivce.findById(parentId);
    const aloneGroups = await this.findGroupsByMember(parent.id);
    await Promise.all(
      aloneGroups
        .filter((el) => el.members.length === 1)
        .map((el) => this.deleteGroup(el.id, parentId)),
    );
    const groups = await this.findGroupsByMember(parent.id);
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
}

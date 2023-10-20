import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { ApiBearerAuth, ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { UpdateGeoDto } from '../shared/dto/update-geo.dto';
import { CookieAuthenticationGuard } from '../auth/guards/coockie.guard';
import RequestWithSession from '../auth/interfaces/req-with-session.interface';

@ApiTags('group')
@ApiCookieAuth()
@Controller('group')
@UseGuards(CookieAuthenticationGuard)
export class GroupController {
  constructor(private readonly groupService: GroupService) {}
  @Post('join/:groupId/:childId')
  @ApiOperation({ summary: 'Request to join group by groupId with childId' })
  async requestJoinGroup(
    @Param('childId') childId: string,
    @Param('groupId') groupId: string,
    @Req() request: RequestWithSession,
  ) {
    return await this.groupService.askToJoinGroup(
      request.user.id,
      childId,
      groupId,
    );
  }
  @Post('accept/:groupId/:childId')
  @ApiOperation({ summary: 'Decline request in groupId with childId' })
  async acceptRequest(
    @Param('childId') childId: string,
    @Param('groupId') groupId: string,
    @Req() request: RequestWithSession,
  ) {
    return await this.groupService.resolveJoinGroup(
      groupId,
      request.user.id,
      childId,
      true,
    );
  }
  @ApiOperation({ summary: 'Decline request in groupId with childId' })
  @Post('decline/:groupId/:childId')
  async rejectRequest(
    @Param('childId') childId: string,
    @Param('groupId') groupId: string,
    @Req() request: RequestWithSession,
  ) {
    return await this.groupService.resolveJoinGroup(
      groupId,
      request.user.id,
      childId,
      false,
    );
  }
  @Get('find/geo')
  async findGroupByGeo(
    @Query('lat') lat: number,
    @Query('lon') lon: number,
    @Query('radius') radius: number,
  ) {
    console.log('');
    return await this.groupService.findGroupsByLocation(lon, lat, radius);
  }
  @Get('find/:parentId')
  async findGroupWithMemberId(@Param('parentId') parentId: string) {
    return await this.groupService.findGroupsByMember(parentId);
  }
  @Post('full-info/:groupId')
  async findFullInfoAboutGroup(
    @Param('groupId') groupId: string,
    @Req() request: RequestWithSession,
  ) {
    return await this.groupService.fullInfo(groupId, request.user.id);
  }
  @Post('kick/:groupId/:childId')
  async kickMember(
    @Param('groupId') groupId: string,
    @Param('childId') childId: string,
    @Req() request: RequestWithSession,
  ) {
    return await this.groupService.kick(groupId, childId, request.user.id);
  }
  @Post(':childId')
  @ApiOperation({ summary: 'Create group with childrenId' })
  async createGroup(
    @Param('childId') childId: string,
    @Req() request: RequestWithSession,
    @Body() createGroupDto: CreateGroupDto,
  ) {
    return await this.groupService.createGroup(
      request.user.id,
      childId,
      createGroupDto,
    );
  }
  @Get(':groupId')
  async findGroupById(@Param('groupId') groupId: string) {
    const group = await this.groupService.findById(groupId);
    return group;
  }
  @Patch('admin/:groupId/:parentId')
  async changeAdming(
    @Param('groupId') groupId: string,
    @Param('parentId') parentId: string,
    @Req() request: RequestWithSession,
  ) {
    await this.groupService.changeAdmin(groupId, request.user.id, parentId);
  }
  @Patch('geo/:groupId')
  async updateGeoGroup(
    @Param('groupId') groupId: string,
    @Req() request: RequestWithSession,
    @Body() updateGeoDto: UpdateGeoDto,
  ) {
    await this.groupService.updateGroupGeo(
      groupId,
      request.user.id,
      updateGeoDto,
    );
  }
  @Patch(':groupId')
  async updateGroup(
    @Param('groupId') groupId: string,
    @Req() request: RequestWithSession,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    await this.groupService.updateGroup(
      groupId,
      request.user.id,
      updateGroupDto,
    );
  }
}

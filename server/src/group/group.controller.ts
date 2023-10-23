import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guards';
import { CreateGroupDto } from './dto/create-group.dto';
import { UserData } from '../auth/decorators/get-user-from-jwt.decorator';
import { IJwtData } from 'src/shared/interfaces/jwt-data.interface';
import { UpdateGroupDto } from './dto/update-group.dto';
import { UpdateGeoDto } from '../shared/dto/update-geo.dto';

@ApiTags('group')
@ApiBearerAuth()
@Controller('group')
@UseGuards(AuthGuard)
export class GroupController {
  constructor(private readonly groupService: GroupService) {}
  @Post('join/:groupId/:childId')
  @ApiOperation({ summary: 'Request to join group by groupId with childId' })
  async requestJoinGroup(
    @Param('childId') childId: string,
    @Param('groupId') groupId: string,
    @UserData() jwtData: IJwtData,
  ) {
    return await this.groupService.askToJoinGroup(jwtData.id, childId, groupId);
  }
  @Post('accept/:groupId/:childId')
  @ApiOperation({ summary: 'Decline request in groupId with childId' })
  async acceptRequest(
    @Param('childId') childId: string,
    @Param('groupId') groupId: string,
    @UserData() jwtData: IJwtData,
  ) {
    return await this.groupService.resolveJoinGroup(
      groupId,
      jwtData.id,
      childId,
      true,
    );
  }
  @ApiOperation({ summary: 'Decline request in groupId with childId' })
  @Post('decline/:groupId/:childId')
  async rejectRequest(
    @Param('childId') childId: string,
    @Param('groupId') groupId: string,
    @UserData() jwtData: IJwtData,
  ) {
    return await this.groupService.resolveJoinGroup(
      groupId,
      jwtData.id,
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
    @UserData() jwtData: IJwtData,
  ) {
    return await this.groupService.fullInfo(groupId, jwtData.id);
  }
  @Post('kick/:groupId/:childId')
  async kickMember(
    @Param('groupId') groupId: string,
    @Param('childId') childId: string,
    @UserData() jwtData: IJwtData,
  ) {
    return await this.groupService.kick(groupId, childId, jwtData.id);
  }
  @Post(':childId')
  @ApiOperation({ summary: 'Create group with childrenId' })
  async createGroup(
    @Param('childId') childId: string,
    @UserData() jwtData: IJwtData,
    @Body() createGroupDto: CreateGroupDto,
  ) {
    return await this.groupService.createGroup(
      jwtData.id,
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
    @UserData() jwtData: IJwtData,
  ) {
    await this.groupService.changeAdmin(groupId, jwtData.id, parentId);
  }
  @Patch('geo/:groupId')
  async updateGeoGroup(
    @Param('groupId') groupId: string,
    @UserData() jwtData: IJwtData,
    @Body() updateGeoDto: UpdateGeoDto,
  ) {
    await this.groupService.updateGroupGeo(groupId, jwtData.id, updateGeoDto);
  }
  @Patch(':groupId')
  async updateGroup(
    @Param('groupId') groupId: string,
    @UserData() jwtData: IJwtData,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    await this.groupService.updateGroup(groupId, jwtData.id, updateGroupDto);
  }
  @Post('leave/:groupId/')
  async leaveFromGroup(
    @Param('groupId') groupId: string,
    @UserData() jwtData: IJwtData,
  ) {
    await this.groupService.leaveFromGroup(groupId, jwtData.id);
  }
}

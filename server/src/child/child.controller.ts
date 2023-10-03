import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ChildService } from './child.service';
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateChildDto } from './dto/create-child.dto';
import { UserData } from 'src/auth/decorators/get-user-from-jwt.decorator';
import { IJwtData } from 'src/shared/interfaces/jwt-data.interface';
import { ParentService } from 'src/parent/parent.service';
import { AuthGuard } from 'src/auth/guards/auth.guards';
import { UpdateChildDto } from './dto/update-child.dto';
@ApiTags('child')
@ApiBearerAuth()
@Controller('child')
@UseGuards(AuthGuard)
export class ChildController {
  constructor(
    private readonly childService: ChildService,
    private readonly parentService: ParentService,
  ) {}

  @Post()
  async addChild(
    @Body() createChildDto: CreateChildDto,
    @UserData() jwtData: IJwtData,
  ) {
    const parent = await this.parentService.findFullInfoByEmail(jwtData.email);
    return await this.childService.addChild(createChildDto, parent.id);
  }

  @Get()
  async getAllChilds(@UserData() jwtData: IJwtData) {
    const childs = await this.childService.getChilds(jwtData.id);
    return childs;
  }

  @Get(':id')
  async getChild(@Param('id') childId: string, @UserData() jwtData: IJwtData) {
    const parent = await this.parentService.findFullInfoByEmail(jwtData.email);
    const child = await this.childService.findChildById(childId);
    if (parent.id !== child.parentId) throw new ForbiddenException();
    return child;
  }

  @Patch(':id')
  async updateChild(
    @Param('id') childId: string,
    @UserData() jwtData: IJwtData,
    @Body() updateChildDto: UpdateChildDto,
  ) {
    const parent = await this.parentService.findFullInfoByEmail(jwtData.email);
    return await this.childService.updateChild(
      updateChildDto,
      childId,
      parent.id,
    );
  }

  @Delete(':id')
  async deleteChild(
    @Param('id') childId: string,
    @UserData() jwtdata: IJwtData,
  ) {
    const parent = await this.parentService.findFullInfoByEmail(jwtdata.email);
    return await this.childService.deleteChild(childId, parent.id);
  }
}

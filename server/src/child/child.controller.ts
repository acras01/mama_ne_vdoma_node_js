import { ApiBearerAuth, ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { ChildService } from './child.service';
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  forwardRef,
} from '@nestjs/common';
import { CreateChildDto } from './dto/create-child.dto';
import { ParentService } from 'src/parent/parent.service';
import { UpdateChildDto } from './dto/update-child.dto';
import { CookieAuthenticationGuard } from 'src/auth/guards/coockie.guard';
import RequestWithSession from 'src/auth/interfaces/req-with-session.interface';
@ApiTags('child')
@ApiCookieAuth()
@Controller('child')
@UseGuards(CookieAuthenticationGuard)
export class ChildController {
  constructor(
    private readonly childService: ChildService,
    @Inject(forwardRef(() => ParentService))
    private parentService: ParentService,
  ) {}

  @Post()
  async addChild(
    @Body() createChildDto: CreateChildDto,
    @Req() request: RequestWithSession,
  ) {
    const parent = await this.parentService.findFullInfoByEmail(
      request.user.email,
    );
    return await this.childService.addChild(createChildDto, parent.id);
  }

  @Get()
  async getAllChilds(@Req() request: RequestWithSession) {
    const childs = await this.childService.getChilds(request.user.id);
    return childs;
  }

  @Get(':id')
  async getChild(
    @Param('id') childId: string,
    @Req() request: RequestWithSession,
  ) {
    const parent = await this.parentService.findFullInfoByEmail(
      request.user.email,
    );
    const child = await this.childService.findChildById(childId);
    if (parent.id !== child.parentId) throw new ForbiddenException();
    return child;
  }

  @Patch(':id')
  async updateChild(
    @Param('id') childId: string,
    @Req() request: RequestWithSession,
    @Body() updateChildDto: UpdateChildDto,
  ) {
    const parent = await this.parentService.findFullInfoByEmail(
      request.user.email,
    );
    return await this.childService.updateChild(
      updateChildDto,
      childId,
      parent.id,
    );
  }

  @Delete(':id')
  async deleteChild(
    @Param('id') childId: string,
    @Req() request: RequestWithSession,
  ) {
    const parent = await this.parentService.findFullInfoByEmail(
      request.user.email,
    );
    return await this.childService.deleteChild(childId, parent.id);
  }
}

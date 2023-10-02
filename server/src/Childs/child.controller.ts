import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ChildService } from './child.service';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateChildDto } from './dto/create-child.dto';
import { UserData } from 'src/auth/decorators/get-user-from-jwt.decorator';
import { IJwtData } from 'src/shared/interfaces/jwt-data.interface';
import { ParentService } from 'src/Parent/parent.service';
import { AuthGuard } from 'src/auth/guards/auth.guards';
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
    console.log(jwtData)
    const childs = await this.childService.getChilds(jwtData.id);
    return childs;
  }
}

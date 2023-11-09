import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ParentService } from 'src/parent/parent.service';
import { UpdateParentDto } from './dto/update-parent.dto';
import { UserData } from 'src/auth/decorators/get-user-from-jwt.decorator';
import { IJwtData } from '../shared/interfaces/jwt-data.interface';
import { UpdateGeoDto } from 'src/shared/dto/update-geo.dto';
import { DeleteParentDto } from './dto/delete-parent.dto';
import { FindParentDto } from './dto/find-parent.dto';
import RequestWithSession from '../auth/interfaces/req-with-session.interface';
import { CookieAuthenticationGuard } from '../auth/guards/coockie.guard';

@ApiTags('parent')
@Controller('parent')
export class ParentController {
  constructor(private readonly parentService: ParentService) {}

  @ApiCookieAuth()
  @UseGuards(CookieAuthenticationGuard)
  @Patch()
  @HttpCode(200)
  async updateParent(
    @Body() patchParentDto: UpdateParentDto,
    @Req() request: RequestWithSession,
  ) {
    return await this.parentService.updateParent(patchParentDto, request.user.email);
  }

  @ApiCookieAuth()
  @UseGuards(CookieAuthenticationGuard)
  @Patch('geo')
  @HttpCode(200)
  async updateParentGeo(
    @Body() updateGeoDto: UpdateGeoDto,
    @Req() request: RequestWithSession,
  ) {
    return await this.parentService.updateGeoLocation(
      updateGeoDto,
      request.user.email,
    );
  }

  @ApiOperation({
    summary: 'В тестових цілях видалення будь якого акк по емейлу',
  })
  @Delete('/dev')
  async deleteParent(@Body() deleteParentDto: DeleteParentDto) {
    return await this.parentService.deleteParent(deleteParentDto.email);
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Видалення залогіненого аккаунта' })
  @UseGuards(CookieAuthenticationGuard)
  @Delete()
  async deleteMyAccount(@Req() request: RequestWithSession) {
    return await this.parentService.deleteAccount(request.user.email);
  }

  @ApiOperation({ summary: 'Пошук за emailom' })
  @ApiCookieAuth()
  @UseGuards(CookieAuthenticationGuard)
  @Post('find')
  async findUser(@Body() findParentDto: FindParentDto) {
    const user = await this.parentService.findByEmail(findParentDto.email);
    const childs = await this.parentService.getChildsByAccount(user.id);
    return { user, childs };
  }
  @ApiOperation({ summary: 'Пошук за id' })
  @ApiCookieAuth()
  @UseGuards(CookieAuthenticationGuard)
  @Get('id/:parentId')
  async findUserById(@Param('parentId') parentId: string) {
    const user = await this.parentService.findById(parentId);
    return { user };
  }
  @ApiCookieAuth()
  @UseGuards(CookieAuthenticationGuard)
  @Delete('/photo')
  async deletePhoto(@Req() request: RequestWithSession) {
    await this.parentService.deletePhoto(request.user.id);
  }
}

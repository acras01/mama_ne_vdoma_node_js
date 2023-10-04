import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guards';
import { ParentService } from 'src/parent/parent.service';
import { UpdateParentDto } from './dto/update-parent.dto';
import { UserData } from 'src/auth/decorators/get-user-from-jwt.decorator';
import { IJwtData } from '../shared/interfaces/jwt-data.interface';
import { UpdateGeoDto } from 'src/shared/dto/update-geo.dto';
import { DeleteParentDto } from './dto/delete-parent.dto';

@ApiTags('parent')
@Controller('parent')
export class ParentController {
  constructor(private readonly parentService: ParentService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch()
  @HttpCode(200)
  async updateParent(
    @Body() patchParentDto: UpdateParentDto,
    @UserData() data: IJwtData,
  ) {
    return await this.parentService.updateParent(patchParentDto, data.email);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch('geo')
  @HttpCode(200)
  async updateParentGeo(
    @Body() updateGeoDto: UpdateGeoDto,
    @UserData() jwtData: IJwtData,
  ) {
    return await this.parentService.updateGeoLocation(
      updateGeoDto,
      jwtData.email,
    );
  }

  @ApiOperation({summary:'В тестових цілях видалення будь якого акк по емейлу'})
  @Delete('/dev')
  async deleteParent(@Body() deleteParentDto: DeleteParentDto) {
    return await this.parentService.deleteParent(deleteParentDto.email);
  }

  @ApiBearerAuth()
  @ApiOperation({summary:'Видалення залогіненого аккаунта'})
  @UseGuards(AuthGuard)
  @Delete()
  async deleteMyAccount(@UserData() jwtData: IJwtData) {
    return await this.parentService.deleteAccount(jwtData.email);
  }
}

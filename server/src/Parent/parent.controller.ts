import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from 'src/auth/guards/auth.guards'
import { ParentService } from 'src/Parent/parent.service'
import { PatchParentDto } from './dto/patch-parent.dto'
import { UserData } from 'src/auth/decorators/get-user-from-jwt.decorator'
import { IJwtData } from '../shared/interfaces/jwt-data.interface'
import { UpdateGeoDto } from 'src/shared/dto/update-geo.dto'
import { DeleteParentDto } from './dto/delete-parent.dto'

@ApiTags('parent')
@Controller('parent')
export class ParentController {
  constructor (private readonly parentService: ParentService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch()
  @HttpCode(200)
  async updateParent (
    @Body() patchParentDto: PatchParentDto,
    @UserData() data: IJwtData,
  ) {
    return await this.parentService.updateParent(patchParentDto, data.email)
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch('geo')
  @HttpCode(200)
  async updateParentGeo (
    @Body() updateGeoDto: UpdateGeoDto,
    @UserData() jwtData: IJwtData,
  ) {
    return await this.parentService.updateGeoLocation(
      updateGeoDto,
      jwtData.email,
    )
  }

  
  @Delete()
  async deleteParent (@Body() deleteParentDto: DeleteParentDto) {
    return await this.parentService.deleteParent(deleteParentDto.email)
  }
}

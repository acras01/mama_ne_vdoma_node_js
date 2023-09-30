import {
  Body,
  Controller,
  HttpCode,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guards';
import { ParentService } from 'src/Parent/parent.service';
import { PatchParentDto } from './dto/patch-parent.dto';
import { UserData } from 'src/auth/decorators/get-user-from-jwt.decorator';
import { IJwtData } from '../shared/interfaces/jwt-data.interface';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('parent')
@Controller('parent')
export class ParentController {
  constructor(private readonly parentService: ParentService) {}

  @Patch()
  @HttpCode(200)
  async updateParent(
    @Body() patchParentDto: PatchParentDto,
    @UserData() data: IJwtData,
  ) {
    return await this.parentService.updateParent(patchParentDto, data.email);
  }
}

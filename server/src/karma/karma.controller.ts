import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { CookieAuthenticationGuard } from '../auth/guards/coockie.guard';
import { KarmaService } from './karma.service';
import { CreateKarmaDto } from './dto/create-karma.dto';
import RequestWithSession from 'src/auth/interfaces/req-with-session.interface';

@ApiTags('karma')
@ApiCookieAuth()
@Controller('karma')
@UseGuards(CookieAuthenticationGuard)
export class KarmaController {
  constructor(private readonly karmaService: KarmaService) {}
  @Get(':parentId')
  async getParentKarmas(@Param('parentId') parentId: string) {
    return await this.karmaService.getAllUserKarmas(parentId);
  }
  @Post(':parentId')
  async addKarma(
    @Param('parentId') parentId: string,
    @Req() request: RequestWithSession,
    @Body() createKarmaDto: CreateKarmaDto,
  ) {
    await this.karmaService.addUserKarma(
      request.user.id,
      parentId,
      createKarmaDto,
    );
  }
}

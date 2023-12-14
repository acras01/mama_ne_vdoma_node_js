import { NotificationsService } from './notifications.service';
import { Controller, Delete, Req, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CookieAuthenticationGuard } from 'src/auth/guards/coockie.guard';
import RequestWithSession from 'src/auth/interfaces/req-with-session.interface';

@ApiTags('notifications')
@ApiCookieAuth()
@UseGuards(CookieAuthenticationGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @ApiOperation({ summary: 'Delete all notifications' })
  @Delete()
  async deleteAllNotifications(@Req() request: RequestWithSession) {
    await this.notificationsService.deleteNotifications(request.user.id);
  }
}

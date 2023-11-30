import { NotificationsService } from './notifications.service';
import { Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CookieAuthenticationGuard } from 'src/auth/guards/coockie.guard';

@ApiTags('notifications')
@ApiCookieAuth()
@UseGuards(CookieAuthenticationGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @ApiOperation({ summary: 'Delete all notifications' })
  @Patch(':parentId')
  async deleteAllNotifications(@Param('parentId') parentId: string) {
    await this.notificationsService.deleteNotifications(parentId);
  }
}

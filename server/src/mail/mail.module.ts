import { Module, forwardRef } from '@nestjs/common';
import { nodemailerFactory } from './mail.provider';
import { ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';
import { ParentModule } from '../parent/parent.module';
import { ChildModule } from '../child/child.module';
import { GroupModule } from '../group/group.module';

@Module({
  imports: [
    forwardRef(() => ParentModule),
    forwardRef(() => ChildModule),
    forwardRef(() => GroupModule),
  ],
  providers: [
    {
      provide: 'mailer',
      useFactory: nodemailerFactory,
      inject: [ConfigService],
    },
    MailService,
  ],
  exports: [MailService],
})
export class MailModule {}

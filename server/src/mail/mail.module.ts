import { Module, forwardRef } from '@nestjs/common';
import { nodemailerFactory } from './mail.provider';
import { ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';
import { ParentModule } from 'src/parent/parent.module';
import { ChildModule } from 'src/child/child.module';

@Module({
  imports: [forwardRef(() => ParentModule), forwardRef(() => ChildModule)],
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

import { Inject, Injectable } from '@nestjs/common';
import { Transporter } from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { IEnv } from 'src/configs/env.config';
import { SendConfirmationEmail } from './dto/send-confrimation-email.dto';

@Injectable()
export class MailService {
  private readonly from: string;
  constructor(
    @Inject('mailer') private readonly mailer: Transporter,
    private readonly configService: ConfigService<IEnv>,
  ) {
    this.from = this.configService.get('SMTP_USER');
  }

  async sendConfirmationEmail(sendConfirmationEmail: SendConfirmationEmail) {
    const result = await this.mailer.sendMail({
      to: sendConfirmationEmail.email,
      from: this.from,
      text: sendConfirmationEmail.code,
      subject: 'Confirmation Email',
    });

    return result;
  }
}

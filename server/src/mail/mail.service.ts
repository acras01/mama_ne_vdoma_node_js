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
      html: `
      <head>
<body>
<div style="background-color: #FFF; max-width: 800px; margin: auto; padding: 20px;">
<p><a href="http://mommy-not-home.online/"><img src="https://static.wixstatic.com/media/ede167_9f3af53b548241b887b0eee913eec9ca~mv2.png" width="120" height="120" alt="" style="display: block; margin-left: auto; margin-right: auto;" /></a></p>
<h2 style="text-align: center;">Вітаємо вас у додатку "Мама не вдома"!</h2>
<p style="text-align: center;">На ваш запит надсилаємо вам одноразовий пароль для підтвердження вашого емейлу:</p>
<h3 style="text-align: center;">${sendConfirmationEmail.code}</h3>
<p style="text-align: center;"><span>Будь ласка, введіть цей пароль у вікно запиту в мобільному додатку для завершення реєстрації.</span><br /><em>Це автоматично створене системою повідомлення, вам не треба на нього відповідати.</em><span>&nbsp;</span></p>
<p style="text-align: center;"><span>Якщо це не ви реєструвались в мобільному додатку "Мама не вдома" - не хвилюйтеся, а просто не реагуйте на це повідомлення. Ми видалимо ваш емейл з нашої бази даних назавжди.</span></p>
</body>
</head>
`,
      subject: 'Confirmation Email',
    });
    return result;
  }

  async sendPasswordResetCode(sendConfirmationEmail: SendConfirmationEmail) {
    const result = await this.mailer.sendMail({
      to: sendConfirmationEmail.email,
      from: this.from,
      text: sendConfirmationEmail.code,
      subject: 'Password reset code',
    });

    return result;
  }
}

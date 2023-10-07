import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Transporter } from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { IEnv } from 'src/configs/env.config';
import { SendConfirmationEmail } from './dto/send-confrimation-email.dto';
import { ChildService } from '../child/child.service';
import { ParentService } from '../parent/parent.service';

@Injectable()
export class MailService {
  private readonly from: string;
  constructor(
    @Inject('mailer') private readonly mailer: Transporter,
    private readonly configService: ConfigService<IEnv>,
    @Inject(forwardRef(() => ChildService))
    private readonly childService: ChildService,
    @Inject(forwardRef(() => ParentService))
    private readonly parentService: ParentService,
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

  async sendGroupJoiningRequest(
    email: string,
    parentId: string,
    childId: string,
  ) {
    const parent = await this.parentService.findById(parentId);
    const childs = await this.childService.getChilds(parentId);
    const child = await this.childService.findChildById(childId);
    const result = await this.mailer.sendMail({
      to: email,
      from: this.from,
      html: `
      <head>
<body>
<div style="background-color: #FFF; max-width: 800px; margin: auto; padding: 20px;">
<p><a href="http://mommy-not-home.online/"><img src="https://static.wixstatic.com/media/ede167_9f3af53b548241b887b0eee913eec9ca~mv2.png" width="120" height="120" alt="" style="display: block; margin-left: auto; margin-right: auto;" /></a></p>
<h2 style="text-align: center;">Вам надійшов запит на приєднання нового учасника (нової учасниці) групи по долгяду за дітьми в додатку <a href="http://mommy-not-home.online/">"Мама не вдома":</a></h2>
<table border="0" style="border-collapse: collapse; width: 100%; height: 56px;">
<tbody>
<tr style="height: 10px;">
<td style="width: 25%; height: 10px;"><img src="${parent.avatar}" alt="user_avatar" width="120" height="120" style="display: block; margin-left: auto; margin-right: auto;" /></td>
<td style="width: 40%; height: 10px;">
<h2>${parent.name}</h2>
<p>${parent.email}</p>
</td>
<td style="width: 35%; height: 10px;"></td>
</tr>
<tr style="height: 10px;">
<td style="width: 25%; height: 10px;"></td>
<td style="width: 40%; height: 10px;">Кількість дітей:</td>
<td style="width: 35%; height: 10px;">${childs.length}</td>
</tr>
<tr style="height: 18px;">
<td style="width: 25%; height: 18px;"></td>
<td style="width: 40%; height: 18px;">Вік дітей</td>
<td style="width: 35%; height: 18px;">${child.age} років</td>
</tr>
<tr style="height: 18px;">
<td style="width: 25%; height: 18px;"></td>
<td style="width: 40%; height: 18px;">Телефон:</td>
<td style="width: 35%; height: 18px;">+${parent.countryCode} ${parent.phone}</td>
</tr>
</tbody>
</table>
<p></p>
<table border="0" style="border-collapse: collapse; width: 100%; height: 10px;">
<tbody>
<tr style="height: 10px;">
<td style="width: 40%; height: 10px; text-align: center;"><strong>Погодити запит користувача</strong></td>
<td style="width: 10%; height: 10px;"></td>
<td style="width: 40%; height: 10px; text-align: center;"><strong>Відхилити запит</strong></td>
</tr>
</tbody>
</table>
</body>
</head>
      `,
    });
  }
  async kickedFromGroupNotification(email: string, groupName: string) {
    const result = await this.mailer.sendMail({
      to: email,
      from: this.from,
      text: `Kicked from group ${groupName}`,
      subject: 'Kicked from group notification',
    });
    return result;
  }
}

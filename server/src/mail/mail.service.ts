import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Transporter } from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { IEnv } from 'src/configs/env.config';
import { SendConfirmationEmail } from './dto/send-confrimation-email.dto';
import { ChildService } from '../child/child.service';
import { ParentService } from '../parent/parent.service';
import { GroupService } from '../group/group.service';

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
    @Inject(forwardRef(() => GroupService))
    private readonly groupService: GroupService,
  ) {
    this.from = this.configService.get('SMTP_USER');
  }

  //TODO add queue and send mails throug queue

  async sendConfirmationEmail(sendConfirmationEmail: SendConfirmationEmail) {
    this.mailer.sendMail({
      to: sendConfirmationEmail.email,
      from: this.from,
      text: sendConfirmationEmail.code,
      html: `
      <head>
      <body>
      <div style="background-color: #FFF; max-width: 800px; margin: auto; padding: 20px;">
      <p><a href="https://mommy-not-home.online/"><img src="https://static.wixstatic.com/media/ede167_9f3af53b548241b887b0eee913eec9ca~mv2.png" width="120" height="120" alt="" style="display: block; margin-left: auto; margin-right: auto;" /></a></p>
      <h2 style="text-align: center;">Вітаємо вас у застосунку<a href="https://mommy-not-home.online/">"Мама не вдома"!</a></h2>
      <p style="text-align: center;">На ваш запит надсилаємо вам одноразовий пароль для підтвердження вашого емейлу:</p>
      <h3 style="text-align: center;">${sendConfirmationEmail.code}</h3>
      <p style="text-align: center;"><span>Будьласка, введіть цей пароль у вікно запиту в мобільному застосунку для завершення реєстрації.</span><br /><em>Це автоматично створене системою повідомлення, вам не треба на нього відповідати.</em><span>&nbsp;</span></p>
      <p style="text-align: center;"><span>Якщо це не ви реєструвались в мобільному застосунку "Мама не вдома" - не хвилюйтеся, та просто не реагуйте на це повідомлення. Ми видалимо ваш емейл з нашої бази даних назавжди.</span></p>
      </body>
      </head>
      
`,
      subject: 'Confirmation Email',
    });
  }

  async sendPasswordResetCode(sendConfirmationEmail: SendConfirmationEmail) {
    this.mailer.sendMail({
      to: sendConfirmationEmail.email,
      from: this.from,
      html: `
      <head>
      <body>
      <div style="background-color: #FFF; max-width: 800px; margin: auto; padding: 20px;">
      <p><a href="https://mommy-not-home.online/"><img src="https://static.wixstatic.com/media/ede167_9f3af53b548241b887b0eee913eec9ca~mv2.png" width="120" height="120" alt="" style="display: block; margin-left: auto; margin-right: auto;" /></a></p>
      <h2 style="text-align: center;">Знов раді бачити вас у застосунку <a href="https://mommy-not-home.online/">"Мама не вдома"!</a></h2>
      <p style="text-align: center;">Для відновлення вашого доступу в застосунок, надсилаємо вам цей одноразовий пароль:</p>
      <h3 style="text-align: center;">${sendConfirmationEmail.code}</h3>
      <p style="text-align: center;"><span>Будьласка, введіть цей пароль у вікно запиту в мобільному застосунку, а далі встановіть новий пароль для входу в застосунок.</span><br /><em>Це автоматично створене системою повідомлення, вам не треба на нього відповідати.</em><span>&nbsp;</span></p>
      <p style="text-align: center;"><span>Якщо це не ви намагаєтесь відновити пароль у мобільному застосунку "Мама не вдома" - не хвилюйтеся, та просто не реагуйте на це повідомлення. Ваш акаунт у безпеці!</span></p>
      </body>
      </head>            
      `,
      subject: 'Password reset code',
    });
  }

  async sendGroupJoiningRequest(
    email: string,
    parentId: string,
    childId: string,
  ) {
    const parent = await this.parentService.findById(parentId);
    if (!parent.sendingEmails) return;
    const childs = await this.childService.getChilds(parentId);
    const child = await this.childService.findChildById(childId);
    this.mailer.sendMail({
      to: email,
      from: this.from,
      html: `
      <head>
      <body>
      <div style="background-color: #FFF; max-width: 800px; margin: auto; padding: 20px;">
      <p><a href="https://mommy-not-home.online/"><img src="https://static.wixstatic.com/media/ede167_9f3af53b548241b887b0eee913eec9ca~mv2.png" width="120" height="120" alt="" style="display: block; margin-left: auto; margin-right: auto;" /></a></p>
      <h2 style="text-align: center;">Вам надійшов запит на приєднання нового учасника (нової учасниці) групи по долгяду за дітьми в застосунку <a href="https://mommy-not-home.online/">"Мама не вдома":</a></h2>
      <table border="0" style="border-collapse: collapse; width: 100%; height: 56px;">
      <tbody>
      <tr style="height: 10px;">
      <td style="width: 25%; height: 10px;"><img src="https://mommy-not-home.online/back/api/files/${
        parent.avatar
      }" alt="user_avatar" width="120" height="120" style="display: block; margin-left: auto; margin-right: auto;" /></td>
      <td style="width: 40%; height: 10px;">
      <h2>${parent.name ? parent.name.toUpperCase() : ''}</h2>
      <p>${parent.email}</p>
      </td>
      <td style="width: 35%; height: 10px;"></td>
      </tr>
      <tr style="height: 10px;">
      <td style="width: 25%; height: 10px;"></td>
      <td style="width: 40%; height: 10px;">${
        child.isMale ? 'Син:' : 'Донька:'
      }</td>
      <td style="width: 35%; height: 10px;">${child.age} років</td>
      </tr>
      <tr style="height: 18px;">
      <td style="width: 25%; height: 18px;"></td>
      <td style="width: 40%; height: 18px;">Телефон:</td>
      <td style="width: 35%; height: 18px;">${parent.countryCode} ${
        parent.phone
      }</td>
      </tr>
      </tbody>
      </table>
      <p style="text-align: center;"><span> Будь ласка, надайте відповідь користувачу у застосунку, відкривши його запит у приватних повідомленнях.</span><br /><em>Це автоматично створене системою повідомлення, вам не треба на нього відповідати.</em><span>&nbsp;</span></p>
      </body>
      </head>
      `,
    });
  }
  async kickedFromGroupNotification(email: string, groupId: string) {
    const parent = await this.parentService.findByEmail(email);
    if (!parent.sendingEmails) return;
    const group = await this.groupService.findById(groupId);
    this.mailer.sendMail({
      to: email,
      from: this.from,
      html: `
      <head>
      <body>
      <div style="background-color: #fff; max-width: 800px; margin: auto; padding: 20px;">
      <p><a href="https://mommy-not-home.online/"><img src="https://static.wixstatic.com/media/ede167_9f3af53b548241b887b0eee913eec9ca~mv2.png" width="120" height="120" alt="" style="display: block; margin-left: auto; margin-right: auto;" /></a></p>
      <h2 style="text-align: center;">Повідомляємо вас, що ви більше не є учасником наступної групи догляду за дітьми в застосунку &nbsp;<a href="https://mommy-not-home.online/">"Мама не вдома":</a></h2>
      <table border="0" style="border-collapse: collapse; width: 100%; height: 20px;">
      <tbody>
      <tr style="height: 10px;">
      <td style="width: 100%; height: 10px;">
      <div style="text-align: center;"><img src="https://static.wixstatic.com/media/ede167_fc3f1143b3b448e492def88f61d6cac5~mv2.jpg" width="800" height="233" alt="" /></div>
      </td>
      </tr>
      <tr style="height: 10px;">
      <td style="width: 100%; height: 10px; text-align: center;">ID групи: ${group.id}</td>
      </tr>
      <tr style="height: 0px;">
      <td style="width: 100%; height: 0px; text-align: center;">
      <h2>Назва групи: ${group.name}</h2>
      </td>
      </tr>
      <tr style="height: 0px;">
      <td style="width: 100%; height: 0px; text-align: center;">Вік дітей: ${group.ages} років</td>
      </tr>
      </tbody>
      </table>
      <p style="text-align: center;"><span> Ви можете пошукати інші групи у нашому мобільному застосунку та доєднатись до них, щоб вирішити проблему догляду за вашими дітьми. Це можна зробити у застосунку  <strong>Мама не вдома</strong> на вашому мобільному телефоні.</span><br /><em>Це автоматично створене системою повідомлення, вам не треба на нього відповідати.</em><span>&nbsp;</span></p>
      </div>
      </body>
      </head>
      `,
      subject: 'Kicked from group notification',
    });
  }

  async sendChangeEmailCode(email: string, code: string) {
    this.mailer.sendMail({
      to: email,
      from: this.from,
      text: `${code}`,
      subject: 'Change email request',
    });
  }

  async sendEmailChanged(email: string, oldEmail: string) {
    const parent = await this.parentService.findByEmail(email);
    if (!parent.sendingEmails) return;
    this.mailer.sendMail({
      to: oldEmail,
      from: this.from,
      html: `
      <head>
      <body>
      <div style="background-color: #fff; max-width: 800px; margin: auto; padding: 20px;">
      <p><a href="https://mommy-not-home.online/"><img src="https://static.wixstatic.com/media/ede167_9f3af53b548241b887b0eee913eec9ca~mv2.png" width="120" height="120" alt="" style="display: block; margin-left: auto; margin-right: auto;" /></a></p>
      <h2 style="text-align: center;">Повдомлення про зміну контактних даних у застосунку <a href="https://mommy-not-home.online/">"Мама не вдома":</a></h2>
      <p style="text-align: center;">Ваш логін (емейл) для доступу у застосунок щойно було змінено на наступний:</p>
      <h3 style="text-align: center;">${email}</h3>
      <p style="text-align: center;"><span>Якщо це зробили не ви - негайно дайте нам знати про це на адресу: <strong>app.mama.ne.vdoma@gmail.com</strong>.</span><br /><em>Це автоматично створене системою повідомлення, вам не треба на нього відповідати.</em><span>&nbsp;</span></p>
      <p style="text-align: center;"><span>Якщо ваш логін було змінено вами - просто не реагуйте на це повідомлення. Ваш акаунт у безпеці!</span></p>
      </div>
      </body>
      </head>
      `,
      subject: 'Email changed',
    });
  }

  async sendGroupInvitationReject(email: string, groupId: string) {
    const parent = await this.parentService.findByEmail(email);
    if (!parent.sendingEmails) return;
    const group = await this.groupService.findById(groupId);
    this.mailer.sendMail({
      to: email,
      from: this.from,
      html: `
      <head>
      <body>
      <div style="background-color: #fff; max-width: 800px; margin: auto; padding: 20px;">
      <p><a href="https://mommy-not-home.online/"><img src="https://static.wixstatic.com/media/ede167_9f3af53b548241b887b0eee913eec9ca~mv2.png" width="120" height="120" alt="" style="display: block; margin-left: auto; margin-right: auto;" /></a></p>
      <h2 style="text-align: center;">Нажаль, адміністратором групи було відхилено ваш запит на приєднання до наступної групи:</h2>
      <table border="0" style="border-collapse: collapse; width: 100%; height: 20px;">
      <tbody>
      <tr style="height: 10px;">
      <td style="width: 100%; height: 10px; text-align: center;">ID групи: ${group.id}</td>
      </tr>
      <tr style="height: 0px;">
      <td style="width: 100%; height: 0px; text-align: center;">
      <h2>Назва групи: ${group.name}</h2>
      </td>
      </tr>
      <tr style="height: 0px;">
      <td style="width: 100%; height: 0px; text-align: center;">Вік дітей: ${group.ages} років</td>
      </tr>
      </tbody>
      </table>
      <p style="text-align: center;"><span> Запрошуємо вас пошукати та приєднатись до іншої групи догляду за дітьми у вашрму районі!</span><br /><em>Це автоматично створене системою повідомлення, вам не треба на нього відповідати.</em><span>&nbsp;</span></p>
      </div>
      </body>
      </head>
      `,
      subject: 'Rejecting group request',
    });
  }

  async sendGroupInvitationAccept(email: string, groupId: string) {
    const parent = await this.parentService.findByEmail(email);
    if (!parent.sendingEmails) return;
    const group = await this.groupService.findById(groupId);
    this.mailer.sendMail({
      to: email,
      from: this.from,
      html: `
      <head>
      <body>
      <div style="background-color: #fff; max-width: 800px; margin: auto; padding: 20px;">
      <p><a href="https://mommy-not-home.online/"><img src="https://static.wixstatic.com/media/ede167_9f3af53b548241b887b0eee913eec9ca~mv2.png" width="120" height="120" alt="" style="display: block; margin-left: auto; margin-right: auto;" /></a></p>
      <h2 style="text-align: center;">Вітаємо! Адміністратор схвалив ваш запит на приєднання до групи догляду за дітьми у застосунку&nbsp;<a href="https://mommy-not-home.online/">"Мама не вдома":</a></h2>
      <table border="0" style="border-collapse: collapse; width: 100%; height: 20px;">
      <tbody>
      <tr style="height: 10px;">
      <td style="width: 100%; height: 10px; text-align: center;">ID групи: ${group.id}</td>
      </tr>
      <tr style="height: 0px;">
      <td style="width: 100%; height: 0px; text-align: center;">
      <h2>Назва групи: ${group.name}</h2>
      </td>
      </tr>
      <tr style="height: 0px;">
      <td style="width: 100%; height: 0px; text-align: center;">Вік дітей: ${group.ages} років</td>
      </tr>
      </tbody>
      </table>
      <p style="text-align: center;"><span> Тепер у застосунку ви можете отримати доступ до контактних даних інших мам в цій групі, щоб організувати спільний догляд за вашими дітьми.</span><br /><em>Це автоматично створене системою повідомлення, вам не треба на нього відповідати.</em><span>&nbsp;</span></p>
      </div>
      </body>
      </head>
            `,
      subject: 'Accepting group request',
    });
  }

  async groupCreatedNotification(email: string, groupId: string) {
    const parent = await this.parentService.findByEmail(email);
    if (!parent.sendingEmails) return;
    const group = await this.groupService.findById(groupId);
     this.mailer.sendMail({
      to: email,
      from: this.from,
      html: `
      <head>
      <body>
      <div style="background-color: #fff; max-width: 800px; margin: auto; padding: 20px;">
      <p><a href="https://mommy-not-home.online/"><img src="https://static.wixstatic.com/media/ede167_9f3af53b548241b887b0eee913eec9ca~mv2.png" width="120" height="120" alt="" style="display: block; margin-left: auto; margin-right: auto;" /></a></p>
      <h2 style="text-align: center;">Вітаємо! Ви успішно створили нову групу догляду за дітьми у застосунку&nbsp;<a href="https://mommy-not-home.online/">"Мама не вдома":</a></h2>
      <table border="0" style="border-collapse: collapse; width: 100%; height: 20px;">
      <tbody>
      </tr>
      <tr style="height: 10px;">
      <td style="width: 100%; height: 10px; text-align: center;"><strong>ID групи:</strong> ${group.id}</td>
      </tr>
      <tr style="height: 0px;">
      <td style="width: 100%; height: 0px; text-align: center;">
      <h2>Назва групи: ${group.name}</h2>
      </td>
      </tr>
      <tr style="height: 0px;">
      <td style="width: 100%; height: 0px; text-align: center;"><strong>Вік дітей:</strong> ${group.ages} років</td>
      </tr>
      <tr style="height: 0px;">
      <td style="width: 100%; height: 0px; text-align: center;"><strong>Опис групи:</strong></td>
      </tr>
      <tr style="height: 0px;">
      <td style="width: 100%; height: 0px; text-align: center;">${group.desc}</td>
      </tr>
      </tbody>
      </table>
      <p style="text-align: center;"><span> Тепер ваша група буде відображатись іншим користувачам вашого району у результатах іх пошуків, щоб вони могли приєднатись до вас та організувати спільний догляд за дітьми. Повідомляємо також, що вас призначено Адміністратором цієї групи. </span><br /><em>Це автоматично створене системою повідомлення, вам не треба на нього відповідати.</em><span>&nbsp;</span></p>
      </div>
      </body>
      </head>      
`,
      subject: 'Accepting group request',
    });
  }

  async adminTransferNotification(email: string, groupId: string) {
    const parent = await this.parentService.findByEmail(email);
    if (!parent.sendingEmails) return;
    const group = await this.groupService.findById(groupId);
    this.mailer.sendMail({
      to: email,
      from: this.from,
      html: `
      <head>
      <body>
      <div style="background-color: #fff; max-width: 800px; margin: auto; padding: 20px;">
      <p><a href="https://mommy-not-home.online/"><img src="https://static.wixstatic.com/media/ede167_9f3af53b548241b887b0eee913eec9ca~mv2.png" width="120" height="120" alt="" style="display: block; margin-left: auto; margin-right: auto;" /></a></p>
      <h2 style="text-align: center;">Вас призначено адміністратором наступної групи догляду за дітьми в застосунку &nbsp;<a href="https://mommy-not-home.online/">"Мама не вдома":</a></h2>
      <table border="0" style="border-collapse: collapse; width: 100%; height: 20px;">
      <tbody>
      <tr style="height: 10px;">
      <td style="width: 100%; height: 10px;">
      <div style="text-align: center;"><img src="https://static.wixstatic.com/media/ede167_fc3f1143b3b448e492def88f61d6cac5~mv2.jpg" width="800" height="233" alt="" /></div>
      </td>
      </tr>
      <tr style="height: 10px;">
      <td style="width: 100%; height: 10px; text-align: center;">ID групи: ${group.id}</td>
      </tr>
      <tr style="height: 0px;">
      <td style="width: 100%; height: 0px; text-align: center;">
      <h2>Назва групи: ${group.name}</h2>
      </td>
      </tr>
      <tr style="height: 0px;">
      <td style="width: 100%; height: 0px; text-align: center;">Вік дітей: ${group.ages} років</td>
      </tr>
      </tbody>
      </table>
      <p style="text-align: center;"><span> Тепер ви можете погоджувати доєднання нових учасників цієї групи та керувати її іншими налаштуваннями. Це можна зробити у застосунку <strong>Мама не вдома</strong> на вашому мобільному телефоні.</span>
      <br/><em>Це автоматично створене системою повідомлення, вам не треба на нього відповідати.</em><span>&nbsp;</span></p>
      </div>
      </body>
      </head>
      `,
      subject: 'Group admin transfer',
    });
  }
}

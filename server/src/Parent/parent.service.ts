import { InjectModel } from '@m8a/nestjs-typegoose';
import { Parent } from './models/parent.model';
import { ReturnModelType } from '@typegoose/typegoose';
import * as bcrypt from 'bcrypt';
import { CreateParentDto } from './dto/create-parent.dto';
import { MailService } from '../mail/mail.service';
import { ConfirmAccountDto } from './dto/confirm-account.dto';
import { BadRequestException } from '@nestjs/common';

export class ParentService {
  constructor(
    @InjectModel(Parent)
    private readonly parentModel: ReturnModelType<typeof Parent>,
    private readonly mailService: MailService,
  ) {}

  async createParent(createParentDto: CreateParentDto) {
    const hash = await bcrypt.hash(createParentDto.password, 10);
    const activationCode = String(this.generateFourDigitCode());
    await this.parentModel.create({
      password: hash,
      email: createParentDto.email,
      activationCode,
    });
    const res = await this.mailService.sendConfirmationEmail({
      code: activationCode,
      email: createParentDto.email,
    });
    console.log(res);
  }

  async confirmAccountByCode(confirmAccountDto: ConfirmAccountDto) {
    const parent = await this.parentModel.findOne({
      email: confirmAccountDto.email,
    });
    if (parent.activationCode !== confirmAccountDto.code) {
      throw new BadRequestException('Wrong code');
    }
    parent.isConfirmed = true;
    await parent.save();
    return true;
  }

  private generateFourDigitCode() {
    const randomNumber = Math.floor(Math.random() * 9000) + 1000;
    return randomNumber;
  }
}

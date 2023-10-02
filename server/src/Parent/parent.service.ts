import { InjectModel } from '@m8a/nestjs-typegoose';
import { Parent } from './models/parent.model';
import { ReturnModelType } from '@typegoose/typegoose';
import * as bcrypt from 'bcrypt';
import { CreateParentDto } from './dto/create-parent.dto';
import { MailService } from '../mail/mail.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PatchParentDto } from './dto/patch-parent.dto';
import { ConfirmEmailDto } from '../auth/dto/confirm-email.dto';
import { UpdateGeoDto } from '../shared/dto/update-geo.dto';
import { ResetPasswordDto } from '../mail/dto/reset-password.dto';

export class ParentService {
  constructor(
    @InjectModel(Parent)
    private readonly parentModel: ReturnModelType<typeof Parent>,
    private readonly mailService: MailService,
  ) {}

  async findByEmail(email: string) {
    const findedDoc = await this.parentModel.findOne({ email });
    if (findedDoc === null) throw new NotFoundException('Email not found');
    return findedDoc;
  }

  async findById(id: string) {
    const findedDoc = await this.parentModel.findById({ id });
    if (findedDoc === null) throw new NotFoundException('Not Found');
    return findedDoc;
  }

  async findFullInfoByEmail(email: string) {
    const findedDoc = await this.parentModel
      .findOne({ email })
      .populate([
        'password',
        'activationCode',
        'passwordResetCode',
        'passwordResetCodeExpire',
      ]);
    if (findedDoc === null) throw new NotFoundException('Email not found');
    return findedDoc;
  }

  async createParent(createParentDto: CreateParentDto) {
    const hash = await bcrypt.hash(createParentDto.password, 10);
    const activationCode = String(this.generateFourDigitCode());
    await this.parentModel.create({
      password: hash,
      email: createParentDto.email,
      activationCode,
    });
    await this.mailService.sendConfirmationEmail({
      code: activationCode,
      email: createParentDto.email,
    });
    return true;
  }

  async confirmAccountByCode(confirmEmailDto: ConfirmEmailDto) {
    const parent = await this.findFullInfoByEmail(confirmEmailDto.email);
    if (parent.activationCode !== confirmEmailDto.code) {
      throw new BadRequestException('Wrong code');
    }
    parent.isConfirmed = true;
    parent.activationCode = '';
    await parent.save();
    return true;
  }

  async updateGeoLocation(updateGeoDto: UpdateGeoDto, email: string) {
    const parent = await this.findByEmail(email);
    await parent.updateOne({
      location: {
        type: 'Point',
        coordinates: [updateGeoDto.lon, updateGeoDto.lat],
      },
    });
  }

  async sendPasswordCode(email: string) {
    const parent = await this.parentModel.findOne({ email });
    if (!parent) return;
    if (!parent.isConfirmed) return;
    const code = String(this.generateFourDigitCode());
    const date = new Date();
    date.setMinutes(date.getMinutes() + 30);
    await this.mailService.sendPasswordResetCode({ code, email });
    parent.passwordResetCode = code;
    parent.passwordResetCodeExpire = date;
    await parent.save();
    return;
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const parent = await this.findFullInfoByEmail(resetPasswordDto.email);
    if (Date.now() > parent.passwordResetCodeExpire.getTime()) {
      throw new BadRequestException('Expired code');
    }
    if (parent.passwordResetCode !== resetPasswordDto.code)
      throw new BadRequestException('Wrong code');
    const hash = await bcrypt.hash(resetPasswordDto.password, 10);
    parent.password = hash;
    parent.passwordResetCode = '';
    await parent.save();
  }

  async updateParent(patchParentDto: PatchParentDto, email: string) {
    const parent = await this.findByEmail(email);
    await parent.updateOne(patchParentDto);
    return await this.findByEmail(email);
  }

  async deleteParent(email: string) {
    // todo add security
    const parent = await this.parentModel.findOne({ email });
    if (parent === null) {
      return false;
    } else {
      await parent.deleteOne();
      return true;
    }
  }

  private generateFourDigitCode() {
    const randomNumber = Math.floor(Math.random() * 9000) + 1000;
    return randomNumber;
  }
}

import { InjectModel } from '@m8a/nestjs-typegoose';
import { Parent } from './models/parent.model';
import { ReturnModelType } from '@typegoose/typegoose';
import * as bcrypt from 'bcrypt';
import { CreateParentDto } from './dto/create-parent.dto';
import { MailService } from '../mail/mail.service';
import {
  BadRequestException,
  Inject,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { UpdateParentDto } from './dto/update-parent.dto';
import { ConfirmEmailDto } from '../auth/dto/confirm-email.dto';
import { UpdateGeoDto } from '../shared/dto/update-geo.dto';
import { ResetPasswordDto } from '../mail/dto/reset-password.dto';
import { ResendCodeDto } from '../auth/dto/resend-code.dto';
import { ChildService } from '../child/child.service';
import { GroupService } from '../group/group.service';
import { BackblazeService } from '../backblaze/backblaze.service';

export class ParentService {
  constructor(
    @InjectModel(Parent)
    private readonly parentModel: ReturnModelType<typeof Parent>,
    @Inject(forwardRef(() => ChildService))
    private childService: ChildService,
    @Inject(forwardRef(() => MailService))
    private mailService: MailService,
    @Inject(forwardRef(() => GroupService))
    private groupService: GroupService,
    private readonly backblazeService: BackblazeService,
  ) {}

  async findByEmail(email: string) {
    const findedDoc = await this.parentModel.findOne({ email });
    if (findedDoc === null) throw new NotFoundException('Email not found');
    return findedDoc;
  }

  async findByNickName(nick: string) {
    const findedDoc = await this.parentModel.findOne({ name: nick });
    if (findedDoc === null) throw new NotFoundException('Account not found');
    return findedDoc;
  }

  async isEmailAvaliable(email: string) {
    const findedDoc = await this.parentModel.findOne({ email });
    return !Boolean(findedDoc);
  }

  async findById(id: string) {
    const findedDoc = await this.parentModel.findById(id);
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
        'newEmail',
        'changeEmailCode',
        'changeEmailCodeExpire',
      ]);
    if (findedDoc === null) throw new NotFoundException('Email not found');
    return findedDoc;
  }

  async sendConfirmationEmail(resendCodeDto: ResendCodeDto) {
    const activationCode = String(this.generateFourDigitCode());
    const parent = await this.findFullInfoByEmail(resendCodeDto.email);
    parent.activationCode = activationCode;
    await this.mailService.sendConfirmationEmail({
      code: activationCode,
      email: resendCodeDto.email,
    });
    await parent.save();
  }

  async createParent(createParentDto: CreateParentDto) {
    const hash = await bcrypt.hash(createParentDto.password, 10);
    await this.parentModel.create({
      password: hash,
      email: createParentDto.email,
      isConfirmed: false,
    });
    await this.sendConfirmationEmail({ email: createParentDto.email });
    return true;
  }

  async getChildsByAccount(parent: string) {
    const childs = await this.childService.getChilds(parent);
    return childs;
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

  async sendChangeEmailCode(parentId: string, email: string) {
    const parent = await this.findById(parentId);
    if (!parent) return;
    if (!parent.isConfirmed) return;
    const code = String(this.generateFourDigitCode());
    const date = new Date();
    date.setMinutes(date.getMinutes() + 30);
    await this.mailService.sendChangeEmailCode(email, code);
    parent.newEmail = email;
    parent.changeEmailCode = code;
    parent.changeEmailCodeExpire = date;
    await parent.save();
    return;
  }

  async changeEmail(email: string, code: string) {
    const parent = await this.findFullInfoByEmail(email);
    if (Date.now() > parent.changeEmailCodeExpire.getTime()) {
      throw new BadRequestException('Expired code');
    }
    if (parent.changeEmailCode !== code)
      throw new BadRequestException('Wrong code');
    parent.email = parent.newEmail;
    parent.changeEmailCode = '';
    await parent.save();
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

  async updateParent(patchParentDto: UpdateParentDto, email: string) {
    if (patchParentDto.avatar) {
      await this.backblazeService.getFileInfo(patchParentDto.avatar);
    }
    const parent = await this.findByEmail(email);
    if (parent.avatar) {
      await this.backblazeService.deleteFile(parent.avatar);
    }
    await parent.updateOne(patchParentDto);
    return await this.findByEmail(email);
  }

  async deleteParent(email: string) {
    // todo add security
    const parent = await this.parentModel.findOne({ email });
    if (parent === null) {
      return false;
    } else {
      await this.deleteAccount(parent.email);
      return true;
    }
  }

  async deleteAccount(email: string) {
    const parent = await this.findByEmail(email);
    if (parent.avatar) await this.backblazeService.deleteFile(parent.avatar);
    await this.groupService.cleanUpAfterDeleteParent(parent.id);
    await this.childService.deleteChilds(parent.id);
    await parent.deleteOne();
    return true;
  }

  private generateFourDigitCode() {
    const randomNumber = Math.floor(Math.random() * 9000) + 1000;
    return randomNumber;
  }
}

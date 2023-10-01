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

  async findFullInfoByEmail(email: string) {
    const findedDoc = await this.parentModel
      .findOne({ email })
      .populate(['password', 'activationCode']);
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
    await parent.updateOne({ location: { type: 'Point', coordinates: [updateGeoDto.lon, updateGeoDto.lat] } });
    // console.log(parent.location);
    // parent.location.type = 'Point';
    // parent.location.coordinates = ;
    // console.log(parent);
    // await parent.save();
  }

  async updateParent(patchParentDto: PatchParentDto, email: string) {
    const parent = await this.findByEmail(email);
    await parent.updateOne(patchParentDto);
    return await this.findByEmail(email);
  }

  private generateFourDigitCode() {
    const randomNumber = Math.floor(Math.random() * 9000) + 1000;
    return randomNumber;
  }
}

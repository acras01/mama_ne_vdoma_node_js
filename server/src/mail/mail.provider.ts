import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { IEnv } from 'src/configs/env.config';

export const nodemailerFactory = async (configService: ConfigService<IEnv>) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: configService.get('SMTP_USER'),
      pass: configService.get('SMTP_PASSWORD'),
    },
  });
  return transporter;
};

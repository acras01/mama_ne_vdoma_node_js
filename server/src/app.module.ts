import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypegooseModule } from '@m8a/nestjs-typegoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { envValidationSchea } from './configs/env.config';
import { getMongoConfig } from './configs/mongoose.config';
import { ParentModule } from './parent/parent.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { getJwtConfig } from './configs/jwt.config';
import { MailModule } from './mail/mail.module';
import { ChildModule } from './child/child.module';
import { APP_FILTER } from '@nestjs/core';
import { ErrorMessageToArrayFilter } from './shared/filters/error-message-to-array.filter';
import { MongoCastErrorFilter } from './shared/filters/mongo-objectId-cast.filter';
import { GroupModule } from './group/group.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchea,
    }),
    TypegooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getMongoConfig,
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: getJwtConfig,
      global: true,
    }),
    ParentModule,
    AuthModule,
    MailModule,
    ChildModule,
    GroupModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: ErrorMessageToArrayFilter,
    },
    { provide: APP_FILTER, useClass: MongoCastErrorFilter },
  ],
})
export class AppModule {}

import { TypegooseModule } from '@m8a/nestjs-typegoose';
import { Module, forwardRef } from '@nestjs/common';
import { ParentModule } from 'src/parent/parent.module';
import { Child } from './models/child.model';
import { ChildController } from './child.controller';
import { ChildService } from './child.service';

@Module({
  imports: [
    forwardRef(() => ParentModule),
    TypegooseModule.forFeature([Child]),
  ],
  controllers: [ChildController],
  providers: [ChildService],
  exports: [ChildService],
})
export class ChildModule {}

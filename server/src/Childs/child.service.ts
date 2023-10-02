import { InjectModel } from '@m8a/nestjs-typegoose';
import { Injectable } from '@nestjs/common';
import { Child } from './models/child.model';
import { ReturnModelType } from '@typegoose/typegoose';
import { ParentService } from 'src/Parent/parent.service';
import { Parent } from '../Parent/models/parent.model';
import { CreateChildDto } from './dto/create-child.dto';
import { Types } from 'mongoose';

@Injectable()
export class ChildService {
  constructor(
    @InjectModel(Child)
    private readonly childModel: ReturnModelType<typeof Child>,
    private readonly parentService: ParentService,
  ) {}

  async getChilds(parent: string) {
    console.log(parent);
    const childs = await this.childModel.find({ parentId: parent });
    return childs;
  }

  async addChild(createChildDto: CreateChildDto, parent: string) {
    console.log(parent);
    const child = await this.childModel.create({
      ...createChildDto,
      parentId: parent,
    });
    return child;
  }
}

import { InjectModel } from '@m8a/nestjs-typegoose';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Child } from './models/child.model';
import { ReturnModelType } from '@typegoose/typegoose';
import { CreateChildDto } from './dto/create-child.dto';
import { UpdateChildDto } from './dto/update-child.dto';

@Injectable()
export class ChildService {
  constructor(
    @InjectModel(Child)
    private readonly childModel: ReturnModelType<typeof Child>,
  ) {}

  async getChilds(parent: string) {
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

  async findChildById(id: string) {
    const findedDoc = await this.childModel.findById(id);
    if (findedDoc === null) throw new NotFoundException('Not Found');
    return findedDoc;
  }

  async updateChild(
    updateChildDto: UpdateChildDto,
    id: string,
    parentId: string,
  ) {
    const child = await this.findChildById(id);
    if (child.parentId !== parentId) throw new ForbiddenException();
    await child.updateOne(updateChildDto);
    return await this.findChildById(id);
  }

  async deleteChild(id: string, parentId: string) {
    const child = await this.findChildById(id);
    if (child.parentId !== parentId) throw new ForbiddenException();
    await child.deleteOne();
    return true;
  }

  async deleteChilds(parentId: string) {
    const result = await this.childModel.deleteMany({ parentId });
    return result;
  }
}

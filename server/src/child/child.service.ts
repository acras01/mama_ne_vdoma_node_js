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
import { childNotFound, notaParentOfThisChild } from './utils/errors';

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
    const child = await this.childModel.create({
      ...createChildDto,
      parentId: parent,
    });
    return child;
  }

  async findChildById(id: string) {
    const findedDoc = await this.childModel.findById(id);
    if (findedDoc === null) throw new NotFoundException(childNotFound);
    return findedDoc;
  }

  async updateChild(
    updateChildDto: UpdateChildDto,
    id: string,
    parentId: string,
  ) {
    const child = await this.findChildById(id);
    if (child.parentId !== parentId)
      throw new ForbiddenException(notaParentOfThisChild);
    await child.updateOne(updateChildDto);
    return await this.findChildById(id);
  }

  async deleteChild(id: string, parentId: string) {
    const child = await this.findChildById(id);
    if (child.parentId !== parentId)
      throw new ForbiddenException(notaParentOfThisChild);
    await child.deleteOne();
    return true;
  }

  async findMany(ids: string[]) {
    const childrens = await this.childModel.find().where('_id').in(ids).exec();
    const responseIds = childrens.map((item) => item._id.toString());

    for (const id of ids) {
      if (!responseIds.includes(id)) {
        throw new NotFoundException(`Children ID ${id} not found`);
      }
    }
    return childrens;
  }

  async deleteChilds(parentId: string) {
    const result = await this.childModel.deleteMany({ parentId });
    return result;
  }
}

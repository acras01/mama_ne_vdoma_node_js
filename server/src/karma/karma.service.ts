import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { KarmaRepository } from './karma.repository';
import { Karma } from './karma.model';
import { InjectModel } from '@m8a/nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { CreateKarmaDto } from './dto/create-karma.dto';
import { GroupService } from '../group/group.service';
import { ParentService } from '../parent/parent.service';

@Injectable()
export class KarmaService {
  constructor(
    private readonly karmaRepository: KarmaRepository,
    @InjectModel(Karma)
    private readonly karmaModel: ReturnModelType<typeof Karma>,
    @Inject(forwardRef(() => GroupService))
    private readonly groupService: GroupService,
    @Inject(forwardRef(() => ParentService))
    private readonly parentService: ParentService,
  ) {}

  async addUserKarma(
    fromId: string,
    toId: string,
    createKarmaDto: CreateKarmaDto,
  ) {
    await this.parentService.findById(toId);
    if (!(await this.groupService.isHaveSharedGroups(fromId, toId))) {
      throw new BadRequestException('Не має спільних груп');
    }
    await this.karmaModel.create({ fromId, toId, ...createKarmaDto });
    await this.karmaRepository.delete(toId);
  }

  async getUserKarma(userId: string) {
    const cache = await this.karmaRepository.get(userId);
    if (cache) return Number(cache);
    const avgRate = await this.calculateAvgKarma(userId);
    await this.karmaRepository.set(userId, String(avgRate));
    return avgRate;
  }

  async calculateAvgKarma(userId: string) {
    const rates = await this.getAllUserKarmas(userId);
    const avg = (
      rates.reduce((acc, v) => acc + v.grade, 0) / rates.length
    ).toFixed(1);
    return Number(avg) || 0;
  }

  async getAllUserKarmas(userId: string) {
    const rates = await this.karmaModel.find({ toId: userId });
    return rates;
  }
}

import { Injectable } from '@nestjs/common';
import { KarmaRepository } from './karma.repository';
import { Karma } from './karma.model';
import { InjectModel } from '@m8a/nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';

@Injectable()
export class KarmaService {
  constructor(
    private readonly karmaRepository: KarmaRepository,
    @InjectModel(Karma)
    private readonly karmaModel: ReturnModelType<typeof Karma>,
  ) {}

  async addUserRate(fromId: string, toId: string, rate: number) {
    if (rate > 5 || rate < 0) {
      throw new Error('wrong rate');
    }
    await this.karmaModel.create({ fromId, toId, rate });
    await this.karmaRepository.delete(toId);
  }

  async getUserKarma(userId: string) {
    const cache = await this.karmaRepository.get(userId);
    if (cache) return Number(cache);
    const avgRate = await this.calculateAvgRate(userId);
    await this.karmaRepository.set(userId, String(avgRate));
    return avgRate;
  }

  async calculateAvgRate(userId: string) {
    const rates = await this.getAllUserRates(userId);
    const avg = rates.reduce((a, b) => Number(a) + Number(b), 0) / rates.length;
    return avg || 0;
  }

  async getAllUserRates(userId: string) {
    const rates = await this.karmaModel.find({ toId: userId });
    return rates;
  }
}

import { Injectable } from '@nestjs/common';
import { RedisRepository } from './karma.repository';

@Injectable()
export class KarmaService {
  constructor(private readonly redisRepository: RedisRepository) {}
  async getUserKarma(userId: string) {
    const cache = await this.redisRepository.get('user', userId);
    if (!cache) {
    
    }
  }
}

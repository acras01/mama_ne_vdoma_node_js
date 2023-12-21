import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class KarmaRepository implements OnModuleDestroy {
  private basePrefix;
  constructor(@Inject('RedisClient') private readonly redisClient: Redis) {
    this.basePrefix = 'user_karma';
  }

  onModuleDestroy(): void {
    this.redisClient.quit();
  }

  async get(key: string): Promise<string | null> {
    return this.redisClient.get(`${this.basePrefix}:${key}`);
  }

  async set(key: string, value: string): Promise<void> {
    await this.redisClient.set(`${this.basePrefix}:${key}`, value);
  }

  async delete(key: string): Promise<void> {
    await this.redisClient.del(`${this.basePrefix}:${key}`);
  }
}

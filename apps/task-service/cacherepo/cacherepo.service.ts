import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { GetAllTaskRequestDto } from '../src/dto/get-all-task.dto';

const TWO_HOURS_IN_SECODS = 7200;

@Injectable()
export class CacheRepoService {
  private readonly redisClient: Redis;
  private readonly logger = new Logger(CacheRepoService.name);

  constructor() {
      const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
      this.redisClient = new Redis(redisUrl, {});
  }

  async set(key: string, value: any, ttl: number = TWO_HOURS_IN_SECODS): Promise<void> {
    await this.redisClient.setex(key, ttl, JSON.stringify(value));
  }

  async get(key: string): Promise<any | null> {
    const result = await this.redisClient.get(key);
    if(!result) {
      return null;
    }
    return JSON.parse(result)
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.redisClient.exists(key);
    return result === 1;
  }

  async delete(key: string): Promise<boolean> {
    const result = await this.redisClient.del(key);
    return result > 0;
  }

  async deleteByPattern(pattern: string): Promise<void> {
    let cursor = '0';

    do {
      const [nextCursor, keys] = await this.redisClient.scan(cursor, 'MATCH', pattern);
      cursor = nextCursor;

      if (keys.length) {
        await this.redisClient.del(...keys);
      }
    } while (cursor !== '0');
  }

  getSingleTaskCacheKey(userId: string, taskId: string): string {
    return `task:userId=${userId}:taskId=${taskId}`;
  }

  getAllTaskCacheKey(userId: string, getAllTaskDto: GetAllTaskRequestDto): string {
    const { 
      page,
      limit,
      order,
      status,
      search,
     } = getAllTaskDto;
    return `tasks:userId=${userId ?? 'null'}:page=${page ?? ''}:limit=${limit ?? ''}:order=${order ?? ''}:status=${status ?? ''}:search=${search ?? ''}`;
  }

  userCacheKeyPatterns(userId: string): string {
    return `tasks:userId=${userId}:*`;
  }

}

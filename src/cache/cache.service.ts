import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  // eslint-disable-next-line @typescript-eslint/ban-types
  async get(key: string, functionToStore: Function): Promise<any> {
    const value = await this.cacheManager.get(key);
    if (value) {
      return value;
    } else {
      const result = await functionToStore();
      await this.cacheManager.set(key, result);
      return result;
    }
  }

  async del(key: string): Promise<any> {
    return this.cacheManager.del(key);
  }

  async clearAllCache(): Promise<void> {
    return this.cacheManager.reset();
  }
}

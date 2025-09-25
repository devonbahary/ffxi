import { RedisQueue as BaseRedisQueue } from '@ffxi/redis';

export class RedisQueue extends BaseRedisQueue {
  // Cooldown functionality for rate limiting (processing-specific)
  async setCooldown(key: string, durationSeconds: number): Promise<void> {
    await this.client.setEx(key, durationSeconds, 'cooldown');
    console.log(`Set cooldown key ${key} for ${durationSeconds} seconds`);
  }

  async isCooldownActive(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result === 1;
  }

  async getCooldownTTL(key: string): Promise<number> {
    return await this.client.ttl(key);
  }

  // Override pushUrls to use simpler version without logging (processing-specific)
  async pushUrls(urls: string[]): Promise<number> {
    if (urls.length === 0) return 0;
    return await this.client.sAdd(this.queueName, urls);
  }
}

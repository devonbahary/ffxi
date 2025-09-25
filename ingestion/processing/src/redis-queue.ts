import { createClient, RedisClientType } from 'redis';

export class RedisQueue {
  private client: RedisClientType;
  private queueName: string;

  constructor(queueName = 'bg-wiki-urls', redisUrl?: string) {
    this.queueName = queueName;
    this.client = createClient({
      url: redisUrl || process.env.REDIS_URL || 'redis://localhost:6379',
    });

    this.client.on('error', err => {
      console.error('Redis Client Error:', err);
    });
  }

  async connect(): Promise<void> {
    if (!this.client.isOpen) {
      await this.client.connect();
    }
  }

  async disconnect(): Promise<void> {
    if (this.client.isOpen) {
      await this.client.disconnect();
    }
  }

  async popUrl(): Promise<string | null> {
    const url = await this.client.sPop(this.queueName);
    return typeof url === 'string' ? url : null;
  }

  async getQueueSize(): Promise<number> {
    return await this.client.sCard(this.queueName);
  }

  // Cooldown functionality for rate limiting
  async setCooldown(key: string, durationSeconds: number): Promise<void> {
    await this.client.setEx(key, durationSeconds, 'cooldown');
    console.log(`Set cooldown key ${key} for ${durationSeconds} seconds`);
  }

  async pushUrls(urls: string[]): Promise<number> {
    if (urls.length === 0) return 0;
    return await this.client.sAdd(this.queueName, urls);
  }

  async isCooldownActive(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result === 1;
  }

  async getCooldownTTL(key: string): Promise<number> {
    return await this.client.ttl(key);
  }
}

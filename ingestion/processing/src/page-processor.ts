import axios, { AxiosError } from 'axios';
import { HtmlCleaner } from './html-cleaner';
import { RateLimiter } from './rate-limiter';
import { RedisQueue } from './redis-queue';
import { BgWikiPageRepository, initializeDatabase } from '@ffxi/sql';

export class PageProcessor {
  private htmlCleaner: HtmlCleaner;
  private rateLimiter: RateLimiter;
  private redisQueue: RedisQueue;
  private repository: BgWikiPageRepository;
  private workerId: string;
  private globalCooldownKey = 'bg-wiki-crawler-cooldown';

  constructor(workerId?: string) {
    this.htmlCleaner = new HtmlCleaner();
    this.rateLimiter = new RateLimiter(2000); // 0.5 QPS
    this.redisQueue = new RedisQueue();
    this.repository = new BgWikiPageRepository();
    this.workerId =
      workerId || `worker-${Math.random().toString(36).substr(2, 9)}`;
  }

  async initialize(): Promise<void> {
    await initializeDatabase();
    await this.redisQueue.connect();
    console.log(`Page processor ${this.workerId} initialized`);
  }

  async shutdown(): Promise<void> {
    await this.redisQueue.disconnect();
    console.log(`Page processor ${this.workerId} shutdown`);
  }

  async run(): Promise<void> {
    console.log(`Worker ${this.workerId} starting continuous processing...`);
    let processedCount = 0;
    const emptyQueueSleepMs = 10000; // 10 seconds

    while (true) {
      try {
        // Check if there are URLs in the queue
        const queueSize = await this.redisQueue.getQueueSize();
        if (queueSize === 0) {
          console.log(`No URLs in queue. Sleeping for ${emptyQueueSleepMs / 1000} seconds...`);
          await new Promise(resolve => setTimeout(resolve, emptyQueueSleepMs));
          continue;
        }

        // Check for global cooldown
        if (await this.redisQueue.isCooldownActive(this.globalCooldownKey)) {
          const ttl = await this.redisQueue.getCooldownTTL(
            this.globalCooldownKey
          );
          console.log(`Global cooldown active, waiting ${ttl} seconds...`);
          await new Promise(resolve => setTimeout(resolve, (ttl + 1) * 1000));
          continue;
        }

        // Get next URL from queue
        const url = await this.redisQueue.popUrl();
        if (!url) {
          console.log('No URL available (possible race condition)');
          continue;
        }

        try {
          console.log(`Processing URL (total processed: ${processedCount}): ${url}`);
          await this.processUrl(url);
          processedCount++;
          this.rateLimiter.onSuccess();
        } catch (error) {
          console.error(`Error processing URL ${url}:`, error);

          if (error instanceof AxiosError) {
            const statusCode = error.response?.status;

            if (statusCode === 429 || statusCode === 503 || statusCode === 403) {
              // Handle rate limiting by setting global cooldown
              const retryAfter =
                this.parseRetryAfter(error.response?.headers['retry-after']) ||
                30;
              await this.redisQueue.setCooldown(
                this.globalCooldownKey,
                retryAfter
              );
              console.log(
                `Set global cooldown for ${retryAfter} seconds due to status ${statusCode}`
              );

              // Put URL back in queue for retry
              await this.redisQueue.pushUrls([url]);
            }

            this.rateLimiter.onError(statusCode);
          }
        }

        // Apply worker-level rate limiting
        await this.rateLimiter.waitForNextRequest();
      } catch (error) {
        console.error('Unexpected error in processing loop:', error);
        // Sleep briefly to avoid tight error loops
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }

  private async processUrl(url: string): Promise<void> {
    // Fetch the web page
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'FFXI-Crawler/1.0 (Educational Purpose)',
      },
      timeout: 15000,
    });

    const rawHtml = response.data;

    // Extract last modified date
    const lastModified = this.htmlCleaner.extractLastModified(rawHtml);
    const title = this.htmlCleaner.extractTitle(rawHtml);

    console.log(`  Title: ${title}`);
    if (lastModified) {
      console.log(`  Last modified: ${lastModified.toISOString()}`);
    }

    // Check if we need to update this page
    const existingPage = await this.repository.findByUrl(url);

    let shouldUpdate = false;
    if (!existingPage) {
      console.log('  New page - will create');
      shouldUpdate = true;
    } else if (lastModified && existingPage.lastCrawled < lastModified) {
      console.log('  Page updated since last crawl - will update');
      shouldUpdate = true;
    } else if (!lastModified) {
      console.log(
        '  No lastModified date available - assuming page has been updated'
      );
      shouldUpdate = true;
    } else {
      console.log('  Page unchanged - skipping');
      return;
    }

    if (shouldUpdate) {
      // Clean the HTML
      const cleanedHtml = this.htmlCleaner.cleanHtml(rawHtml);
      const preview = this.htmlCleaner.getContentPreview(cleanedHtml);

      console.log(`  Content preview: ${preview}`);

      // Save to database
      await this.repository.upsertPage(url, cleanedHtml, new Date());
      console.log('  Saved to database');
    }
  }

  private parseRetryAfter(retryAfterHeader?: string): number | null {
    if (!retryAfterHeader) return null;

    const retryAfter = parseInt(retryAfterHeader, 10);
    return isNaN(retryAfter) ? null : retryAfter;
  }
}

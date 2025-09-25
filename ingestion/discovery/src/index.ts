import { BGWikiSitemapParser } from './bg-wiki-sitemap-parser';
import { RedisQueue } from '@ffxi/redis';

async function main() {
  const parser = new BGWikiSitemapParser();
  const queue = new RedisQueue();

  try {
    // Connect to Redis
    await queue.connect();

    // Fetch sitemap URLs from BG-Wiki
    console.log('=== Fetching sitemap URLs from BG-Wiki ===');
    const urls = await parser.fetchSitemapUrls();

    // Limit URLs for demonstration (first 500 URLs)
    const allUrls = urls.slice(0, 500);
    console.log(`Collected ${allUrls.length} URLs from sitemap`);

    // Push URLs to Redis queue
    console.log('\n=== Pushing URLs to Redis queue ===');
    console.log(`Total URLs collected: ${allUrls.length}`);

    if (allUrls.length > 0) {
      const addedCount = await queue.pushUrls(allUrls);
      console.log(`Successfully added ${addedCount} unique URLs to the queue`);

      // Show queue status
      const queueSize = await queue.getQueueSize();
      console.log(`Current queue size: ${queueSize}`);

      // Peek at some URLs
      const sampleUrls = await queue.peekUrls(5);
      console.log('\nSample URLs in queue:');
      sampleUrls.forEach((url, index) => {
        console.log(`  ${index + 1}. ${url}`);
      });
    }

    console.log('\n=== Discovery process completed successfully ===');
  } catch (error) {
    console.error('Error in discovery process:', error);
    process.exit(1);
  } finally {
    await queue.disconnect();
  }
}

// Run the discovery process
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});

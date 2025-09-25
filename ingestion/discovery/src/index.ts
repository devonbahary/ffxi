import { RobotsParser } from './robots-parser';
import { SitemapParser } from './sitemap-parser';
import { RedisQueue } from './redis-queue';

async function main() {
  const robotsParser = new RobotsParser();
  const sitemapParser = new SitemapParser();
  const queue = new RedisQueue();

  try {
    // Connect to Redis
    await queue.connect();

    // Step 1: Fetch and parse robots.txt
    console.log('=== Step 1: Fetching robots.txt ===');
    const robotsData = await robotsParser.fetchAndParse(
      'https://www.bg-wiki.com/robots.txt'
    );

    console.log(`Found ${robotsData.sitemaps.length} sitemap URLs:`);
    robotsData.sitemaps.forEach((sitemap, index) => {
      console.log(`  ${index + 1}. ${sitemap}`);
    });

    const crawlDelay = robotsParser.getCrawlDelay(robotsData);
    console.log(
      `🔍 Crawl delay: ${crawlDelay / 1000} seconds (will be respected by processing service, not discovery)`
    );

    // Step 2: Process sitemaps
    console.log('\n=== Step 2: Processing sitemaps ===');
    const allUrls: string[] = [];

    for (const sitemapUrl of robotsData.sitemaps) {
      try {
        console.log(`\nProcessing sitemap: ${sitemapUrl}`);
        const urls = await sitemapParser.fetchAndParse(sitemapUrl);

        // Limit URLs for demonstration (first 500 from each sitemap)
        const limitedUrls = urls.slice(0, 500).map(url => url.loc);
        allUrls.push(...limitedUrls);

        console.log(`Added ${limitedUrls.length} URLs from this sitemap`);

        // No delay for sitemap processing - we only respect crawl delay for actual page content
      } catch (error) {
        console.error(`Failed to process sitemap ${sitemapUrl}:`, error);
      }
    }

    // Step 3: Push URLs to Redis queue
    console.log('\n=== Step 3: Pushing URLs to Redis queue ===');
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

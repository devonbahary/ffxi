import { PageProcessor } from './page-processor';

async function main() {
  const workerId = process.argv[2] || `worker-${Date.now()}`;
  const maxUrls = parseInt(process.argv[3] || '10');

  console.log(`Starting page processor ${workerId} (max URLs: ${maxUrls})`);

  const processor = new PageProcessor(workerId);

  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\nReceived SIGINT, shutting down gracefully...');
    await processor.shutdown();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('\nReceived SIGTERM, shutting down gracefully...');
    await processor.shutdown();
    process.exit(0);
  });

  try {
    await processor.initialize();
    await processor.processUrls(maxUrls);
    console.log('Processing completed successfully');
  } catch (error) {
    console.error('Error in processing:', error);
    process.exit(1);
  } finally {
    await processor.shutdown();
  }
}

// Run the processor
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});

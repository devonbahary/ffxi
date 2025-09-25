import { PageProcessor } from './page-processor';

async function main() {
  const workerId = process.argv[2] || `worker-${Date.now()}`;

  console.log(`Starting continuous page processor ${workerId}`);

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
    await processor.run(); // This runs continuously until shutdown
  } catch (error) {
    console.error('Error in processing:', error);
    await processor.shutdown();
    process.exit(1);
  }
}

// Run the processor
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});

export class RateLimiter {
  private lastRequestTime: number = 0;
  private requestCount: number = 0;
  private backoffFactor: number = 1;
  private maxBackoffFactor: number = 8;
  private baseDelayMs: number;

  constructor(baseDelayMs = 2000) {
    // Default 0.5 QPS (1 request per 2 seconds)
    this.baseDelayMs = baseDelayMs;
  }

  async waitForNextRequest(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    const requiredDelay = this.baseDelayMs * this.backoffFactor;

    if (timeSinceLastRequest < requiredDelay) {
      const waitTime = requiredDelay - timeSinceLastRequest;
      console.log(
        `Rate limiting: waiting ${waitTime}ms (backoff factor: ${this.backoffFactor})`
      );
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    this.lastRequestTime = Date.now();
    this.requestCount++;
  }

  onSuccess(): void {
    // Gradually reduce backoff factor on successful requests
    this.backoffFactor = Math.max(1, this.backoffFactor * 0.9);
  }

  onError(statusCode?: number): void {
    // Increase backoff factor on errors, especially rate limiting errors
    if (statusCode === 429 || statusCode === 503 || statusCode === 403) {
      this.backoffFactor = Math.min(
        this.maxBackoffFactor,
        this.backoffFactor * 2
      );
      console.log(
        `Increased backoff factor to ${this.backoffFactor} due to status code ${statusCode}`
      );
    } else {
      this.backoffFactor = Math.min(
        this.maxBackoffFactor,
        this.backoffFactor * 1.5
      );
    }
  }

  getStats(): { requestCount: number; backoffFactor: number } {
    return {
      requestCount: this.requestCount,
      backoffFactor: this.backoffFactor,
    };
  }

  reset(): void {
    this.backoffFactor = 1;
    this.requestCount = 0;
  }
}

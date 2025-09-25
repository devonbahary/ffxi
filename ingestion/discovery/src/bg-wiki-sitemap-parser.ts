import axios from 'axios';
import * as cheerio from 'cheerio';
import { createGunzip } from 'zlib';
import { Readable } from 'stream';

export class BGWikiSitemapParser {
  private static readonly USER_AGENT = 'FFXI-Crawler/1.0 (Educational Purpose)';
  private static readonly TIMEOUT = 10000;
  private static readonly BG_WIKI_ROBOTS_URL =
    'https://www.bg-wiki.com/robots.txt';

  async fetchSitemapUrls(): Promise<string[]> {
    // Step 1: Get sitemap URL from robots.txt
    console.log(
      `Fetching robots.txt from ${BGWikiSitemapParser.BG_WIKI_ROBOTS_URL}`
    );
    const sitemapUrl = await this.fetchSitemapUrlFromRobots(
      BGWikiSitemapParser.BG_WIKI_ROBOTS_URL
    );

    if (!sitemapUrl) {
      throw new Error('No sitemap found in robots.txt');
    }

    // Step 2: Parse sitemap and return URLs
    console.log(`Processing sitemap: ${sitemapUrl}`);
    const urls = await this.fetchAndParseSitemap(sitemapUrl);
    return urls.map(url => url.loc);
  }

  private async fetchContent(url: string): Promise<string> {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': BGWikiSitemapParser.USER_AGENT,
      },
      timeout: BGWikiSitemapParser.TIMEOUT,
    });

    return typeof response.data === 'string'
      ? response.data
      : response.data.toString();
  }

  private async fetchSitemapUrlFromRobots(
    robotsUrl: string
  ): Promise<string | null> {
    try {
      const content = await this.fetchContent(robotsUrl);
      return this.parseRobotsTxt(content);
    } catch (error) {
      console.error(`Error fetching robots.txt from ${robotsUrl}:`, error);
      throw error;
    }
  }

  private parseRobotsTxt(content: string): string | null {
    const match = content.match(/^sitemap:\s*(.+)$/im);

    if (match) {
      const sitemapUrl = match[1].trim();
      console.log(`Found sitemap: ${sitemapUrl}`);
      return sitemapUrl;
    }

    console.log('No sitemap found in robots.txt');
    return null;
  }

  private async fetchAndParseSitemap(
    sitemapUrl: string
  ): Promise<Array<{ loc: string }>> {
    try {
      console.log(`Fetching sitemap: ${sitemapUrl}`);

      const response = await axios.get(sitemapUrl, {
        headers: {
          'User-Agent': BGWikiSitemapParser.USER_AGENT,
          'Accept-Encoding': 'gzip',
        },
        timeout: 30000,
        responseType: sitemapUrl.endsWith('.gz') ? 'stream' : 'text',
      });

      let content: string;

      if (sitemapUrl.endsWith('.gz')) {
        content = await this.decompressGzip(response.data);
      } else {
        content =
          typeof response.data === 'string'
            ? response.data
            : response.data.toString();
      }

      const isIndex = this.isSitemapIndex(content);

      if (isIndex) {
        return await this.parseSitemapIndex(content);
      } else {
        return this.parseSitemap(content);
      }
    } catch (error) {
      console.error(`Error fetching sitemap from ${sitemapUrl}:`, error);
      throw error;
    }
  }

  private async decompressGzip(stream: Readable): Promise<string> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      const gunzip = createGunzip();

      stream.pipe(gunzip);

      gunzip.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });

      gunzip.on('end', () => {
        resolve(Buffer.concat(chunks).toString('utf-8'));
      });

      gunzip.on('error', error => {
        reject(error);
      });
    });
  }

  private isSitemapIndex(content: string): boolean {
    return content.includes('<sitemapindex') || content.includes('<sitemap>');
  }

  private async parseSitemapIndex(
    content: string
  ): Promise<Array<{ loc: string }>> {
    const $ = cheerio.load(content, { xmlMode: true });
    const sitemapIndexes: Array<{ loc: string; lastmod?: string }> = [];

    $('sitemap').each((_, element) => {
      const loc = $(element).find('loc').text().trim();
      const lastmod = $(element).find('lastmod').text().trim();

      if (loc) {
        sitemapIndexes.push({
          loc,
          lastmod: lastmod || undefined,
        });
      }
    });

    console.log(`Found ${sitemapIndexes.length} sitemaps in index`);

    // Process all sitemaps (main content namespaces)
    const limitedSitemaps = sitemapIndexes.filter(
      sitemap =>
        sitemap.loc.includes('NS_0-') || // Main namespace
        sitemap.loc.includes('NS_102-') ||
        sitemap.loc.includes('NS_104-')
    );

    console.log(`Processing ${limitedSitemaps.length} sitemaps`);

    const allUrls: Array<{ loc: string }> = [];

    for (const sitemapIndex of limitedSitemaps) {
      try {
        console.log(`Parsing sitemap: ${sitemapIndex.loc}`);
        const urls = await this.fetchAndParseSitemap(sitemapIndex.loc);
        allUrls.push(...urls);
      } catch (error) {
        console.error(`Error parsing sitemap ${sitemapIndex.loc}:`, error);
      }
    }

    return allUrls;
  }

  private parseSitemap(content: string): Array<{ loc: string }> {
    const $ = cheerio.load(content, { xmlMode: true });
    const urls: Array<{ loc: string }> = [];

    $('url').each((_, element) => {
      const loc = $(element).find('loc').text().trim();

      if (loc) {
        urls.push({ loc });
      }
    });

    console.log(`Found ${urls.length} URLs in sitemap`);
    return urls;
  }
}

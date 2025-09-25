import axios from 'axios';
import * as cheerio from 'cheerio';
import { createGunzip } from 'zlib';
import { Readable } from 'stream';

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: string;
}

export interface SitemapIndex {
  loc: string;
  lastmod?: string;
}

export class SitemapParser {
  private userAgent: string;

  constructor(userAgent = 'FFXI-Crawler/1.0 (Educational Purpose)') {
    this.userAgent = userAgent;
  }

  async fetchAndParse(sitemapUrl: string): Promise<SitemapUrl[]> {
    try {
      console.log(`Fetching sitemap: ${sitemapUrl}`);

      const response = await axios.get(sitemapUrl, {
        headers: {
          'User-Agent': this.userAgent,
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

  private async parseSitemapIndex(content: string): Promise<SitemapUrl[]> {
    const $ = cheerio.load(content, { xmlMode: true });
    const sitemapIndexes: SitemapIndex[] = [];

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

    const allUrls: SitemapUrl[] = [];

    for (const sitemapIndex of limitedSitemaps) {
      try {
        console.log(`Parsing sitemap: ${sitemapIndex.loc}`);
        const urls = await this.fetchAndParse(sitemapIndex.loc);
        allUrls.push(...urls);

        // No delay for sitemap parsing - robots.txt delay applies to page content, not sitemaps
      } catch (error) {
        console.error(`Error parsing sitemap ${sitemapIndex.loc}:`, error);
      }
    }

    return allUrls;
  }

  private parseSitemap(content: string): SitemapUrl[] {
    const $ = cheerio.load(content, { xmlMode: true });
    const urls: SitemapUrl[] = [];

    $('url').each((_, element) => {
      const loc = $(element).find('loc').text().trim();
      const lastmod = $(element).find('lastmod').text().trim();
      const changefreq = $(element).find('changefreq').text().trim();

      if (loc) {
        urls.push({
          loc,
          lastmod: lastmod || undefined,
          changefreq: changefreq || undefined,
        });
      }
    });

    console.log(`Found ${urls.length} URLs in sitemap`);
    return urls;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

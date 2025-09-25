import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { BgWikiPage } from '../entities/BgWikiPage';

export class BgWikiPageRepository {
  private repository: Repository<BgWikiPage>;

  constructor() {
    this.repository = AppDataSource.getRepository(BgWikiPage);
  }

  async findByUrl(url: string): Promise<BgWikiPage | null> {
    return await this.repository.findOne({ where: { url } });
  }

  async createPage(
    url: string,
    html: string,
    lastCrawled: Date
  ): Promise<BgWikiPage> {
    const page = this.repository.create({
      url,
      html,
      lastCrawled,
    });
    return await this.repository.save(page);
  }

  async updatePageHtml(
    id: number,
    html: string,
    lastCrawled: Date
  ): Promise<void> {
    await this.repository.update(id, {
      html,
      lastCrawled,
    });
  }

  async upsertPage(
    url: string,
    html: string,
    lastCrawled: Date
  ): Promise<BgWikiPage> {
    const existingPage = await this.findByUrl(url);

    if (existingPage) {
      await this.updatePageHtml(existingPage.id, html, lastCrawled);
      return { ...existingPage, html, lastCrawled };
    } else {
      return await this.createPage(url, html, lastCrawled);
    }
  }

  async getAllUrls(): Promise<string[]> {
    const pages = await this.repository.find({ select: ['url'] });
    return pages.map(page => page.url);
  }

  async getPageCount(): Promise<number> {
    return await this.repository.count();
  }
}

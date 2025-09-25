import axios from 'axios';

export interface RobotsRule {
  userAgent: string;
  disallow: string[];
  allow: string[];
  crawlDelay?: number;
}

export interface RobotsData {
  rules: RobotsRule[];
  sitemaps: string[];
}

export class RobotsParser {
  private userAgent: string;

  constructor(userAgent = '*') {
    this.userAgent = userAgent;
  }

  async fetchAndParse(robotsUrl: string): Promise<RobotsData> {
    try {
      console.log(`Fetching robots.txt from ${robotsUrl}`);
      const response = await axios.get(robotsUrl, {
        headers: {
          'User-Agent': 'FFXI-Crawler/1.0 (Educational Purpose)',
        },
        timeout: 10000,
      });

      return this.parseRobotsTxt(response.data);
    } catch (error) {
      console.error(`Error fetching robots.txt from ${robotsUrl}:`, error);
      throw error;
    }
  }

  parseRobotsTxt(content: string): RobotsData {
    const lines = content.split('\n').map(line => line.trim());
    const rules: RobotsRule[] = [];
    const sitemaps: string[] = [];

    let currentRule: Partial<RobotsRule> | null = null;

    for (const line of lines) {
      if (!line || line.startsWith('#')) {
        continue;
      }

      const colonIndex = line.indexOf(':');
      if (colonIndex === -1) continue;

      const directive = line.substring(0, colonIndex).trim().toLowerCase();
      const value = line.substring(colonIndex + 1).trim();

      switch (directive) {
        case 'user-agent':
          if (currentRule) {
            rules.push(this.finalizeRule(currentRule));
          }
          currentRule = {
            userAgent: value,
            disallow: [],
            allow: [],
          };
          break;

        case 'disallow':
          if (currentRule) {
            currentRule.disallow!.push(value);
          }
          break;

        case 'allow':
          if (currentRule) {
            currentRule.allow!.push(value);
          }
          break;

        case 'crawl-delay':
          if (currentRule) {
            currentRule.crawlDelay = parseInt(value, 10);
          }
          break;

        case 'sitemap':
          sitemaps.push(value);
          break;
      }
    }

    if (currentRule) {
      rules.push(this.finalizeRule(currentRule));
    }

    console.log(
      `Found ${rules.length} robot rules and ${sitemaps.length} sitemaps`
    );
    return { rules, sitemaps };
  }

  private finalizeRule(rule: Partial<RobotsRule>): RobotsRule {
    return {
      userAgent: rule.userAgent || '*',
      disallow: rule.disallow || [],
      allow: rule.allow || [],
      crawlDelay: rule.crawlDelay,
    };
  }

  getCrawlDelay(robotsData: RobotsData): number {
    const applicableRules = robotsData.rules.filter(
      rule => rule.userAgent === '*' || rule.userAgent === this.userAgent
    );

    for (const rule of applicableRules) {
      if (rule.crawlDelay !== undefined) {
        return rule.crawlDelay * 1000;
      }
    }

    return 2000;
  }
}

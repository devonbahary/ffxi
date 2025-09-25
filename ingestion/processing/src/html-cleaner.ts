import * as cheerio from 'cheerio';

export class HtmlCleaner {
  cleanHtml(html: string): string {
    const $ = cheerio.load(html);

    // Remove ads and promotional content
    $(
      'div[class*="ad"], div[id*="ad"], .advertisement, .promo, .banner'
    ).remove();

    // Remove navigation elements
    $('.navbox, .navigation-not-searchable, .sidebar, .toc').remove();

    // Remove script and style tags
    $('script, style, noscript').remove();

    // Remove comments
    $('*')
      .contents()
      .filter(function () {
        return this.nodeType === 8; // Comment node
      })
      .remove();

    // Keep main content areas typical of MediaWiki
    const mainContent = $(
      '.mw-parser-output, #mw-content-text, .mw-content-ltr'
    ).html();

    if (mainContent) {
      return mainContent;
    }

    // Fallback: remove known unwanted elements and return body content
    $('header, footer, nav, aside, .printfooter, .catlinks, #footer').remove();

    return $('body').html() || $.html();
  }

  extractLastModified(html: string): Date | null {
    const $ = cheerio.load(html);

    // Look for "This page was last edited on" text
    const lastEditedText = $(
      '#footer-info-lastmod, .lastmodified, #lastmod'
    ).text();

    if (lastEditedText) {
      // Parse various date formats that might appear
      const dateMatch = lastEditedText.match(/(\d{1,2}\s+\w+\s+\d{4})/);
      if (dateMatch) {
        const parsedDate = new Date(dateMatch[1]);
        if (!isNaN(parsedDate.getTime())) {
          return parsedDate;
        }
      }
    }

    // Alternative: Look for any element containing last modified info
    const elements = $(
      '*:contains("last edited"), *:contains("last modified"), *:contains("Last modified")'
    );

    for (let i = 0; i < elements.length; i++) {
      const text = $(elements[i]).text();
      const dateMatch = text.match(/(\d{1,2}\s+\w+\s+\d{4})/);
      if (dateMatch) {
        const parsedDate = new Date(dateMatch[1]);
        if (!isNaN(parsedDate.getTime())) {
          return parsedDate;
        }
      }
    }

    // Look for ISO date patterns
    const isoDateMatch = html.match(/(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/);
    if (isoDateMatch) {
      const parsedDate = new Date(isoDateMatch[1]);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
      }
    }

    return null;
  }

  extractTitle(html: string): string {
    const $ = cheerio.load(html);

    // Try various selectors for page title
    let title = $('#firstHeading').text().trim();
    if (title) return title;

    title = $('h1.page-title, h1.entry-title, h1').first().text().trim();
    if (title) return title;

    title = $('title').text().trim();
    if (title) return title.replace(' - BG FFXI Wiki', '');

    return 'Unknown Title';
  }

  getContentPreview(html: string, maxLength = 200): string {
    const $ = cheerio.load(html);

    // Remove unwanted elements before getting text
    $('script, style, .navbox, .infobox, .toc').remove();

    const text = $.text().replace(/\s+/g, ' ').trim();

    return text.length > maxLength
      ? text.substring(0, maxLength) + '...'
      : text;
  }
}

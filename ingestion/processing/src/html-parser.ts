import * as cheerio from 'cheerio';

export class HtmlParser {
  cleanHtml(html: string): string {
    const $ = cheerio.load(html);

    // Remove scripts, styles, and noscripts first
    $('script, style, noscript').remove();

    // Remove ads and promotional content
    $(
      'div[class*="ad"], div[id*="ad"], .advertisement, .promo, .banner'
    ).remove();

    // Remove navigation elements
    $('.navbox, .navigation-not-searchable, .sidebar, .toc').remove();

    // Remove header, footer, nav, aside elements
    $('header, footer, nav, aside, .printfooter, .catlinks, #footer').remove();

    // Remove comments
    $('*')
      .contents()
      .filter(function () {
        return this.nodeType === 8; // Comment node
      })
      .remove();

    // Keep main content areas typical of MediaWiki
    let content = $('.mw-parser-output');

    if (content.length > 0) {
      // Remove presentational/styling elements but keep their text content
      const presentationalElements = [
        'b',
        'strong',
        'i',
        'em',
        'u',
        'span',
        'font',
        'small',
        'big',
        'strike',
        's',
        'sub',
        'sup',
      ];

      presentationalElements.forEach(tag => {
        content.find(tag).each(function () {
          $(this).replaceWith($(this).html() || '');
        });
      });

      // Clean up attributes within the main content
      // Keep only semantic and structural attributes
      const allowedAttributes = [
        'href',
        'src',
        'alt',
        'title',
        'colspan',
        'rowspan',
        'id',
      ];

      content.find('*').each(function () {
        const element = $(this);
        const attrs = Object.keys(this.attribs || {});

        attrs.forEach(attr => {
          if (!allowedAttributes.includes(attr)) {
            element.removeAttr(attr);
          }
        });
      });

      return content.html() || '';
    }

    // Fallback: process body content
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
}

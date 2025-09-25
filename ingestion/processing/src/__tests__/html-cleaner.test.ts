import { HtmlCleaner } from '../html-cleaner';

describe('HtmlCleaner', () => {
  let cleaner: HtmlCleaner;

  // Mock HTML based on actual BG-Wiki Ninja page structure
  const mockNinjaHtml = `
    <!DOCTYPE html>
    <html class="client-nojs" lang="en" dir="ltr">
    <head>
      <meta charset="UTF-8"/>
      <title>Ninja - FFXI Wiki</title>
      <script>
        document.documentElement.className="client-js";
        RLCONF={"wgBreakFrames":false,"wgTitle":"Ninja"};
      </script>
      <script>
        window.nitroAds = window.nitroAds || {
          createAd: function() {
            return new Promise(e => {
              window.nitroAds.queue.push(["createAd", arguments, e]);
            });
          }
        };
      </script>
      <link rel="stylesheet" href="/load.php?modules=skins.timeless"/>
      <style>
        .advertisement { display: block; }
        .sidebar { float: left; }
      </style>
    </head>
    <body class="mediawiki ltr sitedir-ltr">
      <!-- Navigation and ads that should be removed -->
      <div id="mw-header">
        <div id="p-search">Search content</div>
        <div class="advertisement">
          <div id="bgwiki-leaderboard-desktop"></div>
          <script type="text/javascript">
            window['nitroAds'].createAd('bgwiki-leaderboard-desktop');
          </script>
        </div>
      </div>

      <!-- Site notice with navigation that should be removed -->
      <div id="siteNotice">
        <div class="sitenotice navbox">
          <table class="sitenotice">
            <tr><td>Battle Content Links</td></tr>
          </table>
        </div>
      </div>

      <!-- Main content area that should be preserved -->
      <div id="mw-content">
        <h1 id="firstHeading" class="firstHeading mw-first-heading">
          <span class="mw-page-title-main">Ninja</span>
        </h1>

        <div id="mw-content-text" class="mw-body-content mw-content-ltr">
          <div class="mw-parser-output">
            <!-- TOC that should be removed -->
            <div id="toc" class="toc" role="navigation">
              <h2 id="mw-toc-heading">Contents</h2>
              <ul>
                <li><a href="#Abilities_and_Traits">Abilities and Traits</a></li>
                <li><a href="#Magic">Magic</a></li>
              </ul>
            </div>

            <!-- Main content that should be preserved -->
            <div class="thumb tright">
              <img src="/images/thumb/7/76/Ninja.jpg/300px-Ninja.jpg" alt="Ninja" width="300" height="533" />
              <div class="thumbcaption">Ninja</div>
            </div>

            <table class="wikitable">
              <tr><td bgcolor="#cacaca" colspan="2"><b>Ninja</b></td></tr>
              <tr><td bgcolor="#ebebeb">Abbreviation</td><td>NIN</td></tr>
              <tr><td bgcolor="#ebebeb">Japanese</td><td>忍者 (忍)</td></tr>
              <tr><td bgcolor="#ebebeb">Expansion Pack</td><td>Rise of the Zilart</td></tr>
            </table>

            <h2><span class="mw-headline" id="Abilities_and_Traits">Abilities and Traits</span></h2>
            <p>Ninja is a job that excels at evasion and ninjutsu magic.</p>

            <table class="wikitable">
              <tr><th colspan="2">Job Traits</th></tr>
              <tr><th>Lvl.</th><th>Name</th></tr>
              <tr><td><b>5</b></td><td>Stealth I</td></tr>
              <tr><td><b>10</b></td><td>Dual Wield I</td></tr>
            </table>

            <!-- Infobox that should be removed in preview but kept in main content -->
            <div class="infobox">
              <div>Additional Info</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer and navigation that should be removed -->
      <footer id="footer">
        <div id="footer-info">
          <div id="footer-info-lastmod">
            This page was last edited on 20 September 2024, at 21:01.
          </div>
          <div>Content is available under Creative Commons.</div>
        </div>
      </footer>

      <!-- Sidebar that should be removed -->
      <nav class="sidebar">
        <div>Navigation Links</div>
      </nav>

      <!-- Category links that should be removed -->
      <div class="catlinks">
        <div>Categories: Jobs</div>
      </div>

      <!-- Comments that should be removed -->
      <!-- This is a HTML comment -->
    </body>
    </html>
  `;

  beforeEach(() => {
    cleaner = new HtmlCleaner();
  });

  describe('cleanHtml', () => {
    it('should remove script tags and their content', () => {
      const result = cleaner.cleanHtml(mockNinjaHtml);

      expect(result).not.toContain('<script');
      expect(result).not.toContain('window.nitroAds');
      expect(result).not.toContain('RLCONF');
    });

    it('should remove style tags and their content', () => {
      const result = cleaner.cleanHtml(mockNinjaHtml);

      expect(result).not.toContain('<style');
      expect(result).not.toContain('.advertisement');
      expect(result).not.toContain('.sidebar');
    });

    it('should remove advertisement elements', () => {
      const result = cleaner.cleanHtml(mockNinjaHtml);

      expect(result).not.toContain('class="advertisement"');
      expect(result).not.toContain('bgwiki-leaderboard-desktop');
    });

    it('should remove navigation elements', () => {
      const result = cleaner.cleanHtml(mockNinjaHtml);

      expect(result).not.toContain('class="navbox"');
      expect(result).not.toContain('class="toc"');
      expect(result).not.toContain('mw-toc-heading');
    });

    it('should remove footer, header, and sidebar elements', () => {
      const result = cleaner.cleanHtml(mockNinjaHtml);

      expect(result).not.toContain('id="footer"');
      expect(result).not.toContain('class="sidebar"');
      expect(result).not.toContain('class="catlinks"');
    });

    it('should remove HTML comments', () => {
      const result = cleaner.cleanHtml(mockNinjaHtml);

      expect(result).not.toContain('<!-- This is a HTML comment -->');
    });

    it('should preserve main content from mw-parser-output', () => {
      const result = cleaner.cleanHtml(mockNinjaHtml);

      // Should preserve the main content
      expect(result).toContain('Ninja is a job that excels at evasion');
      expect(result).toContain('Abilities and Traits');
      expect(result).toContain('Rise of the Zilart');
      expect(result).toContain('Abbreviation');
      expect(result).toContain('NIN');
    });

    it('should preserve table structure and content', () => {
      const result = cleaner.cleanHtml(mockNinjaHtml);

      expect(result).toContain('<table');
      expect(result).toContain('class="wikitable"');
      expect(result).toContain('<tr>');
      expect(result).toContain('<td');
      expect(result).toContain('Stealth I');
      expect(result).toContain('Dual Wield I');
    });

    it('should preserve images and their attributes', () => {
      const result = cleaner.cleanHtml(mockNinjaHtml);

      expect(result).toContain('<img');
      expect(result).toContain('Ninja.jpg');
      expect(result).toContain('width="300"');
      expect(result).toContain('height="533"');
    });
  });

  describe('extractTitle', () => {
    it('should extract title from firstHeading element', () => {
      const title = cleaner.extractTitle(mockNinjaHtml);

      expect(title).toBe('Ninja');
    });

    it('should extract title from page title tag if firstHeading not found', () => {
      const htmlWithoutFirstHeading = `
        <html>
          <head><title>Test Page - BG FFXI Wiki</title></head>
          <body><div>Content</div></body>
        </html>
      `;

      const title = cleaner.extractTitle(htmlWithoutFirstHeading);

      expect(title).toBe('Test Page'); // HtmlCleaner should strip "- BG FFXI Wiki" suffix
    });

    it('should return "Unknown Title" if no title found', () => {
      const htmlWithoutTitle = '<html><body><div>Content</div></body></html>';

      const title = cleaner.extractTitle(htmlWithoutTitle);

      expect(title).toBe('Unknown Title');
    });
  });

  describe('extractLastModified', () => {
    it('should extract date from footer-info-lastmod element', () => {
      const lastModified = cleaner.extractLastModified(mockNinjaHtml);

      expect(lastModified).toBeInstanceOf(Date);
      expect(lastModified?.getFullYear()).toBe(2024);
      expect(lastModified?.getMonth()).toBe(8); // September (0-indexed)
      expect(lastModified?.getDate()).toBe(20);
    });

    it('should return null if no last modified date found', () => {
      const htmlWithoutDate =
        '<html><body><div>Content without date</div></body></html>';

      const lastModified = cleaner.extractLastModified(htmlWithoutDate);

      expect(lastModified).toBeNull();
    });

    it('should handle different date formats', () => {
      const htmlWithDifferentFormat = `
        <html>
          <body>
            <div>This page was last modified on 15 August 2023</div>
          </body>
        </html>
      `;

      const lastModified = cleaner.extractLastModified(htmlWithDifferentFormat);

      expect(lastModified).toBeInstanceOf(Date);
      expect(lastModified?.getFullYear()).toBe(2023);
      expect(lastModified?.getMonth()).toBe(7); // August (0-indexed)
    });
  });

  describe('getContentPreview', () => {
    it('should remove unwanted elements before generating preview', () => {
      const preview = cleaner.getContentPreview(mockNinjaHtml);

      expect(preview).not.toContain('window.nitroAds');
      expect(preview).not.toContain('Contents');
      expect(preview).not.toContain('Creative Commons');
    });

    it('should limit preview to maxLength characters', () => {
      const preview = cleaner.getContentPreview(mockNinjaHtml, 50);

      expect(preview.length).toBeLessThanOrEqual(53); // 50 + "..." = 53
      expect(preview).toMatch(/\.\.\.$/); // Should end with ...
    });

    it('should extract meaningful content for preview', () => {
      const preview = cleaner.getContentPreview(mockNinjaHtml, 200);

      expect(preview).toContain('Ninja');
      expect(preview).toMatch(/ninja|job|evasion|ninjutsu/i);
    });

    it('should normalize whitespace in preview', () => {
      const htmlWithExtraSpaces = `
        <html>
          <body>
            <div class="mw-parser-output">
              <p>This    has     multiple   spaces</p>
            </div>
          </body>
        </html>
      `;

      const preview = cleaner.getContentPreview(htmlWithExtraSpaces);

      expect(preview).toBe('This has multiple spaces');
    });

    it('should return content without ellipsis if under maxLength', () => {
      const shortHtml =
        '<html><body><div class="mw-parser-output">Short content</div></body></html>';

      const preview = cleaner.getContentPreview(shortHtml, 200);

      expect(preview).toBe('Short content');
      expect(preview).not.toContain('...');
    });
  });

  describe('integration tests', () => {
    it('should process a complete wiki page and extract all information', () => {
      // Test the full pipeline
      const cleanedHtml = cleaner.cleanHtml(mockNinjaHtml);
      const title = cleaner.extractTitle(mockNinjaHtml);
      const lastModified = cleaner.extractLastModified(mockNinjaHtml);
      const preview = cleaner.getContentPreview(cleanedHtml, 100);

      // Verify all methods work together
      expect(title).toBe('Ninja');
      expect(lastModified).toBeInstanceOf(Date);
      expect(cleanedHtml).toContain('Ninja is a job');
      expect(cleanedHtml).not.toContain('<script');
      expect(cleanedHtml).not.toContain('class="toc"');
      expect(preview).toContain('Ninja');
      expect(preview.length).toBeLessThanOrEqual(103); // 100 + "..." = 103
    });

    it('should handle malformed HTML gracefully', () => {
      const malformedHtml = `
        <html>
          <head><title>Test</title></head> <!-- Fixed closing tag for test -->
          <body>
            <div class="mw-parser-output">
              <p>Some content
              <div>Unclosed div
            </div>
          </body>
        </html>
      `;

      expect(() => {
        const cleaned = cleaner.cleanHtml(malformedHtml);
        const title = cleaner.extractTitle(malformedHtml);
        const preview = cleaner.getContentPreview(cleaned);

        expect(title).toBe('Test');
        expect(cleaned).toContain('Some content');
        expect(preview).toContain('Some content');
      }).not.toThrow();
    });

    it('should handle empty or minimal HTML', () => {
      const minimalHtml = '<html><body></body></html>';

      const cleaned = cleaner.cleanHtml(minimalHtml);
      const title = cleaner.extractTitle(minimalHtml);
      const lastModified = cleaner.extractLastModified(minimalHtml);
      const preview = cleaner.getContentPreview(cleaned);

      expect(title).toBe('Unknown Title');
      expect(lastModified).toBeNull();
      expect(preview).toBe('');
      expect(cleaned).toBeDefined();
    });
  });
});

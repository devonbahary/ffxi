# Task 002: Web Crawler (bg-wiki)

## Goal

Implement a web crawler for https://www.bg-wiki.com/ for data processing.

The pipeline includes two parts:

- discovery (frontier, URL gathering)
- processing (scraping, parsing HTML, updating data)

## Requirements

- create a new directory `/ingestion`
  - two new subprojects / workspaces should exist here: `/ingestion/discovery` and `ingestion/processing`
  - TypeScript + Node
  - should extend linting and formatting from monorepo root
- create a new directory `/packages`
  - create a new package in `/packages/sql`
    - this package should handle connections to and migrations for a Postgres DB
    - use TypeORM
    - create a table called `bg_wiki_pages`
      - id
      - url (index this)
      - html (text, close to raw as possible without much noise)
      - last_crawled (timestamp)

## Discovery

- retrieves `robots.txt` from https://www.bg-wiki.com/ and parses the `sitemap` URL
- downloads `sitemap` data from the URL and pushes URLs to a Redis queue

## Processing

- picks up jobs (urls) from the Redis queue, intended to be scaled out as multiple workers
- for each url, fetch the web page
  - use axios
  - implement rate-limiting
    - respond to 429, 503, and even 403 status codes by collectively backing off (set a Redis cooldown key with expiration)
      - check the `Retry-After` header or default to 30s
    - before fetching, have each worker check the presence of a shared Redis cooldown key
    - implement exponential backoff on a per-worker basis
    - each worker should not exceed more than 0.5 QPS (1 request / 2 seconds)
    - make the default Redis cooldown key and worker QPS configurable
  - parse the HTML for a last modified
    - use cheerio
    - look for the text "This page was last edited on <some date here>"
  - lookup the `bg_wiki_pages` record by URL
    - if there is no record for this URL, create one
    - if the record's `last_crawled` is older than the last modified, update the record's HTML
    - in both scenarios, the HTML column should be saved as a cleaned version of the HTML without ads or excess noise

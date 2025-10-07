# Task 003: HTML Processing (bg-wiki)

## Goal

Strip HTML pages down to only the meaningful parts so we don't store noise in the DB.

## Requirements
- set up a test in ingestion/processing
  - the test should take as an input the HTML response from https://www.bg-wiki.com/ffxi/Ninja. store this response as an .html file
  - the test should run the input through processing and compare it to another .html file, the desired output:
    - content to keep:
      - text
      - semantic structure (headings, lists, tables, links, sectioning tags, etc.)
      - attributes that relate to structure (e.g., colspan, rowspan), meaning (e.g., alt), or links (e.g., href)
    - strip out:
      - styling, layout, navigation, headers, footers
      - scripts
      - navigation, UI
      - meta, SEO
      - repetitive templates

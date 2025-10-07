const fs = require('fs');
const path = require('path');

// Import the HtmlParser class from compiled output
const { HtmlParser } = require('../../dist/ingestion/processing/src/html-parser');

// Read the input HTML file
const inputHtml = fs.readFileSync(
  path.join(__dirname, 'bg-wiki-ninja-page.html'),
  'utf-8'
);

// Create parser and process
const parser = new HtmlParser();
const cleanedHtml = parser.cleanHtml(inputHtml);

// Write the expected output
fs.writeFileSync(
  path.join(__dirname, 'bg-wiki-ninja-page-expected.html'),
  cleanedHtml,
  'utf-8'
);

console.log('Expected output generated successfully');
console.log('Length:', cleanedHtml.length, 'characters');

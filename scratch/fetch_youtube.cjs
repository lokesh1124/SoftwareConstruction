const fs = require('fs');
const https = require('https');

const filePath = 'src/data/indianDishes.ts';
let content = fs.readFileSync(filePath, 'utf8');

const matches = content.match(/youtubeUrl:\s*'https:\/\/www\.youtube\.com\/results\?search_query=([^']+)'/g);

console.log("Found matches:", matches ? matches.length : 0);

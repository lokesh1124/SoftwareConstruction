const fs = require('fs');
const https = require('https');

const filePath = 'src/data/indianDishes.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Regex to match the search query URLs
const regex = /youtubeUrl:\s*'https:\/\/www\.youtube\.com\/results\?search_query=([^']+)'/g;

let matches = [...content.matchAll(regex)];

if (matches.length === 0) {
  console.log("No matches found.");
  process.exit(0);
}

console.log(`Found ${matches.length} matches to process.`);

async function fetchVideoId(query) {
  return new Promise((resolve, reject) => {
    https.get(`https://www.youtube.com/results?search_query=${query}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const match = data.match(/"videoId":"([^"]{11})"/);
        if (match) {
          resolve(match[1]);
        } else {
          resolve(null);
        }
      });
    }).on('error', err => resolve(null));
  });
}

async function run() {
  let newContent = content;
  for (let i = 0; i < matches.length; i++) {
    const fullMatch = matches[i][0];
    const query = matches[i][1];
    console.log(`Processing ${i + 1}/${matches.length}: ${query}`);
    
    const videoId = await fetchVideoId(query);
    if (videoId) {
      const newUrl = `youtubeUrl: 'https://www.youtube.com/watch?v=${videoId}'`;
      newContent = newContent.replace(fullMatch, newUrl);
      console.log(` -> Replaced with ${videoId}`);
    } else {
      console.log(` -> Failed to find video ID`);
    }
    
    // small delay
    await new Promise(r => setTimeout(r, 100));
  }
  
  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log("Done updating indianDishes.ts");
}

run();

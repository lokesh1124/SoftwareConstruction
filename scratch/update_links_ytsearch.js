const fs = require('fs');
const ytSearch = require('yt-search');

const filePath = '../src/data/indianDishes.ts';
let content = fs.readFileSync(filePath, 'utf8');

const regex = /youtubeUrl:\s*'https:\/\/www\.youtube\.com\/results\?search_query=([^']+)'/g;
let matches = [...content.matchAll(regex)];

if (matches.length === 0) {
  console.log("No matches found.");
  process.exit(0);
}

console.log(`Found ${matches.length} matches to process.`);

async function run() {
  let newContent = content;
  for (let i = 0; i < matches.length; i++) {
    const fullMatch = matches[i][0];
    const queryStr = matches[i][1];
    const decodedQuery = decodeURIComponent(queryStr.replace(/\+/g, ' '));
    
    console.log(`Processing ${i + 1}/${matches.length}: ${decodedQuery}`);
    
    try {
      const r = await ytSearch(decodedQuery);
      const videos = r.videos;
      if (videos.length > 0) {
        const videoId = videos[0].videoId;
        const newUrl = `youtubeUrl: 'https://www.youtube.com/watch?v=${videoId}'`;
        newContent = newContent.replace(fullMatch, newUrl);
        console.log(` -> Found: https://www.youtube.com/watch?v=${videoId}`);
      } else {
        console.log(` -> No videos found.`);
      }
    } catch (e) {
      console.log(` -> Error fetching: ${e.message}`);
    }
    
    // small delay
    await new Promise(res => setTimeout(res, 500));
  }
  
  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log("Done updating indianDishes.ts");
}

run();

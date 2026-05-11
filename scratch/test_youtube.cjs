const https = require('https');

https.get('https://www.youtube.com/results?search_query=perfect+grilled+chicken+breast+high+protein+recipe', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const match = data.match(/"videoId":"([^"]{11})"/);
    if (match) {
      console.log("Found video ID:", match[1]);
    } else {
      console.log("No video ID found");
    }
  });
}).on('error', err => console.log(err));

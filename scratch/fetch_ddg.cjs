const https = require('https');

https.get({
  hostname: 'html.duckduckgo.com',
  path: '/html/?q=!yt+perfect+grilled+chicken+breast+high+protein+recipe',
  headers: { 'User-Agent': 'Mozilla/5.0' }
}, (res) => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => {
    console.log("Status:", res.statusCode);
    console.log("Location:", res.headers.location);
    if (res.statusCode === 301 || res.statusCode === 302) {
      console.log("Redirected to:", res.headers.location);
    }
  });
}).on('error', console.error);

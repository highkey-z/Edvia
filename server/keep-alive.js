// Keep-alive script to prevent Render from sleeping
const https = require('https');

const pingUrl = 'https://edvia.onrender.com/';

function ping() {
  https.get(pingUrl, (res) => {
    console.log(`Ping successful: ${res.statusCode}`);
  }).on('error', (err) => {
    console.log(`Ping failed: ${err.message}`);
  });
}

// Ping every 10 minutes (600 seconds)
setInterval(ping, 10 * 60 * 1000);

// Initial ping
ping();

console.log('Keep-alive script started. Pinging every 10 minutes.');

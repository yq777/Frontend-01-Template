const http = require('http');
const querystring = require('querystring');
const fs = require('fs');

let filename = 'cat.jpg';

fs.stat(`./${filename}`, (error, stat) => {
  const options = {
    host: 'localhost',
    port: 8081,
    path: `/?filename=${filename}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Length': stat.size,
    },
  };
  const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  });

  req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
  });

  // Write data to request body

  const readStream = fs.createReadStream(`./${filename}`);
  readStream.pipe(req);
  readStream.on('end', () => {
    req.end();
  });
});

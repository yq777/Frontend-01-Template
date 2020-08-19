const http = require('http');
const fs = require('fs');

// Create an HTTP tunneling proxy
const server = http.createServer((req, res) => {
  let matched = req.url.match(/filename=([^&]+)/);
  const filename = matched && matched[1];
  if (!filename) return;
  const writeStream = fs.createWriteStream(`../server/public/${filename}`);
  req.pipe(writeStream);
  req.on('end', () => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('okay');
  });
});

server.listen(8081);

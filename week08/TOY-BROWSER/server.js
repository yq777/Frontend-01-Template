const http = require('http');
const fs = require('fs');
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  const data = fs.readFileSync('flexDemo23.js');
  res.end(data.toString());
});
server.listen(8088);

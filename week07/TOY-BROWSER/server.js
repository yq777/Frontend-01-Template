const http = require('http');
const fs = require('fs');
const server = http.createServer((req, res) => {
  console.log('request receiverd');
  console.log(req.headers);
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  // 没有flex元素
  // const data = fs.readFileSync("flexDemo1.js");
  // 有flex元素
  // const data = fs.readFileSync("flexDemo2.js");
  // justify-content: flex-end
  // const data = fs.readFileSync('flexDemo3.js');
  // justify-content: center
  // const data = fs.readFileSync('flexDemo4.js');
  // justify-content: space-between
  // const data = fs.readFileSync('flexDemo5.js');
  // justify-content: space-around
  // const data = fs.readFileSync('flexDemo6.js');
  // flexDirection: row-reverse
  // const data = fs.readFileSync('flexDemo7.js');
  // flexDirection: column
  // const data = fs.readFileSync('flexDemo8.js');
  // flexDirection: column-reverse
  // const data = fs.readFileSync('flexDemo9.js');
  // alignContent: flex-start
  // const data = fs.readFileSync('flexDemo10.js');
  // alignContent: flex-end
  // const data = fs.readFileSync('flexDemo11.js');
  // alignContent: center
  // const data = fs.readFileSync('flexDemo12.js');
  // alignContent: space-between
  // const data = fs.readFileSync('flexDemo13.js');
  // alignContent: space-around
  // const data = fs.readFileSync('flexDemo14.js');
  // alignItems: flex-start
  // const data = fs.readFileSync('flexDemo15.js');
  // alignItems: flex-end
  // const data = fs.readFileSync('flexDemo16.js');
  // alignItems: center
  // const data = fs.readFileSync('flexDemo17.js');
  // alignSelf: flex-start
  // const data = fs.readFileSync('flexDemo18.js');
  // alignSelf: flex-end
  const data = fs.readFileSync('flexDemo19.js');
  // alignSelf: center
  // const data = fs.readFileSync('flexDemo20.js');
  // flexWrap: wrap
  // const data = fs.readFileSync('flexDemo21.js');
  // flexWrap: wrap-reverse
  // const data = fs.readFileSync('flexDemo22.js');
  // 子元素有flex元素 ？
  // const data = fs.readFileSync('flexDemo23.js');
  // flex布局不设定宽高
  // const data = fs.readFileSync('flexDemo24.js');
  res.end(data.toString());
});
server.listen(8088);

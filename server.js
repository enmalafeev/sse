const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3000;

const getRandomInt = max => Math.floor(Math.random() * max);

function sse(req, res) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  let data;
  let id = 0;

  const timer = setInterval(() => {
    data = getRandomInt(100);
    res.write(`data: ${data}\n`);
    res.write(`id: ${++id} \n`);
    res.write('\n');
  }, 2000);

  // setTimeout(() => {
  //   clearInterval(timer);
  //   res.write(`event: end-of-stream\n`);
  //   res.write('\n');
  //   res.end('ok');
  // }, 5000)

};

http.createServer((req, res) => {
  const url = new URL(`http://${req.headers.host}${req.url}`);

  if (url.pathname === '/stream') {
    sse(req, res);
    return;
  }
  const fileStream = fs.createReadStream(path.join(__dirname, 'index.html'));
  fileStream.pipe(res);
}).listen(port, () => {
  console.log(`Server started on ${port}`);
})
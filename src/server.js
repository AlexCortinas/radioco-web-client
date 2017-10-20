const request = require('request');
const http = require('http');
const port = 3000;

const requestHandler = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', '*');

  const url = req.url.substr(1);
  if (!url.startsWith('http')) {
    res.end();
    return;
  }
  request(url, (err, innerRes, body) => {
    res.end(body);
  });
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})

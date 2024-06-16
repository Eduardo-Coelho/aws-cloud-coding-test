const http = require('http');
const { getResponse } = require('./getResponse');
const { postResponse } = require('./postResponse');
const { unsupportedMethodResponse } = require('./unsupportedMethodResponse');
const port = 3000;

http
  .createServer((req, res) => {
    switch (req.method) {
      case 'GET':
        return getResponse(res);
      case 'POST':
        return postResponse(req, res);
      default:
        return unsupportedMethodResponse(res);
    }
  })
  .listen(port);

console.log(`Server listening on http://localhost:${port}`);

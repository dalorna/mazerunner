/**
 * Created by jason on 8/24/2017.
 */
var http = require('http');

http.createServer(function (req, res) {

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('Hello, world!');

}).listen(process.env.PORT || 8080);

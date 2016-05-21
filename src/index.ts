import http = require('http');

var serve = http.createServer(function (req, res) {
  res.write('Hello!');
  res.end();
});

serve.listen(3000);

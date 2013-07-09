var express = require('express');

var app = express.createServer(express.logger());

app.get('/', function(request, response) {
  var input= fs.readFileSync("index.html");
  response.send(input.toString());
// response.send('Hello World 2 again!');
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});

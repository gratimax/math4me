import express = require('express');

var app = express();

app.listen(3000, () => {
  console.log("Started server on port 3000");
});

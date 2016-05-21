import * as express from "express";
import {Game} from "./game";

var app = express();
var g = new Game("hello");

app.listen(3000, () => {
  console.log("Started server on port 3000");
});

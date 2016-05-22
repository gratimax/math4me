import * as socket from "socket.io-client";

import setupUI from "./ui/setup";

let io = socket.connect(window.location.href);

setupUI();
import {create as createStartingState} from "./client/startingState";

import setupUI from "./client/ui/setup";
import setupSocket, {socket} from "./client/socket";

let startingState = createStartingState(window.location.pathname);

setupSocket();
setupUI(startingState);
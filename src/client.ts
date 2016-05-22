import setupUI from "./client/ui/setup";
import setupSocket, {socket} from "./client/socket";

setupSocket();
setupUI();
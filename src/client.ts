import setupUI from "./client/ui/setup";
import setupSocket, {socket} from "./client/socket";

import * as gen from "./gen";

setupSocket();
setupUI();

var exprFrac = gen.getExprFrac(0, 10, 5, gen.defaultTransforms);
console.log(exprFrac[0]);
console.log(gen.frac2s(exprFrac[1]));